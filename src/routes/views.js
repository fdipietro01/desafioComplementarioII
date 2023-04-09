const { Router } = require("express");
const isLogged = require("../middlewares/isAlreadyLogged");
const passportAutenticate = require("../middlewares/passportAutenticate");
const passportAuthorize = require("../middlewares/passportAuthorize");
const viewsRouter = Router();

const ProductManager = require("../daos/mongoDaos/ProductManager");
const productHandler = new ProductManager();

//vista de login
viewsRouter.get("/login", isLogged("current"), (req, res) => {
  res.render("login");
});

//vista para refrescar credenciales en caso de olvido
viewsRouter.get("/relogin", isLogged("current"), async (req, res) => {
  res.render("relogin");
});

//vista de registro
viewsRouter.get("/register", isLogged("current"), async (req, res) => {
  res.render("register");
});

//vista de home/default (vista de productos)
viewsRouter.get("/home", isLogged("current", true), async (req, res) => {
  try {
    const isLogged = req.user;
    const isAdmin = req.user?.role === "admin" ? true : false;
    const {
      payload,
      page,
      totalPages,
      hasNextPage,
      hasPrevPage,
      prevLink,
      nextLink,
    } = await productHandler.getProducts();
    const dataExist = payload.length;
    res.render("home", {
      isLogged,
      isAdmin,
      payload,
      dataExist,
      hasNextPage,
      hasPrevPage,
      prevLink,
      nextLink,
      page,
      totalPages,
    });
  } catch (err) {
    res.send({ error: err.message });
  }
});

//vista de todos los carrito para usuario (para crear o buscar existente)
viewsRouter.get("/carrito", passportAutenticate("current"), (req, res) => {
  console.log("carts");
  res.render("homeCarritos");
});

//vista de carrito fitlrado por id
viewsRouter.get(
  "/carts/:cid",
  passportAutenticate("current"),
  async (req, res) => {
    const { cid } = req.params;
    try {
      const cartProducts = await cartHandler.getProductsfromCart(cid);
      const { payload: catalogProducts } = await productHandler.getProducts();
      const cartExist = cartProducts.length;
      const catalogExists = catalogProducts.length;
      res.render("editCarritos", {
        cartProducts,
        catalogProducts,
        cartExist,
        catalogExists,
        id: cid,
      });
    } catch (err) {
      res.send({ error: err.message });
    }
  }
);

//vista de administrador para ver y editar catalogo de productos
viewsRouter.get(
  "/productos",
  passportAutenticate("current"),
  passportAuthorize("admin"),
  async (req, res) => {
    try {
      const {
        payload,
        page,
        totalPages,
        hasNextPage,
        hasPrevPage,
        prevLink,
        nextLink,
      } = await productHandler.getProducts();
      const dataExist = payload.length;
      const { nombre, apellido } = req.user;
      res.render("editProductos", {
        nombre,
        apellido,
        payload,
        dataExist,
        hasNextPage,
        hasPrevPage,
        prevLink,
        nextLink,
        page,
        totalPages,
      });
    } catch (err) {
      res.send({ error: err.message });
    }
  }
);
module.exports = viewsRouter;
