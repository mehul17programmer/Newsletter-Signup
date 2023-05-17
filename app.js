//jshint esversion:6    

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const { subscribe } = require("diagnostics_channel");
const https = require("https");
const { callbackify } = require("util");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req,res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/" , function(req,res) {
    
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address : email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
            }
        }
        ]
    } 

    const jsonData = JSON.stringify(data); //It make a string of that data ({"email_address":"mehulsathavara17@gmail.com","status":"subscribed"}).

    const url = "https://us11.api.mailchimp.com/3.0/lists/b607b5bd6f";

    const options = {
        method: "post",
        auth: "mehul1:78ba4b1d4a5719a7c2a88086140263ea-us11"
    }

    const request = https.request(url, options, function(response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data) {
            console.log(JSON.parse(data)); 
        })
    })

    request.write(jsonData);
    request.end();

});

app.post("/failure", function(req, res) {
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function() {
    console.log("server is running in 3000.");
});

//API key
//78ba4b1d4a5719a7c2a88086140263ea-us11

//audience ID
//b607b5bd6f