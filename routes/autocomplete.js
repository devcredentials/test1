var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User  = require('../models/user');
var Product  = require('../models/product');
var Store = require('../models/store');
var Collection = require('../models/collection');
var Userasset = require('../models/userasset');
var Keywords = require('../models/keywords');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/find', function(req, res, next){
  console.log('I am here...............'+ req.query.term + "   and  " + req.query.filter  );
 if((req.query.term.length > 0) && (req.query.filter.length > 0))
  {
    console.log("11111");
    var termR = new RegExp('^'+ req.query.term +'$', "i");
    console.log(termR);
    switch (req.query.filter.trim()) {
      case 'all':{
            console.log('Query ALL ');
              break;
          }
      case 'store':{
              console.log('Query STORE ');
              Store.find({},{"storename":1},{limit:5},function(err, items) {
              console.log(items);
              res.jsonp(items);
              });
              break;
          }
      case 'collection':{
              console.log('Query COLLECTION ');
              Collection.find({},{"collectionname":1},{limit:5},function(err, items) {
              console.log(items);
              res.jsonp(items);
              });
              break;
          }
      case 'product':{
              console.log('Query PRODUCT ');
              //Product.find({"title": /.*a.*/},{"title":1},{limit:3},function(err, items) {
                Product.find({},{"title":1},{limit:5},function(err, items) {
                console.log(items);
                res.jsonp(items);
                });
              break;
          }
      case 'user':{
              console.log('Query USER ');
              //User.find({"displayname": /.*a.*/},{"displayname":1},{limit:3},function(err, items) {
              User.find({"displayname": new RegExp('^'+ req.query.term +'$', "i")},{"displayname":1},{limit:5},function(err, items) {
                console.log(items);
                res.jsonp(items);
                });
              break;
          }
      default:{}
        }
  }




});

router.post('/', function(req, res, next) {
  console.log("Hi Post");
  console.log(req.body.filter);
  console.log(req.body.searchfield);
  console.log("Hi Post 111");
    switch(req.body.filter)
    {
      case 'store':
      {
        res.redirect('../store/id:'+ req.body.searchfield);
        break;
      }
      case 'product':
      {
        res.redirect('../admin/product/id:'+ req.body.searchfield);
        break;
      }
      case 'collection':
      {

          Userasset
            .find({collectionid:req.body.searchfield})
            .populate({
                path: 'productid',
                select: {'image':1,'title':1,'description':1,'currency':1,'price':1}
            })
            .populate({
                path: 'userid',
                select: {'displayname':1,'primaryemail':1}
            })
            .exec(function (err, products) {
              if (err) return handleError(err);
              console.log('The creator is %s', products[0]);
             res.render('showcollection',{products:products});
            });
        //});






        // Collection.find({"ownerid": req.body.searchfield},{"collectionname":1,"createdon":1},function(err, collection) {
        // });
        // res.redirect('../collection/id:'+ req.body.searchfield);
        break;
      }
      case 'user':
      {
        User.find({"_id": req.body.searchfield},{"displayname":1,"user.displayimage":1,"user.facebook.gender":1},function(err, user) {
            Store.find({"ownerid": req.body.searchfield},{"storename":1,"createdon":1},function(err, store) {
                Collection.find({"ownerid": req.body.searchfield},{"collectionname":1,"createdon":1},function(err, collection) {
                    Product.find({"addedby": req.body.searchfield},{"title":1,"image":1,"description":1,"currency":1,"price":1},function(err, product) {

                    res.render('users',{user:user,store:store,collection:collection,product:product})
                    });
                });
            });
          });


      //  res.redirect('../user/id:'+ req.body.searchfield);
        break;
      }
      default:{}
    }
});



router.get('/findkeyword', function(req, res, next){
  console.log('I am here to get Keywords...............'+ req.query.term + "   and  " + req.query.filter  );

if(req.query.term.length > 0)
{
  var termR = new RegExp('^'+ req.query.term +'$', "i");
  console.log(termR);
  Keywords.find({},{"keyword":1},{limit:5},function(err, items) {
  console.log(items);
  res.jsonp(items);
  });
}
});

router.post('/results', function(req, res, next) {


});


module.exports = router;


// var express = require('express');
// var router = express.Router();
// var mongoose = require('mongoose');
// var User  = require('../models/user');
//
//
// router.get('/', function(req, res, next) {
//   cSession = req.session;
//   res.send('respond with a resource');
// });
//
// // router.get('/:search',find);
// //
// //
// //
// // function find = function(req, res) {
// // var b=req.params.search;
// // db.collection('user', function(err, collection) {
// //       collection.find({displayname: new RegExp(b,'i')}).limit(5).toArray(function(err, items) {
// //                 res.jsonp(items);
// //             });
// //         });
// // }
//
//
//
// module.exports = router;
