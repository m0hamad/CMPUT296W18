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
        return response.json();
      })
      .then(function(myJson) {
        let session = document.getElementsByName("session")[0].value = myJson.session;
        console.log(session)
      })

    
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