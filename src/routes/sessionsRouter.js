const { Router } = require("express");
const UserModel = require("../models/userSchema");
const { validatePassword, cryptPass } = require("../utils/bcrypt");
const { generateToken } = require("../utils/token");
const passportAutenticate = require("../middlewares/passportAutenticate");

const sessionsRouter = Router();
const cookieField = process.env.COOKIE_FIELD;

sessionsRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email }).lean();
  if (!user)
    return res.render("sessionAlert", {
      message: "No existe el usuario",
      url: "/login",
      case: "Login",
    });
  if (!validatePassword(user, password))
    return res.render("sessionAlert", {
      message: "Password Incorrecta",
      url: "/login",
      case: "Login",
    });
  delete user.password;
  const token = generateToken(user);
  req.user = user;
  res.cookie(cookieField, token, { maxAge: 60 * 60 * 1000, httpOnly: true });
  res.redirect("/home");
});

sessionsRouter.post("/register", async (req, res) => {
  const { email, password, nombre, apellido, edad, isAdmin } = req.body;
  const usr = await UserModel.findOne({ email }).lean();

  if (usr) {
    return res.render("sessionAlert", {
      success: false,
      message: "Usuario ya registrado",
      case: "Registro",
      url: "/login",
    });
  }
  const user = {
    nombre,
    apellido,
    email,
    password: cryptPass(password),
    edad,
    role: isAdmin ? "admin" : "user",
  };
  try {
    await UserModel.create(user);
    const token = generateToken(user);
    res.cookie(res, token);

    res.render("sessionAlert", {
      success: true,
      message: `${user.nombre} ${user.apellido} te has registrado exitosamente`,
      url: "/login",
      case: "Login",
    });
  } catch (err) {
    console.log(err);
    res.render("sessionAlert", {
      message: `Error al registrarse`,
      url: "/login",
      case: "Registro",
    });
  }
});

sessionsRouter.post("/relogin", async (req, res) => {
  const { mail, pass } = req.body;
  if (!mail || !pass)
    return res.render("sessionAlert", {
      success: false,
      message: "Completar todos los campos",
      case: "cambio de contraseña",
      url: "/relogin",
    });
  const user = await UserModel.findOne({ email: mail });
  if (!user)
    return res.render("sessionAlert", {
      success: false,
      message: "Email no registrado",
      case: "cambio de contraseña",
      url: "/relogin",
    });
  else {
    await UserModel.findOneAndUpdate(
      { email: mail },
      { password: cryptPass(pass) }
    );
    res.render("sessionAlert", {
      success: true,
      message: `${user.nombre} ${user.apellido} has actualizado tu contraseña exitosamente`,
      url: "/login",
      case: "Login",
    });
  }
});

sessionsRouter.get("/logout", (req, res) => {
  req.user = "";
  res.clearCookie(cookieField);
  res.redirect("/login");
});

sessionsRouter.get("/current", passportAutenticate("current"), (req, res) => {
  res.json({ user: req.user });
});

module.exports = sessionsRouter;
