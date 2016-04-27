var express = require('express');
var Login = require('../models/loginhistory');
var Store = require('../models/store');
var Collection = require('../models/collection');

module.exports={
  addLogin : function(userId,activity){
    console.log("Call for log Activity");
    logActivity(userId,activity);
  },
  createDefaults : function(userId){
    console.log("CALL RECEIVED TO CREATE DEFAULTS.");
    CreateDefaults(userId);
  }
};


function logActivity(userId,activity)
{
  var newLogin = new Login();
    newLogin.userid = userId;
    if(activity==='login'){
      newLogin.logintime = Date.now();
    }
    else {
      newLogin.logouttime = Date.now();
    }
    newLogin.save(function(err) {
        if (err){
            console.log("Login History Not Updated " + err);
            throw err;
          }
        else {
          console.log("Login History Updated for user " + userId);
        }
    });
}

function CreateDefaults(userId)
{
    var storeName = "MyStore";
      Store.findOne({$and:[{ 'storename' : storeName },{ 'ownerid' : userId }]}, function(err, store) {
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
                  if (err){ throw err;}
                  else { console.log("New Store is : " + newStore);}
              });
          }
      });

      var collectionName = "MyCollection";
        Collection.findOne({$and:[{ 'collectionname' : collectionName },{ 'ownerid' : userId }]}, function(err, collection) {
            if (err)
            {
              console.log("Error Occured And it is :- "+ err);
            }
            if (collection) {
              console.log("The Collection already Exists and thde details are" + collection);
            } else {
                var newCollection      = new Collection();
                  newCollection.collectionname = collectionName;
                  newCollection.ownerid = userId;
                  // Add to database
                  newCollection.save(function(err) {
                    if (err){ throw err;}
                    else { console.log("New Collection is : " + newCollection);}
                });
            }
        });
}
