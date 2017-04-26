var crypto = require('crypto');
var path = require('path');
var ObjectID = require('mongodb').ObjectID;
var async = require('async');
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
User.prototype.getInfo = getInfo;
User.prototype.getTransactions = getTransactions;
User.prototype.wireTransaction = wireTransaction;
User.prototype.recover = recover;
User.prototype.resetPassword = resetPassword;

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
  return callback(null, user._id.toString());
}

function deserializeUser(id, callback) {
  var query = {
    _id: new ObjectID(id)
  };
  var options = {
    id: 1
  };
  var collection = db.collection('users');
  collection.findOne(query, options, callback);
}

function getInfo(id, callback) {
  var query = {
    _id: new ObjectID(id)
  }
  var options = {
    email: 1,
    fullName: 1,
    image: 1
  };
  var collection = db.collection('users');
  collection.findOne(query, options, callback);
}

function getTransactions(id, callback) {
  var query = {
    _id: new ObjectID(id)
  }
  var options = {
    transactions: 1
  };
  var collection = db.collection('users');
  collection.findOne(query, options, callback);
}

function wireTransaction(user, transaction, callback) {
  transaction.date = new Date();
  async.series([
    next => {
      const receiver = {
        accountNumber: transaction.account
      };
      const push = {
        $push: {
          transactions: {
            $each: [transaction],
            $position: 0
          }
        }
      }
      db.collection('users').update(receiver, push, next);
    },
    next => {
      transaction.amount = -transaction.amount;
      const sender = {
        _id: new ObjectID(user._id)
      };
      const push = {
        $push: {
          transactions: {
            $each: [transaction],
            $position: 0
          }
        }
      }
      db.collection('users').update(sender, push, next);
    }
  ], callback);
}

function recover(email, callback) {
  var query = {
    email: email
  }
  var options = {
    _id: 1,
    question: 1
  };
  var collection = db.collection('users');
  collection.findOne(query, options, callback);
}

function resetPassword(data, callback) {
  var query = {
    _id: new ObjectID(data._id),
    answer: data.answer
  }
  var update = {
    $set: {
      password: hash(data.newPassword)
    }
  };
  var collection = db.collection('users');
  collection.update(query, update, callback);
}

module.exports = new User();
