const express = require("express");
const app = express();
const session = require('express-session');
const bcrypt = require('bcrypt');
const mysql = require('mysql');

//set ejs as templating engine
app.set('view engine', 'ejs');

//set parameters to use sessions
app.use(session({
    secret: "top secret!",
    resave: true,
    saveUninitialized: true
}));

//routes
app.use(express.urlencoded({ extended: true }));
//route root
app.get("/", function(req, res) {
    res.render("index");
});

app.post("/", function(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    console.log("username:" + username);
    console.log("password:" + password);
    res.send("This is the root route using POST!");
});


// // server listener
// app.listen(8080, "0.0.0.0", function() {
//     console.log("Running Express Server...");
// });

// server listener to any request
app.listen("5500", "127.0.0.1", function() { //port number,ip address
    console.log("Express Server is Running...")
});

// // for heroku deployment
// app.listen(process.env.PORT, process.env.IP, function() {
//     console.log("Running Express Server...");
// });