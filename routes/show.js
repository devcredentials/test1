var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User  = require('../models/user');
var Product  = require('../models/product');
var Store = require('../models/store');
var Storeitems = require('../models/storeitems');
var Collection = require('../models/collection');
var Userasset = require('../models/userasset');
var async = require('async');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/product/:id', function(req, res, next) {
    var reqID = req.params.id.replace("id:","");
    Storeitems
      .findOne({'productid':reqID})
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
        console.log('The creator is %s', products);
       //res.render('showcollection',{products:products});
       res.render('partials/productpage', {products:products});
      });


    //res.send('respond with a resource');
});

router.get('/showstore/:id', function(req,res,next){
  var reqID = req.params.id.replace("id:","");
  Storeitems
    .find({storeid:reqID})
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
      console.log('The creator is %s', products);
     //res.render('showcollection',{products:products});
     res.render('partials/storepage', {products:products});
    });

});

function showStores()
{
  Store.find({},{'_id':1}).limit(6).exec(function(err,storeIds){
  if(err){console.log("error getting store."); }
  else{
      console.log(storeIds);
     getStoreDetailsToDisplay(storeIds) }
  });
}

// function doCall(urlToCall, callback) {
//     urllib.request(urlToCall, { wd: 'nodejs' }, function (err, data, response) {
//         var statusCode = response.statusCode;
//         finalData = getResponseJson(statusCode, data.toString());
//         return callback(finalData);
//     });
// }
//     var urlToCall = "http://myUrlToCall";
// doCall(urlToCall, function(response){
//     // Here you have access to your variable
//     console.log(response);
// })

function getStoreDetailsToDisplay(arrayIds)
{
    var lstStores = Store.find({'_id': {$in:arrayIds}});
    var store0 = Storeitems.find({'storeid':arrayIds[0]},{'productid':1}).limit(4).populate({path:'productid',select:{}});
    var store1 = Storeitems.find({'storeid':arrayIds[1]},{'productid':1}).limit(4).populate({path:'productid',select:{}});
    var store2 = Storeitems.find({'storeid':arrayIds[2]},{'productid':1}).limit(4).populate({path:'productid',select:{}});
    var store3 = Storeitems.find({'storeid':arrayIds[3]},{'productid':1}).limit(4).populate({path:'productid',select:{}});

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
         res.render('partials/phstore', {results:results});
     });



// var arrayStores=[];
//
//   for (var i = 0, len = arrayIds.length; i < len; i++) {
//     console.log("Element " + i  + " is  " + arrayIds[i]);
//       getStoreitems(arrayIds,function(response){
//         console.log("A111111  " +response);
//         arrayStores[i] = response;
//       });
//
//       //arrayStores[i] = getStoreitems(arrayIds[i]);
//
//       console.log("PRODUCT " + i  + "is -- " + arrayStores[i]  );
//   }



}

function getStoreitems(arrayIds, callback)//storeId)
{
//  console.log('I am in with storeid' + storeId);
  Storeitems
    .find({'storeid': {$in:arrayIds}})   //'storeid':storeId})
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
      else{
        console.log(products);
        //return products;
        return callback(products);
      }
     //res.render('showcollection',{products:products});
    });
}



router.get('/showstores', function(req,res,next){
  //showStores();
    Store.find({},{'_id':1}).limit(6).exec(function(err,storeIds){
    if(err){console.log("error getting store."); }
    else{
        console.log('Store Ids are -' + storeIds);
       //getStoreDetailsToDisplay(storeIds)

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
                    res.render('partials/phstore', {results:results});
                });


        }
    });
});

function showStores1()
{
      // Storeitems.aggregate([
      //       {
      //           $group: {
      //               _id: '$storeid',  //$region is the column name in collection
      //               count: {$sum: 1}
      //           }
      //       }
      //   ], function (err, result) {
      //       if (err) {
      //           next(err);
      //       } else {
      //         console.log(result);
      //           //res.json(result);
      //       }
      //   });

Storeitems.find({'storeid':'571855d65d3460c80ec26652'},{'productid':1}).limit(4).populate({path:'productid',select:{}}).exec(function (err, products) {
  if (err) {console.log("Error in execution" + err);}
  console.log('The creator is ' , products);
 //res.render('showcollection',{products:products});
  //arrayProducs[j]=products[0];
});




    //   Story
    // .find(...)
    // .populate({
    //   path: 'fans',
    //   match: { age: { $gte: 21 }},
    //   select: 'name -_id',
    //   options: { limit: 5 }
    // })
    // .exec()


  // Storeitems.find({storeid:'571855d65d3460c80ec26652'})
  // .limit(6)
  // .populate({
  //    path : 'productid',
  //    //match : {storeid: '571855d65d3460c80ec26652'},
  //    select : {},
  //    options: { limit: 5 }
  // })
  // .exec(function (err, products) {
  //   if (err) {console.log("Error in execution" + err);}
  //   else{
  //     console.log(products);
  //     console.log("aaaa - "+products[0]);
  //
  //     //return products;
  //   //  return callback(products);
  //   }
  // });
}



router.get('/showstoresAAA', function(req,res,next){
var storeIdsToDisplay = [];
var arrayProducs =[]

//Get StoreIds to Show
    Store.find({},{'_id':1}).limit(6).exec(function(err,storeIds){
    for (var i = 0, len = storeIds.length; i < len; i++) {
      //someFn(arr[i]);
        console.log( "Object is - " + storeIds[i]._id );
        storeIdsToDisplay[i] = storeIds[i]._id;

        if(i == len-1)
        {
            for (var j = 0, len1 = storeIdsToDisplay.length; j < len1; j++) {
              console.log(storeIdsToDisplay[j]);
              Storeitems
                .find({'storeid':storeIdsToDisplay[j]})
                .populate({
                    path: 'productid',
                    select: {}
                })
                .populate({
                    path: 'storeid',
                    select: {}
                })
                .exec(function (err, products) {
                  if (err) {console.log("Error in execution" + err);}
                  console.log('The creator is ' + j + "has  " , products);
                 //res.render('showcollection',{products:products});
                  arrayProducs[j]=products[0];
                });

            }
        }

    }
    console.log("Inside " + storeIdsToDisplay);
    console.log("Inside arrayProducs " + arrayProducs);

//Get Store Items for each store


    //console.log("Finally -" + arrayProducs);
});




// Store.find({},{'_id':1}).limit(6).exec(function(err,storeIds){
//   storesArray = storeIds ;
//   console.log("Inside " +storeIds);
//   console.log("Inside " +storesArray);
//
//   Storeitems
//     .find({'_id':{ $in: storeIds}})
//     .populate({
//         path: 'storeid',
//         select: {}
//     })
//     .populate({
//         path: 'productid',
//         select: {}
//     })
//     .exec(function (err, products) {
//       if (err) {console.log("Error in execution" + err);}
//       console.log('The creator is %s', products);
//      //res.render('showcollection',{products:products});
//     });


//});
//console.log("Outside " + storesArray[0]);
  // Storeitems
  //   .find({})
  //   .populate({
  //       path: 'storeid',
  //       select: {}
  //   })
  //   .populate({
  //       path: 'productid',
  //       select: {}
  //   })
  //   .exec(function (err, products) {
  //     if (err) {console.log("Error in execution" + err);}
  //     console.log('The creator is %s', products);
  //    //res.render('showcollection',{products:products});
  //   });




// Store
//   .find({}.distinct('_id',{'_id':1})
//   .limit(5)
//   .exec(function(err,stores){
//     console.log(stores);
//
//     for(i =0; i<5; i++)
//     {
//       console.log(stores[i]);
//       Userasset.find({'storeid':stores[i]}).limit(4).exec(function(err,prod){
//         console.log("UserAsset "+ i + "contains " + prod);
//       });
//
//     }
//
//   });





});




router.get('/collection/:id', function(req,res,next){
  var reqID = req.params.id.replace("id:","");
  Userasset
    .find({collectionid:reqID})
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
});


router.get('/user/:id', function(req,res,next){
  var reqID = req.params.id.replace("id:","");
  User.find({"_id": reqID},{"displayname":1,"user.displayimage":1,"user.facebook.gender":1},function(err, user) {
      Store.find({"ownerid": reqID},{"storename":1,"createdon":1},function(err, store) {
          Collection.find({"ownerid": reqID},{"collectionname":1,"createdon":1},function(err, collection) {
              Product.find({"addedby": reqID},{"title":1,"image":1,"description":1,"currency":1,"price":1},function(err, product) {
                console.log("Hi 12334 --" + user);
              res.render('users',{user:user,store:store,collection:collection,product:product})
              });
          });
      });
    });
});


router.get('/test', function(req,res,next){
  getStoreId("MyStore");
  getStoreId("MyStore");
  getStoreId("MyStore");
  getStoreId("jabong");
  getStoreId("jabong");
  getStoreId("jabong");
  getStoreId("jabong");
  getStoreId("jabong");
  getStoreId("jabong");
  getStoreId("jabong");
  getStoreId("jabong.com");
  getStoreId("jabong.com");
  getStoreId("jabong.com");
  getStoreId("jabong.com");
  getStoreId("jabong.com");
  getStoreId("jabong.com");
  getStoreId("jabong.com");
  getStoreId("MyStore");
  getStoreId("MyStore");
  getStoreId("MyntraStore");
  getStoreId("MyntraStore");
  getStoreId("MyntraStore");
  getStoreId("MyntraStore");

getStoreId("http://www.jabong.com/Biba-Navy-Blue-Printed-Kurta-1919090.html");
getStoreId("http://www.jabong.com/Biba-Navy-Blue-Printed-Kurta-With-Lining-1919217.html");
getStoreId("http://www.jabong.com/Biba-Navy-Blue-Printed-Kurta-1919218.html");
getStoreId("http://www.jabong.com/Biba-Navy-Blue-Printed-Kurta-1919216.html");
getStoreId("http://www.jabong.com/Biba-Blue-Printed-Kurta-1919158.html");
getStoreId("http://www.jabong.com/Biba-Blue-Printed-Cotton-Kurti-1772480.html");
getStoreId("http://www.jabong.com/Biba-Pink-Printed-Cotton-Kurti-1772489.html");
getStoreId("http://www.jabong.com/Biba-Orange-Printed-Cotton-Blend-Kurta-1821876.html");
getStoreId("http://www.jabong.com/Biba-Brown-Printed-Kurta-1685900.html");
getStoreId("http://www.jabong.com/Biba-Purple-Printed-Kurta-1685909.html");
getStoreId("http://www.jabong.com/Biba-Pink-Printed-Cotton-Kurti-1772482.html");
getStoreId("http://www.jabong.com/Biba-Pink-Printed-Cotton-Kurti-1772484.html");
getStoreId("http://www.jabong.com/Biba-Pink-Printed-Kurti-1652204.html");
getStoreId("http://www.jabong.com/Biba-Blue-Embroidered-Cotton-Blend-Kurti-1674041.html");
getStoreId("http://www.jabong.com/Biba-Pink-Printed-Cotton-Kurta-1772477.html");
getStoreId("http://www.jabong.com/Biba-Red-Printed-Kurti-1652200.html");
getStoreId("http://www.jabong.com/Biba-Navy-Blue-Printed-Kurta-With-Lining-1919155.html");
getStoreId("http://www.jabong.com/Biba-Black-Printed-Cotton-Blend-Kurti-1674061.html");
getStoreId("http://www.jabong.com/Biba-Off-White-Printed-Kurti-1605881.html");
getStoreId("http://www.jabong.com/Biba-Yellow-Printed-Cotton-Blend-Kurti-167405");
getStoreId("http://www.jabong.com/Biba-Red-Printed-Cotton-Kurti-1772475.html");
getStoreId("http://www.jabong.com/Biba-Orange-Embellished-Polyester-Kurta-1747371.html");
getStoreId("http://www.jabong.com/Biba-Blue-Printed-Cotton-Blend-Kurti-1674035.html");
getStoreId("http://www.jabong.com/Biba-Red-Printed-Kurti-1652218.html");
getStoreId("http://www.jabong.com/Biba-Blue-Embroidered-Cotton-Kurti-1772476.html");
getStoreId("http://www.jabong.com/Biba-Fuchsia-Printed-Cotton-Blend-Kurta-1821877.html");
getStoreId("http://www.jabong.com/Biba-Blue-Embroidered-Cotton-Blend-Kurti-With-Lining-1674031.html");
getStoreId("http://www.jabong.com/Biba-Blue-Printed-Kurti-1572154.html");
getStoreId("http://www.jabong.com/Biba-Red-Embellished-Modal-Kurta-1747365.htmlv");
getStoreId("http://www.jabong.com/Biba-Pink-Printed-Cotton-Blend-Kurti-1674057.html");
getStoreId("http://www.jabong.com/Biba-Blue-Printed-Cotton-Blend-Kurti-1674037.html");
getStoreId("http://www.jabong.com/Biba-Fuchsia-Embellished-Polyester-Kurta-1747370.html");
getStoreId("http://www.jabong.com/Biba-Yellow-Printed-Kurta-1685895.html");
getStoreId("http://www.jabong.com/Biba-Orange-Solid-Kurti-1605898.html");
getStoreId("http://www.jabong.com/Biba-Yellow-Printed-Cotton-Blend-Kurti-1674032.html");
getStoreId("http://www.jabong.com/Biba-Blue-Printed-Kurti-1685901.html");
getStoreId("http://www.jabong.com/Biba-Cream-Printed-Cotton-Blend-Kurti-1821878.html");
getStoreId("http://www.jabong.com/Biba-Blue-Embroidered-Kurti-1730097.html");







});

function getStoreId(storename) {
  Store.findOne({ 'storename' : storename }, function(err, store) {
    if(err){console.log("Error getting store.");}
    else if(store){
        console.log("Store exists with name " + storename + " and the id is -"+ store._id);
        //addItemToStore(prodId,store._id);
    }
    else{
      console.log("Store Not Found, Creating New store. -" + storename);
      var newStore = new Store();
      newStore.storename = storename;
      newStore.save(function(err) {
        if (err){ console.log("Store Creation Failed "+ err);
            throw err;}
        else {
          //  addItemToStore(prodId,newStore._id);
            }
      });
    }
  });
}



function getStoreId1(storename,userId, prodId, collectionid, storeid) {
  var storeID = "";
  console.log('Store Name to Search is = '+ storename);
  Store.find({'storename':storename},function(err,store){
    if(err){
      console.log("Error in getting store Id " + storename);
    }else if(store){
      console.log("Store already exists " +  storename +" and the id is " + store[0]._id);
      storeID = store._id;
    //  addUserAsset(userId, prodId, " ", storeID);
    addItemToStore(prodId,storeID);
    }
    else{
      console.log("creating new store");
      var newStore = new Store();
      newStore.storename = storename;
      newStore.save(function(err) {
        if (err){
          console.log("Store Creation Failed "+ err);
            throw err;
            //return(result(err));
        } else {
            storeID = newStore._id;
              addItemToStore(prodId,storeID);
            //return(result(null,newUserasset));
            //addUserAsset(userId, prodId, " ", storeID);
        }
     });
    }
  });
  console.log('The storeID returned is ' + storeID);

}







module.exports = router;
