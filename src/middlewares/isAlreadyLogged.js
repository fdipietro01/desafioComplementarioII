const passport = require("passport");

const passportIsLogged = (strategy, isHome = false) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return next();
      }
      if (isHome) {
        req.user = user;
        return next();
      }
      res.redirect("/home");
    })(req, res, next);
  };
};

module.exports = passportIsLogged;
