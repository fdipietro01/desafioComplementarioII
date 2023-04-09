const config = require("./config/config");
const router = require("./routes/index");
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const handlebars = require("express-handlebars");
const initializePassport = require("./middlewares/passportMiddleware");

const app = express();

//set handlebars view&engine
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use("/aleas", express.static(__dirname + "/public"));

//connect to Mongo
config.dbConection();

//parse Body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//setear session
app.use(session(config.session));

//setear cookies
app.use(cookieParser());

//setting passport
app.use(passport.initialize());
initializePassport();

//setting router
app.use("/", router);

app.listen(process.env.PORT, () => {
  console.log("Servidor corriendo en puerto ", process.env.PORT);
});
