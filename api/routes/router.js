var passport = require('passport');
var path = require('path');

var baseDir = '..';
var user = require(path.join(__dirname, baseDir, 'routes/user'));

function logged(req, res, next) {
  if (req.user && req.user._id) {
    return next();
  } else {
    res.send(401);
  }
}

module.exports = function (router) {
  /* User routes*/
  router.post('/login', passport.authenticate('local'), user.login);
  router.get('/logout', logged, user.logout);
  /*
  router.get('/verify-email/:id', user.verifyEmail);
  */
};
