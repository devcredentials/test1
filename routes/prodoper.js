var express = require('express');
var router = express.Router();
var User  = require('../models/user');
var Userasset = require('../models/userasset');
var Product  = require('../models/product');
var Store = require('../models/store');
var Collection = require('../models/collection');

var mylib = require('../mylib/mylibrary');
var configAuth = require('../config/auth');

var mongoose = require('mongoose');

router.get('/', function(req, res, next) {
  cSession = req.session;
  res.send('respond with a resource');
});

//Add Store
router.get('/addstore', function(req, res, next) {
    var storeName = "AAA";
    var userId = "56dece27f6efe0f0180bb7a2";
      Store.findOne({ 'storename' : storeName }, function(err, store) {
          if (err)
          {
            console.log("Error Occured And it is :- "+ err);
          }
          if (store) {
            console.log("The store already Exists and thde details are" + store);
          } else {
              var newStore      = new Store();
                newStore.storename = storeName;
                newStore.ownerid = userId;
                // Add to database
                newStore.save(function(err) {
                  if (err)
                  {
                      throw err;
                    }
                  else
                  {
                      // if successful, return the new user
                      //return done(null, newStore);
                      console.log("New User is : " + newStore);
                    }
              });
          }
      });
  //res.send('respond with a resource');
});

//Add Collection
router.get('/addcollection', function(req, res, next) {
    var collectionName = "AAA-Collection";
    var userId = "56dece27f6efe0f0180bb7a2";
      Collection.findOne({ 'collectionname' : collectionName }, function(err, collection) {
          if (err)
          {
            console.log("Error Occured And it is :- "+ err);
          }
          if (collection) {
            console.log("The collection already Exists and thde details are" + collection);
          } else {
              var newCollection      = new Collection();
                newCollection.collectionname = collectionName;
                newCollection.ownerid = userId;
                // Add to database
                newCollection.save(function(err) {
                  if (err)
                  {
                      throw err;
                  }
                  else
                  {
                      console.log("New User is : " + newCollection);
                  }
              });
          }
      });
  //res.send('respond with a resource');
});

//Add AddProduct
router.post('/addproduct', function(req, res, next) {
  var userid = cSession.userId  ;//userid;
  var productid ="";
  var collectionid = req.body.collection;// "Collection1"; // req.body.prodcollection;
  var storeid = req.body.store;//  "Store1"; // req.body.prodstore;

    if(req.body.prodimg.length > 0 )
      {
        var fileName = Date.now() + '-prod.jpg';
        var ProductFilePath = './public/images/product/'+fileName;
        mylib.download_file_httpget(req.body.prodimg,ProductFilePath);
          var newProduct = new Product();
            newProduct.image = configAuth.burl + 'images/product/' + fileName; //req.body.prodimg ;
            newProduct.title = req.body.prodtitle ;
            newProduct.description = req.body.proddescription ;
            newProduct.currency = req.body.currency ;
            newProduct.price = req.body.price ;
            newProduct.baseurl = req.body.baseurl ;
            newProduct.category = req.body.category ;
            newProduct.addedby = userid;//req.userid ;
              // Add to database
              newProduct.save(function(err) {
                if (err){
                    throw err;
                } else {
                    console.log("New User is : " + newProduct);
                    productid = newProduct._id;
                    addUserAsset(userid,productid,collectionid,storeid);
                }
             });
             console.log("Reached Here");

             req.flash('success', {msg:"Product added successfully."});
      }
    res.redirect('/feeds');

  //res.send('respond with a resource');
});


function addUserAsset(userid, productid, collectioid, storeid) {
  console.log("I am in");
    var newUserasset = new Userasset();
        newUserasset.userid = userid;
        newUserasset.productid = productid;
        newUserasset.collectionid = collectioid;
        newUserasset.storeid = storeid;
          // Add to database
          newUserasset.save(function(err) {
            if (err){
                throw err;
                //return(result(err));
            } else {
                console.log("New User is : " + newUserasset);
                //return(result(null,newUserasset));
            }
         });
}



//list Stores
router.get('/showstores', function(req, res, next) {
  Store.find({'ownerid':cSession.userId }, function(err, store) {
      if (err)
      {
        console.log("Error Occured And it is :- "+ err);
          return done(err);
        }
      if (store) {
          console.log("User Found11 " + store);
        //  res.render('admin/usermaster',{criteria:"all",user:user});
      }
    });
});

//list collections
router.get('/showcollections', function(req, res, next) {
  Collection.find({'ownerid':cSession.userId }, function(err, collection) {
      if (err)
      {
        console.log("Error Occured And it is :- "+ err);
          return done(err);
        }
      if (collection) {
          console.log("User Found11 " + collection);
        //  res.render('admin/usermaster',{criteria:"all",user:user});
      }
    });
});


//list UserAssets
router.get('/listassets', function(req, res, next) {
  Userasset.find({'userid':cSession.userId }, function(err, assets) {
      if (err)
      {
        console.log("Error Occured And it is :- "+ err);
          return done(err);
        }
      if (assets) {
          console.log("User Found11 " + assets);
        //  res.render('admin/usermaster',{criteria:"all",user:user});
      }
    });
});

//asset groups
router.get('/assetgroup', function(req, res, next) {
  Userasset.find({'userid':cSession.userId})
      .populate({
        path: 'userid',
        select:{'displayname':1,'primaryemail':1}
      })
      .populate({
        path: 'storeid',
        select:{'storename':1}
      })
      .populate({
        path: 'collectionid',
        select:{'collectionname':1}
      })
          .exec(function (err, assets) {
      if (err)
      {
        console.log("Error Occured And it is :- "+ err);
      }
      if (assets) {
          console.log('The result is : ', assets);
        //  res.render('admin/usermaster',{criteria:"all",user:user});
      }
  });
});

module.exports = router;
