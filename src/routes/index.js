const { Router } = require("express");
const routerUsuarios = require("./routerUsuarios");
const routerProductos = require("./routerProductos");
const sessionsRouter = require("./sessionsRouter");
const viewsRouter = require("./views");

const port = process.env.PORT;

const router = Router();

router.use("/", viewsRouter);
router.use("/usuarios", routerUsuarios);
router.use("/sessions", sessionsRouter);
router.use("/api/productos", routerProductos);
router.use("/alerts/:message", (req, res) => {
  const { message } = req.params;
  res.render("alert", { message, port });
});

module.exports = router;
