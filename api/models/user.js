var crypto = require('crypto');
var path = require('path');
var baseDir = '..';
var db = require(path.join(__dirname, baseDir, 'lib/db'));

var hash = function (password) {
  var hash = crypto.createHash('md5');
  var hashed = hash.update(password);
  hashed = hashed.digest('hex');
  return hashed;
};

function User() {}

User.prototype.login = login;
User.prototype.serializeUser = serializeUser;
User.prototype.deserializeUser = deserializeUser;

function login(email, password, callback) {
  console.log(`Login in with email:${email} and password:${password} ==> ${hash(password)}`);
  var collection = db.collection('users');
  var query = {
    email: email,
    password: hash(password),
    //password: hash(password + 'SALT')
  };
  var options = {
    password: false
  };
  collection.findOne(query, options, function (err, result) {
    return callback(err, result || false);
  });
}

function serializeUser(user, callback) {
  return callback(null, user._id);
};

function deserializeUser(id, callback) {
  var query = {
    _id: new ObjectID(id)
  };
  var options = {
    password: 0
  };
  var collection = db.collection('users');
  collection.findOne(query, options, callback);
};

module.exports = new User();
