var express = require('express');
var router = express.Router();
var passport = require('passport');

var Store = require('../models/store');
var Collection = require('../models/collection');
var async = require('async');
var Product = require('../models/product');
var Storeitems = require('../models/storeitems');
var User = require('../models/user');
var Userasset = require('../models/userasset');
var mongoose = require('mongoose');
var mailutil = require('../mylib/maillib');

/* GET home page. */
router.get('/', function(req, res, next) {
  cSession = req.session;
  console.log('Referer is '+ req.header('Referer') );

  Store.find({},{'_id':1}).limit(6).exec(function(err,storeIds){
  if(err){console.log("error getting store."); }
  else{
          //console.log(storeIds);
          var lstStores = Store.find({'_id': {$in:storeIds}});
          var store0 = Storeitems.find({'storeid':storeIds[0]},{'productid':1}).limit(4).populate({path:'productid',select:{}});
          var store1 = Storeitems.find({'storeid':storeIds[1]},{'productid':1}).limit(4).populate({path:'productid',select:{}});
          var store2 = Storeitems.find({'storeid':storeIds[2]},{'productid':1}).limit(4).populate({path:'productid',select:{}});
          var store3 = Storeitems.find({'storeid':storeIds[3]},{'productid':1}).limit(4).populate({path:'productid',select:{}});

          //Storeitems.find({'storeid':'571855d65d3460c80ec26652'},{'productid':1}).limit(4).populate({path:'productid',select:{}})

          var resources = {
            storeList: lstStores.exec.bind(lstStores),
            Items0: store0.exec.bind(store0),
            Items1: store1.exec.bind(store1),
            Items2: store2.exec.bind(store2),
            Items3: store3.exec.bind(store3)
          };

          async.parallel(resources, function (error, results){
              if (error) {
                  res.status(500).send(error);
                  return;
              }
              console.log("storeList =  "+results.storeList);
              console.log("Items0 =  "+results.Items0);
              console.log("Items1 =  "+results.Items1);
              console.log("Items2 =  "+results.Items2);
              console.log("Items3 =  "+results.Items3);
               res.render('index', {results:results});
           });
      }
  });


});

router.get('/feeds', function(req, res, next) {
  cSession.userId = req.user._id;
  //  console.log(cSession.User);
  var lstCollections = Collection.find({ownerid:cSession.userId},{'collectionname':1});
  var lstStores = Store.find({ownerid:cSession.userId},{'storename':1});
  var lstProducts = Product.find({addedby:cSession.userId});
  var lstUser = User.find({_id:cSession.userId},{'primaryemail':1,'displayname':1,'displayimage':1,'_id':0});
  var resources = {
    collectionList: lstCollections.exec.bind(lstCollections),
    storeList: lstStores.exec.bind(lstStores),
    productList: lstStores.exec.bind(lstProducts),
    userList:lstStores.exec.bind(lstUser)
  };

  async.parallel(resources, function (error, results){
      if (error) {
          res.status(500).send(error);
          return;
      }
      console.log("CL =  "+results.collectionList);
      console.log("SL =  "+results.storeList);
      console.log("PL =  "+results.productList);
      console.log("UL =  "+results.userList);
      res.render('myfeeds', {results:results});
   });
});


router.get('/store/:id', function(req, res, next) {
  console.log("Hi I am here");
  console.log("Hi I am here with "+ req.params.id);
  var id=req.params.id.replace("id:","");
  console.log("Id is " + id);
  var lstStores = Store.find({_id:id},{'storename':1,'ownerid':1,'_id':0});
  //var lstAssets = Userasset.find({storeid:id},{'productid':1,'_id':0});
  var lstAssets = Userasset.find({storeid:id},{'productid':1,'_id':0});

  var resources = {
    storeList: lstStores.exec.bind(lstStores),
    assetList: lstAssets.exec.bind(lstAssets)
  };
  async.parallel(resources, function (error, results){
  if (error) {
          res.status(500).send(error);
          return;
  }
  else {

            //var userList = User.find({_id:storeList[0].ownerid},{'local.email':1,'facebook.displayName':1,'twitter.displayName':1,'google.name':1,'facebook.picture':1,'_id':0});

            var pl=[];
            results.assetList.forEach (function (obj){
              console.log(obj.productid);
                pl.push( obj.productid ) ;
            });
            console.log("PL is " + pl);

            Product.find({"_id":{$in:pl}},function(err,product){
              if(err)
              {console.log(err);}
              else {
                console.log(product);
                User.find({_id:results.storeList[0].ownerid},function(err,user1){
                  if(err)
                  {console.log(err);}
                  else {
                    console.log("User 1 :" + user1);
                    console.log("Product :" + product);
                    //user = user1;
                    res.render('showstore.ejs',{"product":product, "user":user1});
                  }
                });
              }
            });
        }
  });
});

router.get('/uploadfile', function(req, res, next) {
  res.render('excelupload.ejs');
});

router.get('/addproducts', function(req, res) {
    var lstCollections = Collection.find({'ownerid':cSession.userId});
    var lstStores = Store.find({'ownerid':cSession.userId});
    var resources = {
      collectionList: lstCollections.exec.bind(lstCollections),
      storeList: lstStores.exec.bind(lstStores)
    };

    async.parallel(resources, function (error, results){
        if (error) {
            res.status(500).send(error);
            return;
        }
    res.render('addproducts.ejs',{"results":results});
    });
  });


router.get('/users', function(req, res) {
        res.render('admin/usermaster.ejs', {
          //  user : req.user // get the user out of session and pass to template
        });
    });

router.get('/profile', isLoggedIn, function(req, res) {
  //req.session.userId = req.user._id;

    //SendMail(res);
    //  CreateDefaults(cSession.userId, res);
      process.nextTick(function() {
              res.render('profile.ejs', {
              user : req.user // get the user out of session and pass to template
          });
      });
});


    // =====================================
        // FACEBOOK ROUTES =====================
        // =====================================
        // route for facebook authentication and login
        router.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

        // handle the callback after facebook has authenticated the user
        router.get('/auth/facebook/callback',
            passport.authenticate('facebook', {
                successRedirect : '/feeds',
                failureRedirect : '/'
            }));

        //Local Strategy rout
          //router.post('/login',
          //passport.authenticate('local', {successRedirect: '/profile',failureRedirect: '/'}));

        router.post('/login', passport.authenticate('local-login', {
          successRedirect : '/feeds',
          failureRedirect : '/',
          failureFlash : true }), function(req, res) {
            console.log(req.passport.session);
            if (req.body.remember_me) {
              req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
            } else {
              req.session.cookie.expires = false; // Cookie expires at end of session
            }
        });


        router.post('/signup', passport.authenticate('local-signup', {
          successRedirect : '/feeds',
          failureRedirect : '/',
          failureFlash : true
        }));


        router.get('/forgot', function(req, res) {
                res.render('forgot.ejs', {
                  //  user : req.user // get the user out of session and pass to template

                });
            });


        // function SendMail(res)
        // {
        //   console.log("Hi I Am in TESTMethod");
        //   res.redirect('sendmail/welcomegmail', function(err,h1) {
        //   console.log(h1);
        // });
        // }


        // route for logging out
        router.get('/logout', function(req, res) {
            req.logout();
            cSession.destroy();
            req.session.destroy();
            res.redirect('/');
        });


        function isLoggedIn(req, res, next) {
            // if user is authenticated in the session, carry on
            if (req.isAuthenticated())
                return next();
            // if they aren't redirect them to the home page
            res.redirect('/');
        }

module.exports = router;
