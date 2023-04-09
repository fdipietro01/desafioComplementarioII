const passport = require("passport");

const passportAutenticate = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.render("sessionAlert", {
          message: "Usuario no autenticado",
          case: "Login",
          url: "/login",
        });
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};

module.exports = passportAutenticate;
