var passport = require('passport');
var path = require('path');

var baseDir = '..';
var user = require(path.join(__dirname, baseDir, 'routes/user'));

function logged(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.sendStatus(401);
  }
}

module.exports = function (router) {
  /* User routes*/
  router.post('/login', passport.authenticate('local'), user.login);
  router.get('/logout', logged, user.logout);
  router.get('/info/:id', logged, user.getInfo);
  router.get('/transactions/:id', logged, user.getTransactions);
  router.post('/wire', logged, user.wireTransaction);
  router.get('/recover/:email', user.recover);
  router.put('/reset-password', user.resetPassword);
};
