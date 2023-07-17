const createError = require('http-errors');
var hbs = require('hbs');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
var base64 = require('base-64');
var flash = require('connect-flash');
var session = require('express-session');
const hpkp = require('hpkp');
const nocache = require('nocache');
const moment = require('moment');



hbs.registerHelper('dateFormat', require('handlebars-dateformat'));
hbs.registerHelper('sequelizeGet', function(obj, col) {
  return obj.get(col);
}); 
//Adott dátumot elhagytuk vagy nem
hbs.registerHelper("has_passed", function(dateString, options) {
  if(moment(dateString).isAfter(moment())){
    return options.fn(this);
  } else {
    return options.inverse(this);
    }
});
hbs.registerHelper('ifEquals', function(arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});
hbs.registerHelper('ifNotEquals', function(arg1, arg2, options) {
  return (arg1 != arg2) ? options.fn(this) : options.inverse(this);
});

const app = express();
const http = require('http').Server(app);

require('dotenv').config();

var port = process.env.PORT || 5112;

app.use(helmet.expectCt());
app.use(helmet.dnsPrefetchControl());
app.use(helmet.frameguard({ action: 'sameorigin'}));
app.use(helmet.hidePoweredBy());
app.use(hpkp({
  maxAge: 7776000,
  sha256s: ["AbCdEf123=", "ZyXwVu456="],
}));
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());
app.use(nocache());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));


var sessionStore = new session.MemoryStore;

app.use(session({
  cookie: { maxAge: 60000 },
  store: sessionStore,
  saveUninitialized: true,
  resave: 'true',
  secret: 'secret'
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});


//Connect flash
app.use(flash());

//Globars Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});
require('./routes/index.js')(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('404: Not Found ' + req.originalUrl); //here
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// setup websocket

app.listen(port/* , "localhost" */);
console.log('App runs on port ' + port);

module.exports = app;
