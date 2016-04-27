var express = require('express');
var router = express.Router();
var User  = require('../models/user');
var Userasset  = require('../models/userasset');
var Product  = require('../models/product');
var Keyword  = require('../models/keyword');
var mongoose = require('mongoose');
var Keywords  = require('../models/keywords'); // keywords New
/* GET users listing. */
router.get('/', function(req, res, next) {
  cSession = req.session;
  res.send('respond with a resource');
});

router.get('/users', function(req, res, next) {
  console.log("Hi User");
  getUserList("1",res);
});

router.get('/users/inactive', function(req, res, next) {
  getUserList("2",res);
});

router.get('/users/banned', function(req, res, next) {
    getUserList("3",res);
});

router.get('/users/deleted', function(req, res, next) {
    getUserList("0",res);
});

function getUserList(criteria, res) {
  console.log("  criteria is "+ criteria);
  User.find({status: criteria}, function(err, user) {
      if (err)
      {
        console.log("Error Occured And it is :- "+ err);
          return done(err);
      }
      if (user) {
          console.log("User Found " + user);
          //return user ; // user found, return that user
          res.render('admin/usermaster',{user:user});
      }
    });
  }
//====================================

router.get('/user/edit/:id', function(req, res, next) {
  var id = req.params.id.replace("id:", "");
  console.log("Editing Id  = "+ id);
  User.findOne({_id:id }, function(err, user) {
      if (err)
      {
        console.log("Error Occured And it is :- "+ err);
          return done(err);
      }
      if (user) {
          console.log("User Found11 " + user);
          res.render('admin/useredit', {user:user});
      }
    });
    //res.render('admin/usermaster',{criteria:"all",burl:burl,"user":getUsers('cc')});
});


router.post('/user/save/:id', function(req, res, next) {
  var id = req.params.id.replace("id:", "");
  console.log("Editing Id  = "+ id);
    //var lemail = req.body.lemail;
    //var lpwd = req.body.lpwd;
    //var ldisplayname = req.body.ldisplayname;

    mongoose.model('User').findById(id,function(err,user){
      if (err)
      {
        console.log("Hi Error");
      }
      else {
        console.log("User found" + user);
          user.update({
            local:{
              email : req.body.lemail
              //password : req.body.lpwd
            },
            //dateofcreation : req.body.doc,
            status : req.body.lstatus,
            role : req.body.lrole,
            displayimage : req.body.ldisplayimage,
            displayname : req.body.ldisplayname,
            primaryemail : req.body.lemail
        },function(err,user){
          if(err){
            console.log("Error :  + " + err);
          }
          else{
            res.format({
              html:function(){
                console.log("Suuccess in Updation.");
                res.redirect('../../users');
              },
              json:function(){
                res.json(id);
              }
            });
          }
        });
      }

    });
});

//Product listing - Admin
router.get('/products', function(req, res, next) {
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

router.post('/updatekeywords/:id', function(req, res, next) {
  console.log('I am here to save keywords');
  var productId = req.params.id.replace("id:", "");
  console.log("Product Id is "+productId );
  Keyword.findOne({'productid':productId},function(err,keyword){
    if (err)
    {
      console.log("Error Occured And it is :- "+ err);
    }
    if (keyword) {
      //Update values
      console.log("Updating -------");
          keyword.l1keywords = req.body.l1kw;
          keyword.l2keywords = req.body.l2kw;
          keyword.l3keywords = req.body.l3kw;
          keyword.save(function (err){
            if (err)
            {
              console.log('Error in updating Keywords');
                throw err;
              }
            else{
              console.log("Updated keywords are : " + keyword);
              Product.findOne({_id:productId},function(err,prod){
                if(err){}
                else{
                  prod.keywords = keyword._id;
                  prod.save();
                  console.log('Keyword added to product');
                }
              });
              res.redirect('../addkeywords');
            }
          });

    } else {
      console.log('Adding New values to keywords');
      var newkeyword = new Keyword();
      newkeyword.l1keywords = req.body.l1kw;
      newkeyword.l2keywords = req.body.l2kw;
      newkeyword.l3keywords = req.body.l3kw;
      newkeyword.productid = productId;
      newkeyword.save(function(err) {
            if (err)
            {
              console.log('Error in saving Keywords');
                throw err;
              }
            else
            {
              Product.findOne({_id:productId},function(err,prod){
                if(err){}
                else{
                  prod.keywords = newkeyword._id;
                  prod.save();
                  console.log('Keyword added to product');
                }
              });

                console.log("New User is : " + newkeyword);
                res.redirect('../addkeywords');
              }
        });
    }
  });

});

router.get('/addkeywords', function(req, res, next) {
  Product
    .find({})
    .populate({
        path: 'keywords',
        select: {'l1keywords':1,'l2keywords':1,'l3keywords':1}
    })
    .exec(function (err, products) {
      if (err) return handleError(err);
      res.render('admin/addkeyword',{products:products});
    });
});


router.get('/product/:id', function(req, res, next) {
  var productId = req.params.id.replace("id:", "");
  //productId = '56f2505c643cd25c1bcaa9d7';
  Userasset
    .find({productid:productId})
    .populate({
        path: 'productid',
        select: {'image':1,'title':1,'description':1,'currency':1,'price':1,'addedon':1,'baseurl':1}
    })
    .populate({
        path: 'userid',
        select: {'displayname':1,'primaryemail':1,'displayimage':1}
    })
    .populate({
        path: 'storeid',
        select: {'storename':1}
    })
    .populate({
        path: 'collectionid',
        select: {'collectionname':1}
    })
    .exec(function (err, product) {
      if (err) return handleError(err);
      console.log('The creator is %s', product);
      Keyword.findOne({productid:productId},function(err,keywords){
        if(err){console.log('Error Getting product keywords');}
        else{
          res.render('product',{"product":product,"keywords":keywords});
        }
      });
    });
});

router.get('/addkeywordsnew', function(req, res, next) {
      res.render('admin/addkeywords');
});

router.post('/addkeywordsnew', function(req, res, next) {
    var kw = Keywords.findOne({ 'keyword' : req.body.keyword },function(err,keyword){
        if(err){ console.log("Error : "+err); }
        if(keyword){ console.log("Keyword already exists."); }
        else{
          var newKeyword= new Keywords();
          newKeyword.keyword = req.body.keyword;
          newKeyword.metadescription = req.body.metadesc;
          newKeyword.save(function(err){
            if (err)
                {
                    throw err;
                  }
                else
                {
                    console.log("Keyword Saved.");
                    res.render('admin/addkeywords');
                  }
            });
        }
    });

});

module.exports = router;
