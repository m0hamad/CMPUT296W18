class Gambler {

  constructor(url, token) {
    this.url = url;
    this.token = token;
  }

  bet(amount) {
    
  }

  stand() {

  }

  hit() {

  }

  double_down() {

  }

  surrender() {

  }

}

// #2
fetch("https://pizza.cs.ualberta.ca/296/")
  .then(function(response) {
    return response.text().then(function(myJson) {
      console.log(myJson);
    });
  });


var formData = new FormData();
formData.append('token', 'blahblahblabhalbhablah');
//This is the line I have issues with.
var myForm = (document.getElementsByName("session")[0]).innerHTML;
formData = new FormData(myForm);