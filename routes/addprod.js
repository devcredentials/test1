var express = require('express');
var router = express.Router();
var request = require("request");
var cheerio = require("cheerio");
var jsdom = require('jsdom');

router.get('/', function(req, res, next) {
  cSession = req.session;
  res.send('respond with a resource');
});


router.post('/link', function(req, res, next) {
  var title="";
  var pageurl = req.body.producturl;
  pageurl = "http://www.snapdeal.com/product/samsung-j7-16gb-espresso-brown/661359071561";  //"http://www.ebay.in/itm/231652463426";
  console.log("PageURL = "+pageurl);

  request({uri: 'http://www.snapdeal.com/product/samsung-j7-16gb-espresso-brown/661359071561'}, function(err, res, body){
        var self = this;
        self.items = new Array();//I feel like I want to save my results in an array

        //Just a basic error check
        if(err && response.statusCode !== 200){console.log('Request error.');}
        jsdom.env({
              html: body,
              scripts: ['http://code.jquery.com/jquery-1.6.min.js'],
              done: function (err, window) {
                  //Use jQuery just as in a regular HTML page
                //  var $ = window.jQuery;
                //  res.send($('title').text());
                  var $ = window.jQuery;

                  //Title
                  console.log("Title is : "+ $('title').text());
                  console.log("Description is : "+ $('desc').text());
                  //H1
                  $('h1').each(function(i, e) {
                        console.log('H1 is  ' + $(e).text());
                        });
                  //H2
                  console.log("H2 tag is : "+ $('h2').text());
                  $('h2').each(function(i, e) {
                        console.log('H2 is  ' + $(e).text());
                        });
                  //H3
                  console.log("H3 tag is : "+ $('h3').text());
                  $('h3').each(function(i, e) {
                        console.log('H3 is  ' + $(e).text());
                        });
                  //Images
                  console.log("Images are : "+ $('img').text());
                  $('img').each(function(i, e) {
                        console.log($(e).attr('src'));
                        console.log('Img Height is ' +$(e).attr('height'));
                        console.log('Img Width is ' +$(e).attr('width'));
                        });

                  console.log("Images URL is : "+ $('img').attr('src'));

                  //console.log("Images dimensions are : " + $(img).attr('width') + ' and ' + $(img).attr('height'));

                //  res.end($('title').text());
              }
          });


             //res.end('done');
      });

});

module.exports = router;
