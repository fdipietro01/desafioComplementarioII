const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
require("dotenv").config();

const mongoUrl = process.env.MONGO_URL;
const initDbConnect = async () => {
  try {
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Mongo Conectado");
  } catch (err) {
    console.log(err, "Error al conectar a la db");
  }
};

const config = {
  dbConection: initDbConnect,
  session: {
    store: MongoStore.create({
      mongoUrl: mongoUrl,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 130000000,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUnitialized: false,
  },
};

module.exports = config;
