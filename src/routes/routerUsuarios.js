const { Router } = require("express");
const userModel = require("../models/userSchema");
const passportAutenticate = require("../middlewares/passportAutenticate");
const autorization = require("../middlewares/passportAuthorize");

const routerUsuarios = Router();

routerUsuarios.get(
  "/",
  passportAutenticate("current"),
  autorization("admin"),
  async (req, res) => {
    const usuarios = await userModel.find({}).lean();
    //const { page = 1 } = req.query;
    //const usuarios = await userModel.paginate({}, { limit: 1, page, lean: true }); // variante con paginado
    res.status(200).send({ usuarios });
  }
);

module.exports = routerUsuarios;
