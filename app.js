const express = require("express");
const https = require("https");
require('dotenv').config();
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/pages/signup.html");
});

app.post("/", function(req, res) {
  const email = req.body.email;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const data = {
    members:[{
      email_address: email,
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      },
      status: "subscribed"}]
  };
  const jsonData = JSON.stringify(data);
  const url = process.env.LIST_URL;
  const options = {
    method: "POST",
    auth: "anything:" + process.env.SECRET_KEY
  };
  const request = https.request(url, options, function(response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/pages/success.html");
    } else {
      res.sendFile(__dirname + "/pages/failure.html");
    }
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req, res) {
  res.redirect("/");
})

app.listen(process.env.PORT, function(){
  console.log("Server started at port " + process.env.PORT);
});
