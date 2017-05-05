var User = require('../models/user');
function UserRouter() {}

UserRouter.prototype.login = login;
UserRouter.prototype.logout = logout;
UserRouter.prototype.getInfo = getInfo;
UserRouter.prototype.getImage = getImage;
UserRouter.prototype.getTransactions = getTransactions;
UserRouter.prototype.wireTransaction = wireTransaction;
UserRouter.prototype.recover = recover;
UserRouter.prototype.resetPassword = resetPassword;

function login(req, res) {
  res.status(200).send(req.user);
}

function logout(req, res) {
  if (req.logout) {
    req.logout();
  }
  res.sendStatus(204);
}

function getInfo(req, res) {
  User.getInfo(req.params.id, (err, result) => {
    if (err || !result) {
      return res.sendStatus(err.code || 404);
    }
    res.status(200).send(result);
  });
}

function getImage(req, res) {
  User.getImage(req.user._id, (err, result) => {
    if (err || !result) {
      return res.sendStatus(err.code || 404);
    }
    res.status(200).send(result);
  });
}

function getTransactions(req, res) {
  User.getTransactions(req.params.id, (err, result) => {
    if (err || !result) {
      return res.sendStatus(err.code || 404);
    }
    res.status(200).send(result);
  });
}

function wireTransaction(req, res) {
  User.wireTransaction(req.user, req.body, (err, result) => {
    if (err) {
      return res.sendStatus(err.code || 500);
    }
    res.sendStatus(204);
  });
}

function recover(req, res) {
  User.recover(req.params.email, (err, result) => {
    if (err) {
      return res.sendStatus(err.code || 500);
    }
    res.status(200).send(result);
  });
}

function resetPassword(req, res) {
  User.resetPassword(req.body, (err, result) => {
    if (err) {
      return res.sendStatus(err.code || 500);
    }
    res.status(200).send(result);
  });
}

module.exports = new UserRouter();
