let express=require('express');

let fs = require('fs');

let https = require('https');

let nodemailer = require("nodemailer");

let favicon = require('serve-favicon');

let bodyParser = require('body-parser');

let backup = require('./backup');

let app = express();


/*----------------- SSL Certs-----------------------------*/


let options = {
cert: fs.readFileSync('public/sslcert/cert.pem', 'utf8'),
key: fs.readFileSync('public/sslcert/privkey.pem', 'utf8'),
ca: fs.readFileSync('public/sslcert/chain.pem', 'utf8')
};

/*------------------Backup FTP-----------------------------*/
                   backup();

/*------------------Routing Started ------------------------*/

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

//SSL Redirect
app.use(function(req, res, next) {
    if (req.secure) {
        next();
        } else {
     res.redirect('https://' + req.headers.host + req.url);
     }
      });
//Access Public Folder
app.use(express.static('public'));

app.use(favicon(__dirname + '/public/images/favicon.ico'));

//Contact Form Post Request
app.post('/send',function(req, res){
//Mail Config
nodemailer.createTestAccount((err, account) => {
   
    let transporter = nodemailer.createTransport({
        host: '',
        port: 587,
        secure: false, 
        auth: {
            user: "", 
            pass: ""
        }
    });

let mailOptions = {

        to : '',

        subject : req.body.name +" "+ req.body.email,

        text : req.body.message

        };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);

    }else{
    console.log('Message sent: %s', info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    res.redirect("/");
};

});

});

});



/*--------------------Routing Over----------------------------*/

app.listen(80, function(){

    console.log("Node is Running on Port 443");
});

//HTTPS Server
https.createServer(options, app).listen(443);



