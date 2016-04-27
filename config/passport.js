// config/passport.js

// load all the things we need
var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

// load up the user model
var User = require('../models/user');
var Helper = require('../mylib/helperMethods');
var maillib = require('../mylib/maillib');

// load the auth variables
var configAuth = require('./auth');


module.exports = function(passport) {

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // code for login (use('local-login', new LocalStategy))
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        //rememberMe    : 'rememberMe',
        passReqToCallback : true // allows us to pass back the entire request to the callback
      },
      function(req, email, password, done) { // callback with email and password from our form
        console.log("Hi I am In Login");
          User.findOne({ 'local.email' :  email }, function(err, user) {
              // if there are any errors, return the error before anything else
              if (err)
                  return done(err);
              // if no user is found, return the message
              if (!user)
                  return done(null, false, req.flash('loginMessage', 'Invalid user.')); // req.flash is the way to set flashdata using connect-flash

              // if the user is found but the password is wrong
              if (!user.validPassword(password))
                  return done(null, false, req.flash('loginMessage', 'Invalid password.')); // create the loginMessage and save it to session as flashdata

              Helper.addLogin(user._id,'login');
              // all is well, return successful user
              return done(null, user);
          });

      }));

      // code for signup (use('local-signup', new LocalStategy))
      passport.use('local-signup', new LocalStrategy({
              // by default, local strategy uses username and password, we will override with email
              usernameField : 'email',
              passwordField : 'password',
              passReqToCallback : true // allows us to pass back the entire request to the callback
          },
          function(req, email, password, done) {
              process.nextTick(function() {
                User.findOne({ 'local.email' :  email }, function(err, user) {
                  // if there are any errors, return the error
                  if (err)
                      return done(err);
                  // check to see if theres already a user with that email
                  if (user) {
                      return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                  } else {
                      // if there is no user with that email
                      // create the user
                      var newUser = new User();

                      // set the user's local credentials
                      newUser.displayname    = email.split('@')[0];
                      newUser.local.email    = email;
                      newUser.primaryemail   = email;
                      newUser.local.password = newUser.generateHash(password);
                      newUser.displayimage   = configAuth.burl + 'images/imgprofile.jpg';
                      // save the user
                      newUser.save(function(err) {
                          if (err){
                              throw err;
                            }
                          else {
                            Helper.addLogin(newUser._id,'login');
                            Helper.createDefaults(newUser._id);
                            maillib.gmailwelcome(newUser.primaryemail);
                          }
                          return done(null, newUser);
                      });
                  }

              });

              });
          }));


    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        profileFields: ['id', 'displayName', 'first_name', 'last_name','gender','email']
    },

        // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {
      console.log("FB profile is "+ profile._json.bio);

        // asynchronous
        process.nextTick(function() {

            // find the user in the database based on their facebook id
            User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                {
                  console.log("Error Occured And it is :- "+ err);
                    return done(err);
                  }
                // if the user is found, then log them in
                if (user) {
                  console.log("The user Exists and thde details are" + user);
                    Helper.addLogin(user._id,'login');
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    var newUser            = new User();

                    // set all of the facebook information in our user model
                    newUser.facebook.id    = profile.id; // set the users facebook id
                    newUser.facebook.token = token; // we will save the token that facebook provides to the user
                    newUser.facebook.displayName  = profile.displayName;
                    newUser.displayname  = profile.displayName;
                    newUser.facebook.firstName = profile.name.givenName; //profile.first_name;
                    newUser.facebook.lastName = profile.name.familyName; //profile.last_name;       //profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                    newUser.facebook.gender = profile.gender;
                    newUser.facebook.picture = 'https://graph.facebook.com/'+profile.id + '/picture?type=large';
                    newUser.displayimage = 'https://graph.facebook.com/'+profile.id + '/picture?type=large';

                    if (profile.emails)
                    {
                      newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                      newUser.primaryemail =  profile.emails[0].value;
                    }

                    // save our user to the database
                    newUser.save(function(err) {
                        if (err){
                            throw err;
                          }
                        else {
                          Helper.addLogin(newUser._id,'login');
                          Helper.createDefaults(newUser._id);
                        }

                        // if successful, return the new user
                        return done(null, newUser);
                        console.log("New User is : " + newUser);
                    });
                }

            });
        });

    }));

};
