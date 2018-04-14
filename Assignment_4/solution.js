// Mohamad Jamaleddine
// CCID: jamaledd
// CMPUT 296 Assignment 4
// Collaborators: Thomas Lafrance (for part 3 only)

/*
MIT License
Copyright (c) 2018 Mohamad Jamaleddine
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

let session, status, money, player_hand, dealer_hand, result, last_bet, won, amt, animated_elem;

class Gambler {

  constructor(url, token) {
    this.url = url;
    this.token = token;

    fetch(url)
      .then(function (response) {
        return response.text().then(function (myJson) {
          console.log(myJson);
        });
      });

    let formData = new FormData();
    formData.append("token", token);
    fetch(url + "/sit", {
      method: "POST",
      body: formData
    })
      .then(function (response) {
        document.getElementsByName("up")[0].innerText = response.statusText;
        return response.json();
      })
      .then(function(myJson) {
        session = document.getElementsByName("session")[0].value = myJson.session;
        money = document.getElementsByName("money")[0].value = myJson.money;
        console.log(session);
      })
    
    //document.getElementsByName("money")[0].value = 2000;
    
    document.getElementsByName("stand")[0].disabled = true;
    document.getElementsByName("hit")[0].disabled = true;
    document.getElementsByName("double_down")[0].disabled = true;
    document.getElementsByName("surrender")[0].disabled = true;
    
  }

  // Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
  convert_to_face(dealer_hand) {
    for (let i = 0; i < dealer_hand.length; i++) {
      if (dealer_hand[i] == 1) {
        dealer_hand[i] = "A"
      } else if (dealer_hand[i] == 11) {
        dealer_hand[i] = "J"
      } else if (dealer_hand[i] == 12) {
        dealer_hand[i] = "Q"
      } else if (dealer_hand[i] == 13) {
        dealer_hand[i] = "A"
      }
    }
  }

  // https://www.w3schools.com/js/js_htmldom_animate.asp
  animate_me(elem) {
    var pos = 0;
    var id = setInterval(frame, 5);
    function frame() {
      if (pos == 350) {
        clearInterval(id);
      } else {
        pos++;
        elem.style.top = pos + 'px';
        elem.style.left = pos + 'px';
      }
    }
  }

  // BET FUNCTION
  bet(amount) {

    amt = amount;
    document.getElementsByName("money")[0].value -= amount;

    let formData = new FormData();
    formData.append("token", this.token);
    formData.append("amount", amount);
    fetch(this.url + session + "/bet", {
      method: "POST",
      body: formData
    })
    .then(function (response) {
      document.getElementsByName("up")[0].innerText = response.statusText;
      return response.json();
    })
    .then(function (myJson) {
      dealer_hand = document.getElementsByName("dealer_hand")[0].innerText = myJson.game.dealer_hand;
      player_hand = document.getElementsByName("player_hand")[0].innerText = myJson.game.player_hand;
      last_bet = document.getElementsByName("last_bet")[0].innerHTML = myJson.game.last_bet;
      if (document.getElementsByName("dealer_hand")[0].innerText == "1"){
        document.getElementsByName("dealer_hand")[0].innerText = "A";
      } else if (document.getElementsByName("dealer_hand")[0].innerText == "11") {
        document.getElementsByName("dealer_hand")[0].innerText = "J";
      } else if (document.getElementsByName("dealer_hand")[0].innerText == "12") {
        document.getElementsByName("dealer_hand")[0].innerText = "Q";
      } else if (document.getElementsByName("dealer_hand")[0].innerText == "13") {
        document.getElementsByName("dealer_hand")[0].innerText = "K";
      }
      let converter = document.getElementsByName("player_hand")[0].innerText;
      converter = converter.split(",");
      for (var i = 0; i < converter.length; i++) {
        if (converter[i] == 1) {
          converter[i] = "A"
        } else if (converter[i] == 11) {
          converter[i] = "J"
        } else if (converter[i] == 12) {
          converter[i] = "Q"
        } else if (converter[i] == 13) {
          converter[i] = "A"
        }
      }
      console.log(converter);
      converter = converter.toString();
      console.log(converter);

      document.getElementsByName("player_hand")[0].innerText = converter;
      
    });

    //console.log(this.url + session + "/bet");
    document.getElementsByName("betButton")[0].disabled = true;
    document.getElementsByName("stand")[0].disabled = false;
    document.getElementsByName("hit")[0].disabled = false;
    document.getElementsByName("double_down")[0].disabled = false;
    document.getElementsByName("surrender")[0].disabled = false;

    // let alpha_rep;
    // if (dealer_hand[0] == 1) {
    //   alpha_rep = "A"
    //   document.getElementsByName("dealer_hand")[0].value = alpha_rep;
    // } else if (dealer_hand[0] == 11) {
    //   alpha_rep = "J"
    //   document.getElementsByName("dealer_hand")[0].value = alpha_rep;
    // } else if (dealer_hand[0] == 12) {
    //   alpha_rep = "Q"
    //   document.getElementsByName("dealer_hand")[0].value = alpha_rep;
    // } else if (dealer_hand[0] == 13) {
    //   alpha_rep = "K"
    //   document.getElementsByName("dealer_hand")[0].value = alpha_rep;
    // } else {
    //   document.getElementsByName("dealer_hand")[0].value = dealer_hand[0];
    // }

    // document.getElementsByName("last_bet")[0].value = amount;
  }

  // STAND FUNCTION
  stand() {
    let formData = new FormData();
    formData.append("token", this.token);
    fetch(this.url + session + "/stand", {
      method: "POST",
      body: formData
    })
      .then(function (response) {
        document.getElementsByName("up")[0].innerText = response.statusText;
        return response.json();
      })
      .then(function (myJson) {
        dealer_hand = document.getElementsByName("dealer_hand")[0].innerHTML = myJson.last_game.dealer_hand;
        player_hand = document.getElementsByName("player_hand")[0].innerHTML = myJson.last_game.player_hand;
        result = document.getElementsByName("result")[0].innerHTML = myJson.last_game.result;
        money = document.getElementsByName("money")[0].innerHTML = myJson.money;
        

        document.getElementsByName("result")[0].style.color = "#FF69B4";
        document.getElementsByName("result")[0].style.fontFamily = "monospace";
        document.getElementsByName("result")[0].style.position = "absolute"

        var pos = 0;
        var id = setInterval(frame, 1);
        function frame() {
          if (pos == 350) {
            clearInterval(id);
          } else {
            pos++;
            (document.getElementsByName("result")[0]).style.top = pos + 'px';
            (document.getElementsByName("result")[0]).style.left = pos + 'px';
          }
        }

        document.getElementsByName("result")[0].style.fontSize = "150px";

        won = document.getElementsByName("won")[0].innerHTML = myJson.last_game.won;

        let converter1 = document.getElementsByName("dealer_hand")[0].innerHTML;
        let converter2 = document.getElementsByName("player_hand")[0].innerHTML;

        converter1 = converter1.split(",");
        for (var i = 0; i < converter1.length; i++) {
          if (converter1[i] == 1) {
            converter1[i] = "A"
          } else if (converter1[i] == 11) {
            converter1[i] = "J"
          } else if (converter1[i] == 12) {
            converter1[i] = "Q"
          } else if (converter1[i] == 13) {
            converter1[i] = "A"
          }
        }
        console.log(converter1);
        converter1 = converter1.toString();
        console.log(converter1);

        document.getElementsByName("dealer_hand")[0].innerText = converter1;

        converter2 = converter2.split(",");
        for (var i = 0; i < converter2.length; i++) {
          if (converter2[i] == 1) {
            converter2[i] = "A"
          } else if (converter2[i] == 11) {
            converter2[i] = "J"
          } else if (converter2[i] == 12) {
            converter2[i] = "Q"
          } else if (converter2[i] == 13) {
            converter2[i] = "A"
          }
        }
        console.log(converter2);
        converter2 = converter2.toString();
        console.log(converter2);

        document.getElementsByName("player_hand")[0].innerText = converter2;
      });

    document.getElementsByName("stand")[0].disabled = true;
    document.getElementsByName("hit")[0].disabled = true;
    document.getElementsByName("double_down")[0].disabled = true;
    document.getElementsByName("surrender")[0].disabled = true;
  }

  // HIT FUNCTION
  hit() {
    let formData = new FormData();
    formData.append("token", this.token);
    fetch(this.url + session + "/hit", {
      method: "POST",
      body: formData
    })
      .then(function (response) {
        document.getElementsByName("up")[0].innerText = response.statusText;
        return response.json();
      })
      .then(function (myJson) {
        if (dealer_hand = document.getElementsByName("dealer_hand")[0].innerHTML = myJson.last_game.dealer_hand) {
          dealer_hand = document.getElementsByName("dealer_hand")[0].innerHTML = myJson.last_game.dealer_hand
        } else {
          dealer_hand = document.getElementsByName("dealer_hand")[0].innerHTML = myJson.game.dealer_hand
        }
        if (player_hand = document.getElementsByName("player_hand")[0].innerHTML = myJson.last_game.player_hand) {
          player_hand = document.getElementsByName("player_hand")[0].innerHTML = myJson.last_game.player_hand
        } else {
          player_hand = document.getElementsByName("player_hand")[0].innerHTML = myJson..player_hand
        }
        result = document.getElementsByName("result")[0].innerHTML = myJson.last_game.result;
        money = document.getElementsByName("money")[0].innerHTML = myJson.money;

        document.getElementsByName("result")[0].style.color = "#FF69B4";
        document.getElementsByName("result")[0].style.fontFamily = "monospace";
        document.getElementsByName("result")[0].style.fontSize = "150px";
        document.getElementsByName("result")[0].style.position = "absolute";

        var pos = 0;
        var id = setInterval(frame, 5);
        function frame() {
          if (pos == 350) {
            clearInterval(id);
          } else {
            pos++;
            (document.getElementsByName("result")[0]).style.top = pos + 'px';
            (document.getElementsByName("result")[0]).style.left = pos + 'px';
          }
        }


        if ((document.getElementsByName("dealer_hand")[0].innerHTML).length == 1) {

          if (document.getElementsByName("dealer_hand")[0].innerText == "1") {
            document.getElementsByName("dealer_hand")[0].innerText = "A";
          } else if (document.getElementsByName("dealer_hand")[0].innerText == "11") {
            document.getElementsByName("dealer_hand")[0].innerText = "J";
          } else if (document.getElementsByName("dealer_hand")[0].innerText == "12") {
            document.getElementsByName("dealer_hand")[0].innerText = "Q";
          } else if (document.getElementsByName("dealer_hand")[0].innerText == "13") {
            document.getElementsByName("dealer_hand")[0].innerText = "K";
          }
        } else {
          let converter1 = document.getElementsByName("dealer_hand")[0].innerHTML;

          converter1 = converter1.split(",");
          for (var i = 0; i < converter1.length; i++) {
            if (converter1[i] == 1) {
              converter1[i] = "A"
            } else if (converter1[i] == 11) {
              converter1[i] = "J"
            } else if (converter1[i] == 12) {
              converter1[i] = "Q"
            } else if (converter1[i] == 13) {
              converter1[i] = "A"
            }
          }
          console.log(converter1);
          converter1 = converter1.toString();
          console.log(converter1);

          document.getElementsByName("dealer_hand")[0].innerText = converter1;
        }

        let converter2 = document.getElementsByName("player_hand")[0].innerHTML;

        converter2 = converter2.split(",");
        for (var i = 0; i < converter2.length; i++) {
          if (converter2[i] == 1) {
            converter2[i] = "A"
          } else if (converter2[i] == 11) {
            converter2[i] = "J"
          } else if (converter2[i] == 12) {
            converter2[i] = "Q"
          } else if (converter2[i] == 13) {
            converter2[i] = "A"
          }
        }
        console.log(converter2);
        converter2 = converter2.toString();
        console.log(converter2);

        document.getElementsByName("player_hand")[0].innerText = converter2;
    });

    document.getElementsByName("surrender")[0].disabled = true;
  }

  // DOUBLE DOWN FUNCTION
  double_down() {
    let formData = new FormData();
    formData.append("token", this.token);
    fetch(this.url + session + "/double_down", {
      method: "POST",
      body: formData
    })
      .then(function (response) {
        document.getElementsByName("up")[0].innerText = response.statusText;
        return response.json();
      })
      .then(function (myJson) {
      })
      .then(function (myJson) {
        dealer_hand = document.getElementsByName("dealer_hand")[0].innerHTML = myJson.last_game.dealer_hand;
        player_hand = document.getElementsByName("player_hand")[0].innerHTML = myJson.last_game.player_hand;
        result = document.getElementsByName("result")[0].innerHTML = myJson.result;
        money = document.getElementsByName("money")[0].innerHTML = myJson.money;
      });
    //console.log(this.url + session + "/double_down");
  }

  // SURRENDER FUNCTION
  surrender() {
    let formData = new FormData();
    formData.append("token", this.token);
    fetch(this.url + session + "/surrender", {
      method: "POST",
      body: formData
    })
      .then(function (response) {
        document.getElementsByName("up")[0].innerText = response.statusText;
        return response.json();
      })
      .then(function (myJson) {
        dealer_hand = document.getElementsByName("dealer_hand")[0].innerHTML = myJson.last_game.dealer_hand;
        player_hand = document.getElementsByName("player_hand")[0].innerHTML = myJson.last_game.player_hand;
        money = document.getElementsByName("money")[0].innerHTML = myJson.money;
        result = document.getElementsByName("result")[0].innerHTML = myJson.last_game.result;
        document.getElementsByName("result")[0].style.color = "#FF69B4";
        document.getElementsByName("result")[0].style.fontFamily = "monospace";
        document.getElementsByName("result")[0].style.fontSize = "150px";
        document.getElementsByName("result")[0].style.position = "absolute";

        var pos = 0;
        var id = setInterval(frame, 5);
        function frame() {
          if (pos == 350) {
            clearInterval(id);
          } else {
            pos++;
            (document.getElementsByName("result")[0]).style.top = pos + 'px';
            (document.getElementsByName("result")[0]).style.left = pos + 'px';
          }
        }

        won = document.getElementsByName("won")[0].innerHTML = myJson.last_game.won;

        let converter1 = document.getElementsByName("dealer_hand")[0].innerHTML;
        let converter2 = document.getElementsByName("player_hand")[0].innerHTML;

        converter1 = converter1.split(",");
        for (var i = 0; i < converter1.length; i++) {
          if (converter1[i] == 1) {
            converter1[i] = "A"
          } else if (converter1[i] == 11) {
            converter1[i] = "J"
          } else if (converter1[i] == 12) {
            converter1[i] = "Q"
          } else if (converter1[i] == 13) {
            converter1[i] = "A"
          }
        }
        console.log(converter1);
        converter1 = converter1.toString();
        console.log(converter1);

        document.getElementsByName("dealer_hand")[0].innerText = converter1;

        converter2 = converter2.split(",");
        for (var i = 0; i < converter2.length; i++) {
          if (converter2[i] == 1) {
            converter2[i] = "A"
          } else if (converter2[i] == 11) {
            converter2[i] = "J"
          } else if (converter2[i] == 12) {
            converter2[i] = "Q"
          } else if (converter2[i] == 13) {
            converter2[i] = "A"
          }
        }
        console.log(converter2);
        converter2 = converter2.toString();
        console.log(converter2);

        document.getElementsByName("player_hand")[0].innerText = converter2;
      });

    //document.getElementsByName("money")[0].value -= Math.ceil(-amt/2);

    document.getElementsByName("stand")[0].disabled = true;
    document.getElementsByName("hit")[0].disabled = true;
    document.getElementsByName("double_down")[0].disabled = true;
    document.getElementsByName("surrender")[0].disabled = true;
  }
}