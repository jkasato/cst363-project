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

app.post("/", async function(req, res) {
    let username = req.body.username;
    let password = req.body.password;

    //checks if username is in the database
    let result = await checkUsername(username);
    console.dir(result);

    // let hashedPwd = "$2a$05$r2tnsPeQXP/yWuh7.Mz3MO3zkUAposLywMXrsQ1EFZpf2ecvzw6mm";
    //initialize pashedPwd to blank
    let hashedPwd = "";

    //check if result is in the database
    if (result.length > 0) {
        hashedPwd = result[0].password;
    }

    let passwordMatch = await checkPassword(password, hashedPwd);
    console.log("passwordMatch: " + passwordMatch);

    if (username == 'admin' && passwordMatch) {
        req.session.authenticated = true;
        // res.render("welcome");
    } else {
        res.render("index", { "loginError": true });
    }
});

app.get("/myAccount", isAuthenticated, function(req, res) {
    if (req.session.authenticated) {
        res.render("account");
    } else {
        res.redirect("/");
    }
});

app.get("/logout", function(req, res) {
    req.session.destroy();
    res.redirect("/");
});

/**
 * Checks the bcrypt value of the password submitted
 * @param {string} password
 * @return {boolean} true if password submitted is equal to
 * bcrypt-hashed value, false otherwise. 
 */
function checkPassword(password, hashedValue) {
    return new Promise(function(resolve, reject) {
        bcrypt.compare(password, hashedValue, function(err, result) {
            console.log("Result: " + result);
            resolve(result);
        });
    });
}
/**
 * This function checks if the username is in the database
 * @param {string} username 
 */
function checkUsername(username) {
    let sql = "SELECT * FROM users WHERE username=?";
    return new Promise(function(resolve, reject) {
        let conn = createDBConnection();
        conn.connect(function(err) {
            if (err) throw err;
            conn.query(sql, [username], function(err, rows, fields) {
                if (err) throw err;
                console.log("Rows found: " + rows.length);
                resolve(rows);;
            }); //query
        }); //connect
    }); //promise
}
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function isAuthenticated(req, res, next) {
    if (!req.session.authenticated) {
        res.redirect('/');
    } else {
        next()
    }
}

function createDBConnection() {
    var conn = mysql.createConnection({
        host: "127.0.0.1",
        user: "root",
        password: "sesame",
        database: "authentication"
    });
    return conn;
}

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