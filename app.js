var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('express-flash');
var session = require('express-session');
var dbConfig = require('./config/db');
var passportConfig = require('./config/passport');
var methodOverride = require('method-override');
var fs = require('fs');

require('./config/passport')(passport);

var routes = require('./routes/index');
var admin = require('./routes/admin');
var listing = require('./routes/listing');
var addprod = require('./routes/addprod');
var prodoper = require('./routes/prodoper');
var uploads = require('./routes/uploads');
//var sendmail = require('./routes/sendmail');
var users = require('./routes/users');
var autocomplete = require('./routes/autocomplete');
var show = require('./routes/show');
var tweadmin = require('./routes/tweadmin');

var app = express();
var cSession;
//Connect to DB
mongoose.connect(dbConfig.url); // connect to our database
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
          secret:"agdev",
          resave:"true",
          saveUninitialized:"true"}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());



app.use('/', routes);
app.use('/admin', admin);
app.use('/listing',listing);
app.use('/users', users);
app.use('/addprod',addprod);
app.use('/prodoper',prodoper);
//app.use('/sendmail',sendmail);
app.use('/uploads',uploads);
app.use('/autocomplete',autocomplete);
app.use('/show',show);
app.use('/tweadmin',tweadmin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
