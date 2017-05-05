//
// BankHacking API
//
// Created by: Eric Borland
//
// SopraSteria © 2017
// All rights reserved
//

var express = require('express');
var http = require('http');
var expressSession = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var compression = require('compression');
var bodyParser = require('body-parser');
var path = require('path');

var User = require('./models/user');
var mongo = require(path.join(__dirname, 'lib/db'));

var package = require(path.join(__dirname, '../package.json'));

// Config
const config = {
  session: {
    secret: 'mYSuP3Rs3Cr3Tt4thN0b0D3v3rkN0ws',
  },
  db: {
    url: 'mongodb://test:test@localhost/bank'
  },
  server: {
    port: 4000
  },
  credentials: {
    usernameField: 'email',
    passwordField: 'password'
  }
}

// Initializing the app
var app = express();

// Access-Control
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-AUTHENTICATION, X-IP, Content-Type, Accept');
  return next();
});
// Parse stringified queries
app.use(function (req, res, next) {
  for (let key in req.query || {}) {
    if (typeof req.query[key] === 'string') {
      try {
        req.query[key] = JSON.parse(req.query[key]);
      } catch (e) {}
    }
  }
  return next();
});

// Sessio and authentication
app.use(expressSession({
  secret: config.session.secret,
  saveUninitialized: true,
  resave: true,
  cookie: { httpOnly: false, secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(config.credentials, User.login));
passport.serializeUser(User.serializeUser);
passport.deserializeUser(User.deserializeUser);

// GZIP Compression
app.use(compression());
// BodyParser
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '8mb'
}));
app.use(bodyParser.json({
  limit: '8mb'
}));
// Router
require(path.join(__dirname, 'routes/router'))(app);
// Error Handler
app.use(function(err, req, res, next) {
  if (err) {
    console.log('There has been an uncontrolled error.\nNo stack trace has been leaked doh!', err);
    res.sendStatus(err.status || 500);
  } else {
    return next();
  }
});

// Starting DB and API
(function initializeAPI() {
  console.log('Connecting to the DB...');
  mongo.connect(config.db.url, db => {
    console.log('Starting express server...');
    http.createServer(app).listen(config.server.port, err => {
      if (err) {
        console.error(err, 'Error starting BankHacking-API');
      } else {
        console.log({
          port: config.server.port,
          version: package.version
        }, 'BankHacking-API Running');
        console.log('\n\n****************************************');
        console.log('****************************************');
        console.log('           BankHacking API');
        console.log('----------------------------------------');
        console.log('            version: ' + package.version);
        console.log('****************************************\n\n');
      }
    });
  });
})();
