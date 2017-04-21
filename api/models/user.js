function User() {}

User.prototype.login = login;
User.prototype.serializeUser = serializeUser;
User.prototype.deserializeUser = deserializeUser;

function login(email, password, callback) {
  var collection = db.collection('users');
  var query = {
    email: email,
    password: hash(password + config.salt),
    status: STATUS.ACTIVE
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
