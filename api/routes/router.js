var passport = require('passport');
var path = require('path');

var baseDir = '..';
var user = require(path.join(__dirname, baseDir, 'routes/user'));

module.exports = function (router) {
  /* User routes*/
  /*
  router.post('/login', passport.authenticate('local'), user.login);
  router.post('/signup', user.signup);
  router.get('/verify-email/:id', user.verifyEmail);
  router.get('/logout', restrict.logged, user.logout);
  */
};
