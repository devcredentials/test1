var express = require('express');
var router = express.Router();
var User  = require('../models/user');
var Product  = require('../models/product');
var Userasset  = require('../models/userasset');
var mongoose = require('mongoose');

router.get('/', function(req, res, next) {
  cSession = req.session;
//  res.render('r',{criteria:"all",user:getUsers("aa")});
});

//Admin listing for products
// Product.find({},function(err,product){
//   if(err){
//
//   }
//   if(product){
//
//   }
// });
router.get('/listproducts', function(req, res, next) {

console.log('Hi - 12222');
    Product
      .find({ })
      .populate({
        path: 'addedby',
        select:{'displayname':1,'primaryemail':1,'local.username':1}
      })
      .exec(function (err, products) {
        if (err) return handleError(err);
        console.log('The creator is %s', products[0]);
        res.render('admin/productlisting',{products:products});
    });
});

router.get('/listPrDetails', function(req, res, next) {
  Userasset
    .find({})
    .populate({
        path: 'productid',
        select: {'image':1,'title':1,'description':1,'currency':1,'price':1}
    })
    .populate({
        path: 'userid',
        select: {'displayname':1,'primaryemail':1}
    })
    .populate({
        path: 'storeid',
        select: {'storename':1}
    })
    .populate({
        path: 'collectionid',
        select: {'collectionname':1}
    })
    .exec(function (err, products) {
      if (err) return handleError(err);
      console.log('The creator is %s', products[0]);
      res.render('admin/productlisting',{products:products});
    });
});




///listing/user/edit/id:56dece27f6efe0f0180bb7a2



module.exports = router;
