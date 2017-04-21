function UserRouter() {}

UserRouter.prototype.login = login;
UserRouter.prototype.logout = logout;

function login(req, res) {
  res.send(200, req.user);
}

function logout(req, res) {
  if (req.logout) {
    req.logout();
  }
  res.send(204);
}

module.exports = new UserRouter();
