const { Router } = require("express");
const ProductManager = require("../daos/mongoDaos/ProductManager");
const passportAuthorize = require("../middlewares/passportAuthorize");
const passportAutenticate = require("../middlewares/passportAutenticate");

const routerProductos = Router();
const productHandler = new ProductManager();
const port = process.env.PORT;

routerProductos.get("/", async (req, res) => {
  const { limit, page, sort, category, status } = req.query;
  try {
    const productsData = await productHandler.getProducts(
      limit,
      page,
      sort,
      category,
      status
    );
    res.send(productsData);
  } catch (err) {
    console.log(err.message);
    res.status(400).send(err);
  }
});

routerProductos.post(
  "/",
  passportAutenticate("current"),
  passportAuthorize("admin"),
  async (req, res) => {
    const producto = req.body;
    if (req.body.status === undefined) req.body.status = true;
    try {
      await productHandler.addProduct(producto);
      res
        .status(200)
        .json({ redirectUrl: `http://localhost:${port}/productos/` });
    } catch (err) {
      res.status(400).json({
        redirectUrl: `http://localhost:${port}/alerts`,
        message: err.message,
      });
    }
  }
);

routerProductos.put("/:pid", passportAuthorize("admin"), async (req, res) => {
  const { pid } = req.params;
  const newProd = req.body;
  if (req.body.status === undefined) req.body.status = true;
  if (Object.keys(newProd).length === 0)
    return res.status(400).send("Enviar producto a actualizar");
  try {
    +(await productHandler.updateProduct(pid, newProd));
    res.status(200).json({ actualizado: "success" });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

routerProductos.delete(
  "/:pid",
  passportAuthorize("admin"),
  async (req, res) => {
    const { pid } = req.params;
    try {
      const deleted = await productHandler.deleteProduct(pid);
      if (deleted !== 0)
        res
          .status(200)
          .json({ redirectUrl: `http://localhost:${port}/productos` });
      else
        res.status(400).json({
          redirectUrl: `http://localhost:${port}/alerts`,
          message: "Error al eliminar producto",
        });
    } catch (err) {
      console.log(err.message);
      res.status(400).json({
        redirectUrl: `http://localhost:${port}/alerts`,
        message: "Error al eliminar producto",
      });
    }
  }
);

module.exports = routerProductos;
