#!/usr/bin/env python3
# coding: utf-8
# Copyright 2016 Abram Hindle, https://github.com/tywtyw2002, and https://github.com/treedust
# 
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
# 
#     http://www.apache.org/licenses/LICENSE-2.0
# 
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# Do not use urllib's HTTP GET and POST mechanisms.
# Write your own HTTP GET and POST
# The point is to understand what you have to send and get experience with it

#MIT LICENSE

#Copyright <2018> <Mohamad Jamaleddine>

#Permission is hereby granted, free of charge, to any person
#obtaining a copy of this software and associated
#documentation files (the "Software"), to deal in the
#Software without restriction, including without limitation
#the rights to use, copy, modify, merge, publish,
#distribute, sublicense, and/or sell copies of the Software,
#and to permit persons to whom the Software is furnished to
#do so, subject to the following conditions:

#The above copyright notice and this permission notice shall
#be included in all copies or substantial portions of the
#Software.

#THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY
#KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
#WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
#PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
#OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR
#OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
#OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
#SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

''' 
ASSIGNMENT #: 2
NAME: MOHAMAD JAMALEDDINE
CCID: jamaledd
Collaborators: Thomas Lafrance
'''

import random
import re
import sys
import socket
# you may use urllib to encode data appropriately
import urllib.parse

# From freetests.py
BASEHOST = '127.0.0.1'
BASEPORT = 27600 + random.randint(1,100)

def help():
    print("httpclient.py [GET/POST] [URL]\n")

class HTTPResponse(object):
    def __init__(self, code = 200, body = ""):
        self.code = code
        self.body = body
        
    def __str__(self):
        return (str(self.code) + ", " + self.body)

class HTTPClient(object):
    #def get_host_port(self,url):

    # URL parser that was imported from urllib.parse
    # https://docs.python.org/3/library/urllib.parse.html
    # Date Accessed: Feb 17th, 2018
    def url_parse(self, url):
        parsed_url = urllib.parse.urlparse(url)
        url_scheme = parsed_url.scheme
        url_host = parsed_url.hostname
        url_port = parsed_url.port
        url_path = parsed_url.path
        return url_scheme, url_host, url_port, url_path
    
    def get_port(self, port, scheme):
        if scheme == "http":
            port = 80
        elif scheme == "https":
            port = 443
        else:
            port = BASEPORT
        return port
    
    def connect(self, host, port):
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.socket.connect((host, port))
        return None

    # https://docs.python.org/3/library/re.html
    # Date Accessed: Feb 17th, 2018
    def get_code(self, data):
        code = re.search(("\d{3}"), data)
        code = code.group()
        return int(code)

    #def get_headers(self,data):
    #   return None

    # https://www.tutorialspoint.com/python/string_find.html
    # Date Accessed: Deb 17th, 2018
    # Returns body without Line Feed \n and Carriage Return \r
    # Also used the help of Lab 3
    def get_body(self, data):
        esc_chars = data.find("\r\n\r\n")
        
        # -1 if index is not found
        if esc_chars != -1:
            return data[esc_chars + 4:]
        else:
            return ('')
    
    def sendall(self, data):
        self.socket.sendall(data.encode('utf-8'))
        
    def close(self):
        self.socket.close()

    # read everything from the socket
    # https://docs.python.org/2/library/socket.html
    #https://www.youtube.com/watch?v=wzrGwor2veQ
    # Date Accessed: Feb 17th, 2018 (For both)
    def recvall(self, sock):
        buffer = bytearray()
        done = False
        while not done:
            part = sock.recv(1024)
            if (part):
                buffer.extend(part)
            else:
                done = not part
        return buffer.decode('utf-8')

    # https://stackoverflow.com/questions/9752958/how-can-i-return-two-values-from-a-function-in-python
    # Date Accessed : Feb 17th, 2018
    def GET(self, url, args = None):
        
        GET_scheme, GET_host, GET_port, GET_path = self.url_parse(url)
        
        
        if GET_port == None:
            GET_port = self.get_port(GET_port, GET_scheme)
            
        self.connect(GET_host, GET_port)
        
        # To handle http://Slashdot.org
        if GET_path == "":
            GET_request = "GET / HTTP/1.1\nHost: " + GET_host + "\n\n"
        else:
            GET_request = "GET " + GET_path + " HTTP/1.1\nHost: " + GET_host + "\n\n"
        
        self.sendall(GET_request)
        data = self.recvall(self.socket)
        code = self.get_code(data)
        body = self.get_body(data)
        #print(body)
        self.close()
        return HTTPResponse(code, body)

    def POST(self, url, args = None):
        
        POST_scheme, POST_host, POST_port, POST_path = self.url_parse(url)
        self.connect(POST_host, POST_port)
        
        if (args != None):
            dictlist = []
            args = list(args.items())
            for key, value in args:
                temp = key + "=" + value
                dictlist.append(temp)
            args = "&".join(dictlist)
            POST_request = "POST " + POST_path + " HTTP/1.1\nHost: " + POST_host + "\nContent-Length: " + str(len(args)) + "\nContent-Type: application/x-www-form-urlencoded" + "\n\n" + args + "\n"         
        else:
            POST_request = "POST " + POST_path + " HTTP/1.1\nHost: " + POST_host + "\nContent-Length: 0" + "\nContent-Type: application/x-www-form-urlencoded" + "\n\n"
            
        self.sendall(POST_request)
        data = self.recvall(self.socket)
        code = self.get_code(data)
        body = self.get_body(data)
        #print("\n" + body)
        self.close()
        return HTTPResponse(code, body)

    def command(self, url, command="GET", args = None):
        
        if (command == "POST"):
            return self.POST( url, args )
        else:
            return self.GET( url, args )
    
if __name__ == "__main__":
    
    client = HTTPClient()
    command = "GET"
    
    if (len(sys.argv) <= 1):
        help()
        sys.exit(1)
    elif (len(sys.argv) == 3):
        print(client.command( sys.argv[2], sys.argv[1] ))
    else:
        print(client.command( sys.argv[1] ))