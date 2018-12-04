const express = require("express");
const fs = require("fs");
const https = require("https");
const nodemailer = require("nodemailer");
const favicon = require("serve-favicon");
const bodyParser = require("body-parser");
const backup = require("./backup");
const app = express();

/*----------------- SSL Certs-----------------------------*/

const options = {
  cert: fs.readFileSync("public/sslcert/cert.pem", "utf8"),
  key: fs.readFileSync("public/sslcert/privkey.pem", "utf8"),
  ca: fs.readFileSync("public/sslcert/chain.pem", "utf8")
};

/*------------------Backup FTP-----------------------------*/
backup();

/*------------------Routing Started ------------------------*/

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

//SSL Redirect
app.use(function(req, res, next) {
  if (req.secure) {
    next();
  } else {
    res.redirect("https://" + req.headers.host + req.url);
  }
});
//Access Public Folder
app.use(express.static("public"));

app.use(favicon(__dirname + "/public/images/favicon.ico"));

//Contact Form Post Request
app.post("/send", function(req, res) {
  //Mail Config
  nodemailer.createTestAccount((err, account) => {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "",
        pass: ""
      }
    });

    let mailOptions = {
      to: "jay@jasengreen.com",

      subject: req.body.name + " " + req.body.email,

      text: req.body.message
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      } else {
        console.log("Message sent: %s", info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        res.redirect("/");
      }
    });
  });
});

/*--------------------Routing Over----------------------------*/

app.listen(80, function() {
  console.log("Node is Running on Port 443");
});

//HTTPS Server
https.createServer(options, app).listen(443);
