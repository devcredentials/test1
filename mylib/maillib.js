var nodemailer = require('nodemailer');
var express = require('express');
var router = express.Router();
var Mailgun = require('mailgun-js');
var ejs = require('ejs');
var path = require('path');

// Mailgun
var api_key = 'key-239d9f738d66376a6b7aebd94c600b8f';// 'MAILGUN-API-KEY';
//Your domain, from the Mailgun Control Panel
var domain = 'sandbox00c6a138c10a4b38811904f2fb8185e8.mailgun.org'; // 'YOUR-DOMAIN.com';
//http://blog.mailgun.com/how-to-send-transactional-emails-in-a-nodejs-app-using-the-mailgun-api/
//Your sending email address

//var from_who = 'Mailgun Sandbox - DEV-TEST <postmaster@sandbox00c6a138c10a4b38811904f2fb8185e8.mailgun.org>';//'your@email.com';
//var msgbody = "Congratulations Dev, you just sent an email with Mailgun!  You are truly awesome!  You can see a record of this email in your logs: https://mailgun.com/cp/log .  You can send up to 300 emails/day from this sandbox server.  Next, you should add your own domain so you can send 10,000 emails/month for free.";
//var to = "Dev <mydevcredentials@gmail.com>";

module.exports={
    gmailwelcome : function(mailTo){
      WelcomeGmail(mailTo);
    },
    mailgunwelcome : function(mailTo,res){
      mgwelcome(mailTo,res);
    }
};


//mailgun
function mgwelcome(mailTo,res){
    res.render('mailtemplates/welcome',{username:mailTo}, function(err,htmlContent) {
      console.log("Template Read.");
  //  console.log(htmlContent);
    //from, to, subject, msgbody
      sendByMailGun('mydevcredentials@gmail.com',mailTo,'Welcome mail.',htmlContent,res);
      console.log("Done.");
    });
}

function sendByMailGun(from, to, subject, msgbody,res)
{
  var mailgun = new Mailgun({apiKey: api_key, domain: domain});
  var data = {
            from: from,
            to: to,
            subject: subject,
            html: msgbody
          }
      mailgun.messages().send(data, function (err, body) {
          if (err) {
            //  res.render('error', { error : err});
            //res.json({MailGunFailed: 'error'}); console.log("got an error: ", err);
            console.log("Failed sending mail. " +err);
          }
          else {
            //  res.json({MailSent: data});
              console.log("success in sending mail" +body);
          }
      });
}


//Gmail
function WelcomeGmail(mailTo){
    //res.render('mailtemplates/welcome',{username:mailTo}, function(err,htmlContent) {
  //  console.log("Email Template PAth is : " +  path.dirname(__dirname) + '/views/mailtemplates/welcome');
    ejs.renderFile(path.dirname(__dirname) + '/views/mailtemplates/welcome.ejs',{username:mailTo}, function(err,htmlContent) {
  //  console.log(htmlContent);
    console.log("Template Read");
    SendByGmail('mydevcredentials@gmail.com',mailTo,"Welcome Mail",htmlContent);
    });
}
function SendByGmail(from,to,subject,body)
{
      var mailOptions = {
          from: from, // sender address
          to: to, // list of receivers
          subject: subject, // Subject line
        //  text: text //, // plaintext body
           html: body // You can choose to send an HTML body instead
      };
      var transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
              user: 'mydevcredentials@gmail.com', // Your email id
              pass: 'logindev' // Your password
          }
      });
      transporter.sendMail(mailOptions, function(error, info){
          if(error){
              console.log(error);
              //res.json({GmailFailed: 'error'});
          }else{
              console.log('Message sent: ' + info.response);
              //res.json({MailSentGmail: info.response});
          };
      });
}
