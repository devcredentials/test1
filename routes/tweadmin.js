var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Store = require('../models/store');
var Storeitems = require('../models/storeitems');

router.get('/', function(req, res, next) {
  //cSession = req.session;
  res.send('respond with a resource');
});

router.get('/adminlanding', function(req, res, next) {
  cSession = req.session;
  res.render('admin/adminlanding');
});

router.get('/createstore', function(req, res, next) {
  cSession = req.session;
  res.render('admin/createstore');
});


router.get('/liststores', function(req, res, next) {
  //cSession = req.session;
  Store.find({}, function(err, store) {
    if(err){}
    else{
      res.render('admin/viewstores.ejs',{"stores":store});
    }
  });
});

router.get('/edit/s/:id', function(req, res, next) {
  var id = req.params.id.replace("id:", "");
    Store.findOne({_id:id}, function(err, store) {
      if (err)
      {
        console.log("Error Occured And it is :- "+ err);
          return done(err);
      }
      if (store) {
          res.render('admin/editstore', {store:store});
      }
    });
});

router.post('/store/save/:id', function(req, res, next) {
   console.log(" I Am Here");
  var id = req.params.id.replace("id:", "");
    if(id.length > 0)
        {
          Store.findOne({_id:id}, function(err, store) {
            if (err)
            {
              console.log("Error Occured And it is :- "+ err);
                return done(err);
            }
            if (store) {
                //Update Existing store
                store.update({
                        storename : req.body.storename,
                        ownerid : req.body.ownerid,
                        isverified : req.body.isVerifiedStore,
                        isclaimed : req.body.isClaimedStore,
                        favicon : req.body.favicon,
                        stdescription : req.body.description,
                        stdisplayname : req.body.dispName
                      },function(err){
                        if(err){console.log("Error update store "+ store._id +". Error Details :  "+ err);}
                        else{
                          res.redirect('../../../show/showstore/id:'+store._id);
                        }
                    });
            }
            else {
              {
                //Create New store
                var newStore = new Store();
                newStore.storename = req.body.storename;
                newStore.ownerid = "";//req.body.ownnweId;
                newStore.isverified = req.body.isVerifiedStore;
                newStore.isclaimed = req.body.isClaimedStore;
                newStore.favicon = req.body.favicon;
                newStore.stdescription = req.body.description;
                newStore.stdisplayname = req.body.dispName;
                newStore.save(function(err) {
                    if(err){console.log("Error Creating store "+ req.body.storename +". Error Details :  "+ err);}
                    else{
                      res.redirect('show/showstore/id:'+newStore._id);
                    }
                });
              }
            }
          });
        }
        else{
            //Create New store
            console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
            var newStore = new Store();
            newStore.storename = req.body.storename;
            newStore.ownerid = "";//req.body.ownnweId;
            newStore.isverified = req.body.isVerifiedStore;
            newStore.isclaimed = req.body.isClaimedStore;
            newStore.favicon = req.body.favicon;
            newStore.stdescription = req.body.description;
            newStore.stdisplayname = req.body.dispName;
            newStore.save(function(err) {
                if(err){console.log("Error Creating store "+ req.body.storename +". Error Details :  "+ err);}
                else{
                  res.redirect('show/showstore/id:'+newStore._id);
                }
            });
        }
});



router.get('/listproducts', function(req, res, next) {
  //cSession = req.session;
  Storeitems
    .find({})
    .populate({
        path: 'storeid',
        select: {}
    })
    .populate({
        path: 'productid',
        select: {}
    })
    .exec(function (err, products) {
      if (err) {console.log("Error in execution" + err);}
      //console.log('The creator is %s', products);
     //res.render('showcollection',{products:products});
     res.render('admin/viewproducts',{"products":products});
    });
});


module.exports = router;
