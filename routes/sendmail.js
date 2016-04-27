var nodemailer = require('nodemailer');
var express = require('express');
var router = express.Router();
var Mailgun = require('mailgun-js');


router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Mailgun
var api_key = 'key-239d9f738d66376a6b7aebd94c600b8f';// 'MAILGUN-API-KEY';
//Your domain, from the Mailgun Control Panel
var domain = 'sandbox00c6a138c10a4b38811904f2fb8185e8.mailgun.org'; // 'YOUR-DOMAIN.com';
//Your sending email address
var from_who = 'Mailgun Sandbox - DEV-TEST <postmaster@sandbox00c6a138c10a4b38811904f2fb8185e8.mailgun.org>';//'your@email.com';
var msgbody = "Congratulations Dev, you just sent an email with Mailgun!  You are truly awesome!  You can see a record of this email in your logs: https://mailgun.com/cp/log .  You can send up to 300 emails/day from this sandbox server.  Next, you should add your own domain so you can send 10,000 emails/month for free.";
var to = "Dev <mydevcredentials@gmail.com>";

router.get('/mailgun', function(req,res) {
//http://blog.mailgun.com/how-to-send-transactional-emails-in-a-nodejs-app-using-the-mailgun-api/
    //We pass the api_key and domain to the wrapper, or it won't be able to identify + send emails
    var mailgun = new Mailgun({apiKey: api_key, domain: domain});

    var data = {
    //Specify email data
      from: from_who,
    //The email to contact
      to: to,
    //Subject and text data
      subject: 'Hello Dev ',
      html: msgbody
      //'Hello, This is not a plain-text email, I wanted to test some spicy Mailgun
      //sauce in NodeJS! <a href="http://0.0.0.0:3030/validate?' + req.params.mail + '">Click here to add your email address to a mailing list</a>';
    }
    mailgun.messages().send(data, function (err, body) {
        //If there is an error, render the error page
        if (err) {
          //  res.render('error', { error : err});
          res.json({MailGunFailed: 'error'});
            console.log("got an error: ", err);
        }
        //Else we can greet    and leave
        else {
            //Here "submitted.jade" is the view file for this landing page
            //We pass the variable "email" from the url parameter in an object rendered by Jade
            //res.render('submitted', { email : req.params.mail });
            res.json({MailSent: data});
            console.log(body);
        }
    });
  });

//gmail
router.get('/gmail', handleSayHello);
function handleSayHello(req, res) {
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'mydevcredentials@gmail.com', // Your email id
            pass: 'logindev' // Your password
        }
    });

    var text =  'Hello world from \n\n test' ;//+ //req.body.name;

    var mailOptions = {
        from: 'mydevcredentials@gmail.com', // sender address
        to: 'subodh737@gmail.com', // list of receivers
        subject: 'Email Example', // Subject line
        text: text //, // plaintext body
        // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
            res.json({GmailFailed: 'error'});
        }else{
            console.log('Message sent: ' + info.response);
            res.json({MailSentGmail: info.response});
        };
    });

}


router.get('/welcomemg', function(req, res, next) {
    res.render('mailtemplates/welcome',{username:'Subodh Kumar Sharma'}, function(err,htmlContent) {
    console.log(htmlContent);

    //from, to, subject, msgbody
      sendByMailGun('devcredentials@gmail.com','mydevcredentials@gmail.com','Welcome mail.',htmlContent,res);
    });

  res.send('respond with a resource');
});

// function sendByMailGun(from, to, subject, msgbody,res)
// {
//   var mailgun = new Mailgun({apiKey: api_key, domain: domain});
//   var data = {
//             from: from,
//             to: to,
//             subject: subject,
//             html: msgbody
//           }
//       mailgun.messages().send(data, function (err, body) {
//           if (err) {
//             //  res.render('error', { error : err});
//             //res.json({MailGunFailed: 'error'}); console.log("got an error: ", err);
//             console.log("Failed sending mail. " +err);
//           }
//           else {
//             //  res.json({MailSent: data});
//               console.log("success in sending mail" +body);
//           }
//       });
// }


router.get('/welcomegmail',function(req, res, next){
      res.render('mailtemplates/welcome',{username:'Subodh Kumar Sharma'}, function(err,htmlContent) {
      //console.log(htmlContent);
      SendByGmail('mydevcredentials@gmail.com','subodh737@gmail.com',"Welcome Mail",htmlContent);
    });

});

// function SendByGmail(from,to,subject,body)
// {
//       var mailOptions = {
//           from: from, // sender address
//           to: to, // list of receivers
//           subject: subject, // Subject line
//         //  text: text //, // plaintext body
//            html: body // You can choose to send an HTML body instead
//       };
//       var transporter = nodemailer.createTransport({
//           service: 'Gmail',
//           auth: {
//               user: 'mydevcredentials@gmail.com', // Your email id
//               pass: 'logindev' // Your password
//           }
//       });
//       transporter.sendMail(mailOptions, function(error, info){
//           if(error){
//               console.log(error);
//               //res.json({GmailFailed: 'error'});
//           }else{
//               console.log('Message sent: ' + info.response);
//               //res.json({MailSentGmail: info.response});
//           };
//       });
// }


module.exports = router;
