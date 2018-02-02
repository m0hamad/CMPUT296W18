# Weclome to Assignment #1!

# Your name: Mohamad Jamaleddine
# The [due] date: February 2nd, 2018
# The names of any students you consulted with:

# Paste the license you choose for your assignment here.
#MIT License

#Copyright (c) [2018] [Mohamad Jamaleddine]

#Permission is hereby granted, free of charge, to any person obtaining a copy
#of this software and associated documentation files (the "Software"), to deal
#in the Software without restriction, including without limitation the rights
#to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
#copies of the Software, and to permit persons to whom the Software is
#furnished to do so, subject to the following conditions:

#The above copyright notice and this permission notice shall be included in all
#copies or substantial portions of the Software.

#THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
#IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
#FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
#AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
#LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
#OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
#SOFTWARE.

# Instructions: write a URL parser library in Python 3. This file should contain
# function that when called with a URL will return a 6-tuple of information
# about that URL: the scheme (protocol), the host, the port (or None if there
# is no port specified), the path as a list,
# the query arguments as a dictionary of lists,
# and the fragment.

# For example, if the provided URL is 
# http://localhost:8080/cats/cute/index.html?tag=fuzzy&tag=little+pawsies&show=data%26statistics#Statistics
# then your function should return the following Pythong data structure:
(
    'http',
    'localhost',
    8080,
    [
        'cats',
        'cute',
        'index.html',
        ],
    {
        'tag': [
            'fuzzy',
            'little pawsies',
            ],
        'show': [
            'data&statistics',
            ],
        },
    'Statistics'
    )

# Your function must be named parse_url. I've given you some starter code
# below. There is an accompanying file with this assignment called
# free_tests.py which you should run to test your code. It will call your
# function with various URLs and tell you whether your function returns
# the correct information or not.

# When marking your assignment I will use another file, similar to
# free_tests.py that will test your function in the same way, but using
# different URLs. Your mark on this assignment will be the fraction of
# URLs your function parses correctly. 

# If you are not familiar with tuples, dictionaries and lists in Python please,
# familiarize yourself.

# Do not forget to CITE any code you use from the web or other resources.
# YOU ARE NOT ALLOWED TO USE ANY LIBRARIES CAPABLE OF PARSING URLS OR DECODING
# PERCENT-ENCODED DATA. DOING SO WILL RESULT IN A ZERO MARK FOR THIS
# ASSIGNMENT. IF YOU ARE UNSURE WHETHER YOU CAN USE A PARTICULAR LIBRARY
# PLEASE POST ON ECLASS AND ASK. IF YOU DID NOT ASK TO USE A LIBRARY
# AND USE IT ANYWAY YOU MAY RECIEVE A ZERO MARK FOR THIS ASSIGNMENT.

# Submission instructions: Upload your version of
# this file to eClass under Assignment 1.

# Here is some code to get you started:

# Splits the queries into "=" parts
def equal_split(query):
    i = 0
    query = query.split("|")    
    while i < len(query):
        query[i] = query[i].split("=") 
        i += 1
    return query

# Removes plus sign from URL
def remove_plus(url):
    for i in range(len(url)):
        if "+" in url:
            url = url.split("+")
            url = " ".join(url)
    return url

# Remove '&' characters that are already there before I decode the URL, replace them wit '|' (not l)
def remove_ampersand(url):
    for i in range(len(url)):
        if "&" in url:
            url = url.split("&")
            url = "|".join(url)
    return url

# https://stackoverflow.com/questions/12468179/unicodedecodeerror-utf8-codec-cant-decode-byte-0x9c
# DATE ACCESSED: FEB 2nd, 2018
# decoded = bytearray.fromhex(to_decode).decode('utf-8') was my initial line of code, but i used
# .decode('cp1252') method instead and it solve my issue for John_C._FrÃ©mont'
# This function percent decodes my URL
def percent_decode(url):
    while "%" in url:
        percent = url.index("%")
        to_decode = url[percent + 1: percent + 3]
        print(to_decode)
        decoded = bytearray.fromhex(to_decode).decode('cp1252')
        url[percent].replace("%", "")
        url = url[0:percent] + decoded + url[percent+3:]
    return url

# For this function, I basically used what you had for parsing the schema, and sort of implemented
# it throughout the entirety of the function.
def parse_url(url):
    
    url = remove_plus(url)
    url = remove_ampersand(url)
    url = percent_decode(url)
    scheme_ends = url.index("://")
    scheme = url[0:scheme_ends]
    
    url2 = url[scheme_ends + 3:]
    
    # Since the port will be the only item after the schema in the URL to have a ":" symbol, if it
    # does exist, then I find the port and add it to the tuple, otherwise port is equal to None.
    # Either way, we end up adding the host first.
    if ":" in url2 and "/" in url2[url2.index(":"):url2.index(":") + 6]:
        host_ends2 = url2.index(":")
        host = url2[0:host_ends2]
        
        url3 = url2[host_ends2 + 1:]
        port_ends = url3.index("/")
        port = url3[0:port_ends]
        url4 = url3[port_ends + 1:]
        
    else:
        port = None
        host_ends = url2.index("/")
        host = url2[0:host_ends]
        url4 = url2[host_ends + 1:]
        
    # The whole if/elif/elif/else block out if there is a query section, fragment section or just 
    # paths left.
    
    # We check if query is next, we add path(s) to list, then we move on to query.
    if "?" in url4:
        path_ends = url4.index("?")
        paths = url4[0:path_ends]
        paths = paths.split("/")
        url5 = url4[path_ends + 1:]
    # No query, just fragment, we add paths to list then we move on to deal with fragments
    elif "#" in url4:
        path_ends = url4.index("#")
        paths = url4[0:path_ends]
        paths = paths.split("/")
        url5 = url4[path_ends + 1:]
    # No query or Fragment, we deal with just paths.    
    elif "/" in url4:
        paths = url4[0:]
        paths = paths.split("/")
        url5 = None
    else:
        paths = ['']
        url5 = None
        
    # Check if query exists and then organizing the query into key:value pairs in a dictionary.
    # The value will be a list of values.
    # Shoutout to Josh (instructor) for helping me with the dictionary part :D
    if url5 != None and "#" in url5:
        query_ends = url5.index("#")
        query = url5[0:query_ends]
        query = equal_split(query)
        query_dict = {}
        
        for i in range(len(query)):
            for j in range(len(query[i]) - 1):
                if query[i][j] in query_dict:
                    query_dict[query[i][j]].append(query[i][j+1])
                else:
                    query_dict[query[i][j]] = [query[i][j+1]]
        
        fragment = url5[query_ends + 1:]
        
    elif url5 == None or url5 == " ":
        query_dict = {}
        fragment = ''
    elif url4[path_ends] == "#":
        fragment = url5.split(",")
        query_dict = {}
    else:
        query = url5
        query = equal_split(query)
        print(query)    
        print(" ")
        query_dict = {}
        for i in range(len(query)):
            for j in range(len(query[i]) - 1):
                if query[i][j] in query_dict:
                    query_dict[query[i][j]].append(query[i][j+1])
                else:
                    query_dict[query[i][j]] = [query[i][j+1]]
        fragment = ''
        
    end_tuple = (
        scheme,
        host,
        port,
        paths,
        query_dict,
        fragment
    )
    
    return end_tuple

def main():

    url = 'https://www.google.ca/'
    print(parse_url(url))
    print(" ")
    
main()