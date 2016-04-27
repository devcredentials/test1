var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')
var multer  = require('multer');
//var upload = multer({ dest: 'upload/'});
var fs = require('fs');
var xlsx = require('node-xlsx');
var Product = require('../models/product');
var Store = require('../models/store');
var Collection = require('../models/collection');
var Userasset = require('../models/userasset');
var Storeitems = require('../models/storeitems');
var mylib = require('../mylib/mylibrary');
var configAuth = require('../config/auth');

//var type = upload.single('userPhoto');
router.get('/', function(req, res, next) {
  cSession = req.session;
  res.send('respond with a resource');
});


/////////////////////////////////////
//
// var upload = multer({
//     dest: './public/profile/img/',
//     limits: {
//         fieldNameSize: 50,
//         files: 1,
//         fields: 5,
//         fileSize: 1024 * 1024
//     },
//     rename: function(fieldname, filename) {
//         return filename;
//     },
//     onFileUploadStart: function(file) {
//         console.log('Starting file upload process.');
//         if(file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
//             return false;
//         }
//     },
//     inMemory: true //This is important. It's what populates the buffer.
// });


router.post('/profilepic',function(req,res){
    //'./public/profile/img/'
    console.log("Hi I am uploading the image.");
  var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './uploads');
    },
    filename: function (req, file, callback) {
      callback(null, file.fieldname + '-' + Date.now() + file.originalname);
    }
  });
  var upload = multer({ storage : storage}).single('userPhoto');
    upload(req,res,function(err) {
      if(err) {
          return res.end("Error uploading file.");
      }
      res.end("File is uploaded");
  });
  console.log("Done.");
});


router.post('/photo',function(req,res){
var targetfilename ="";
  var storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, './uploads/')
      },
      filename: function (req, file, cb) {
        targetfilename = Date.now() + '-' + file.originalname;
        cb(null,targetfilename )
      //  cb(null, Date.now() + '-' + file.originalname )
      }
    });

  var upload = multer(
          {storage:storage,
          fileFilter : function(req, file, callback) {
              var fileType = ['xls','xlsx'];
              if (fileType.indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
                  console.log("Invalid file extension." + req.file);
                  return callback(new Error('Wrong extension type'));
              }
              callback(null, true);
          }
      }).single('userPhoto');
            //  res.end("File is uploaded");
    upload(req,res,function(err) {
       if(err) {
           console.log("File not Uploaded  :  " + err );
            return res.end("Error uploading file.");
       }
       console.log("File Uploaded and the path is : " + storage);

       //res.end("File is uploaded");
       //var filepath1="";
       readExcelFile(res,cSession.userId,targetfilename);
    });
});


function readExcelFile(res,userId,filepath)
{
  var object =  xlsx.parse('./uploads/' + filepath);
  var jsonContent = JSON.parse(JSON.stringify(object));
  var Sheet1 = jsonContent[0]["data"];
    Sheet1.forEach(function(value){ //EAchc Row
      //  console.log("My Val =     " +value);
          var row = value;
          var columns = value.toString().split(',');
          var columnCount = columns.length;

          if(columns[1].toLowerCase() === "sourceurl")
          { //Do Nothing for Header Row
          }else
          {
            var storeName = "";
              var newProd = new Product();
              for(var i=0; i<columnCount; i++)
              { //" Cell value = " + console.log(columns[i]);
                  if(i==1){
                    newProd.sourceurl = columns[i];
                    console.log("Source URL = " + newProd.sourceurl );
                    if(newProd.sourceurl.indexOf("/")>=0){
                        newProd.addedby =  newProd.sourceurl.split("/")[2];
                    }else{
                        newProd.addedby = newProd.sourceurl;
                    }
                    console.log("Source URL = " + newProd.sourceurl  + " Added By = " + newProd.addedby )
                    storeName = newProd.addedby.replace("www.","");
                    console.log("Source URL = " + newProd.sourceurl  + " Added By = " + newProd.addedby + "Store Name = " + storeName );
                  }
                  if(i===2){
                  //  var ProductFilePath = './downloads/ '+Date.now() + '-prod.jpg';
                  var fileName = Date.now() + '-prod.jpg';
                  var ProductFilePath = './public/images/product/'+fileName;
                  console.log("Product File Path is  ="+ProductFilePath + fileName);
                  //configAuth.burl + 'images/imgprofile.jpg';
                    mylib.download_file_httpget(columns[i],ProductFilePath);
                    newProd.image = configAuth.burl + 'images/product/' + fileName;//columns[i];
                    //newProd.addedby = userId;
                    newProd.addedon = Date.now();
                  }else if(i===3){
                    newProd.title = columns[i];
                  }else if(i===4){
                    newProd.description = columns[i];
                  }else if(i===5){
                    newProd.details = columns[i];
                  }else if(i===6){
                    newProd.category = columns[i];
                  }else if(i===7){
                    newProd.categorytype = columns[i];
                  }else if(i===8){
                    newProd.parentcategory = columns[i];
                  }else if(i===9){
                    newProd.currency = columns[i];
                  }else if(i===10){
                    newProd.oldprice = columns[i];
                  }else if(i===11){
                    newProd.price = columns[i];
                  }else if(i===12){
                    newProd.discount = columns[i];
                  }else if(i===13){
                    newProd.sizes = columns[i];
                  }else if(i===14){
                    newProd.keywords = columns[i];
                  }else if(i===15){
                    newProd.metadesc = columns[i];
                  }
              }
              console.log(newProd);
                newProd.save(function(err) {
                      if (err){ throw err;}
                      else{ console.log("Get storeid for store "+ storeName);
                     getStoreId(storeName,userId, newProd._id, " ", " ");

                    }
              });
          }
      });
    res.redirect('../show/showstores');
}



function getStoreId(storename,userId, prodId, collectionid, storeid) {
  Store.findOne({ 'storename' : storename }, function(err, store) {
    if(err){console.log("Error getting store.");}
    else if(store){
        console.log("Store exists with name " + storename + " and the id is -"+ store._id);
        addItemToStore(prodId,store._id);
    }
    else{
      console.log("Store Not Found, Creating New store. -" + storename);
      var newStore = new Store();
      newStore.storename = storename;
      newStore.save(function(err) {
        if (err){ console.log("Store Creation Failed "+ err);
            throw err;}
        else {
          addItemToStore(prodId,newStore._id);

            }
      });
    }
  });
}

function addItemToStore(productid, storeid) {
  var newStoreitem = new Storeitems();
  newStoreitem.storeid = storeid;
  newStoreitem.productid = productid;
    newStoreitem.save(function(err) {
        if (err){ console.log("Failed adding item to store");  throw err; }
        else {  console.log("Item added to store  " + newStoreitem._id);  }
    });
}

function getStoreIdOold(storename,userId, prodId, collectionid, storeid) {
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
  //addUserAsset(userId, prodId, " ", storeID);
  //addUserAsset(userid, productid, collectionid, storeid)
}



function addUserAsset(userid, productid, collectionid, storeid) {
console.log("11111111111");
    if(collectionid===" ")
    {
      console.log("222222222222222222");
      Collection.findOne({'ownerid':userid},function(err,coll){
        if(err){ console.log("Error in collection :  " + err); }
        console.log("COLLECTION ID is " + coll);
        collectionid = coll._id;
              if(storeid===" ")
              {
                console.log("333333333333333");
                Store.findOne({'ownerid':userid},function(err,sto){
                  if(err){  console.log("Error in store :  " + err); }
                  console.log("Store ID is " + sto);
                  storeid = sto._id;
                          console.log("I am in");
                          console.log("USER ID = " + userid +
                                      "PRODUCT ID = " + productid +
                                      "COLLECTION ID = " + collectionid +
                                      "STORE ID = " + storeid
                                      );
                            var newUserasset = new Userasset();
                                newUserasset.userid = userid;
                                newUserasset.productid = productid;
                                newUserasset.collectionid = collectionid;
                                newUserasset.storeid = storeid;
                                  // Add to database
                                  newUserasset.save(function(err) {
                                    if (err){
                                      console.log("User Asset failed "+ err);
                                        throw err;
                                        //return(result(err));
                                    } else {
                                        console.log("New Asset is : " + newUserasset);
                                        //return(result(null,newUserasset));
                                    }
                                 });

                });
              }
              else {
                console.log("Store Id is =  " + storeid );
                console.log("USER ID = " + userid +
                            "PRODUCT ID = " + productid +
                            "COLLECTION ID = " + collectionid +
                            "STORE ID = " + storeid
                            );
                  var newUserasset = new Userasset();
                      newUserasset.userid = userid;
                      newUserasset.productid = productid;
                      newUserasset.collectionid = collectionid;
                      newUserasset.storeid = storeid;
                        // Add to database
                        newUserasset.save(function(err) {
                          if (err){
                            console.log("User Asset failed "+ err);
                              throw err;
                              //return(result(err));
                          } else {
                              console.log("New Asset is : " + newUserasset);
                              //return(result(null,newUserasset));
                          }
                       });


                // Store.findOne({'_id':storeid},function(err,sto){
                //   if(err){  console.log("Error in store111 :  " + err); }
                //   console.log("Store ID is " + sto);
                //   storeid = sto._id;
                //           console.log("I am in");
                //           console.log("USER ID = " + userid +
                //                       "PRODUCT ID = " + productid +
                //                       "COLLECTION ID = " + collectionid +
                //                       "STORE ID = " + storeid
                //                       );
                //             var newUserasset = new Userasset();
                //                 newUserasset.userid = userid;
                //                 newUserasset.productid = productid;
                //                 newUserasset.collectionid = collectionid;
                //                 newUserasset.storeid = storeid;
                //                   // Add to database
                //                   newUserasset.save(function(err) {
                //                     if (err){
                //                       console.log("User Asset failed "+ err);
                //                         throw err;
                //                         //return(result(err));
                //                     } else {
                //                         console.log("New Asset is : " + newUserasset);
                //                         //return(result(null,newUserasset));
                //                     }
                //                  });
                //
                // });

              }
      });
    }


    //
    // function readExcelFile1(res,userId,filepath)
    // {    //Read Excel File
    //         //var obj = xlsx.parse(__dirname + '/myFile.xlsx');
    //       //var obj = xlsx.parse('./uploads/' + '/1458413823666-Book  new.xlsx');
    //       var obj = xlsx.parse('./uploads/' + filepath);
    //       //var obj = xlsx.parse(storage[0].destination);
    //        var jsonContent = JSON.parse(JSON.stringify(obj));
    //         // console.log("Json is " + jsonContent[0]);
    //         // console.log("User Name1:", jsonContent[0]["data"]);
    //         for(var data in jsonContent) {
    //           console.log("key:"+"data"+", value:"+jsonContent[data]);
    //         }
    //         var Sheet1 = jsonContent[0]["data"];
    //           Sheet1.forEach(function(value){ //EAchc Row
    //                 var row = value;
    //                 var columns = value.toString().split(',');
    //                 var columnCount = columns.length;
    //                 //console.log("columns = "+ columnCount);
    //                 for(var i=0; i<columnCount; i++)
    //                 { " Cell value = " + console.log(columns[i]); }
    //             });
    //       //  console.log("S1 - length =" + Sheet1.length);
    //       var pageHTML = '<head><script src="/js/lib/jquery-2.2.0.min.js"></script><script src="/js/lib/bootstrap.min.js"></script></head>';
    //       pageHTML += '<div class="container"><table class="table"><tbody>';
    //       var Sheet1 = jsonContent[0]["data"];
    //         Sheet1.forEach(function(value){ //EAchc Row
    //           //  console.log("My Val =     " +value);
    //               var row = value;
    //               pageHTML += '<tr>' ;
    //               var columns = value.toString().split(',');
    //               var columnCount = columns.length;
    //
    //               if(columns[1].toLowerCase() === "product image url")
    //               { //Do Nothing for Header Row
    //               }else
    //               {
    //                   var newProd = new Product();
    //                   for(var i=0; i<columnCount; i++)
    //                   { //" Cell value = " + console.log(columns[i]);
    //                       if(i===1){
    //                       //  var ProductFilePath = './downloads/ '+Date.now() + '-prod.jpg';
    //
    //                       var fileName = Date.now() + '-prod.jpg';
    //                       var ProductFilePath = './public/images/product/'+fileName;
    //                       console.log("Product File Path is  ="+ProductFilePath + fileName);
    //                       //configAuth.burl + 'images/imgprofile.jpg';
    //                         mylib.download_file_httpget(columns[i],ProductFilePath);
    //                         newProd.image = configAuth.burl + 'images/product/' + fileName;//columns[i];
    //                         newProd.addedby = userId;
    //                         newProd.addedon = Date.now();
    //                       }else if(i===2){
    //                         newProd.title = columns[i];
    //                       }else if(i===3){
    //                         newProd.description = columns[i];
    //                       }else if(i===4){
    //                         newProd.currency = columns[i];
    //                       }else if(i===5){
    //                         newProd.price = columns[i];
    //                       }else if(i===6){
    //                         newProd.baseurl = columns[i];
    //                       }else if(i===7){
    //                         newProd.category = columns[i];
    //                       }
    //                     pageHTML += '<td>'+ columns[i]  +'</td>';
    //                   }
    //                   pageHTML += '</tr>';
    //                   console.log(newProd);
    //                     newProd.save(function(err) {
    //                       if (err){ throw err;}
    //                       else{
    //                           addUserAsset(userId, newProd._id, " ", " ");
    //                           console.log("New product is : " + newProd);
    //                         }
    //                   });
    //               }
    //           });
    //           pageHTML += '</tbody></table></div>';
    //           //  console.log(pageHTML);
    //               //res.render('admin/previewfile', {excelFile:pageHTML});
    //       res.end(pageHTML);
    // }
    //
    // router.get('/a', function(req, res) {
    //
    //     var page = parseInt(req.query.page),
    //         size = parseInt(req.query.size),
    //         id = req.query.id,
    //         skip = page > 0 ? ((page - 1) * size) : 0;
    //
    //       Uploads.find({ $and: [{'memberid' : id, 'status': { $in: [ 0, 1, 2, 3, 4, 7, 8  ] } }]}, null,{
    //
    //          skip: skip,
    //          limit: size,
    //          sort: {
    //                 _id: -1 //Sort by Date Added DESC
    //             }
    //       }, function (err, data) {
    //          if(err) {
    //             logger.error(err);
    //             res.json({
    //               success: false,
    //               data: err.message
    //             });
    //          }
    //          else {
    //             res.json({
    //               success: true,
    //               data: data
    //             });
    //          }
    //       });
    // });
    //
    //




}

module.exports = router;
