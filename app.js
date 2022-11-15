const express = require("express");
const app = express();
const sequelize = require("./config/dataBase");
const router = require ('./router/router')
const user = require("./entity/user");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

sequelize.sync({ alter: true }).then(function () {
  console.log("database conected..");
});

async function run() {
  try {
    await sequelize.authenticate();
    app.use('/',router)
    console.log("Connection has been established successfully.");
    app.listen(process.env.port, () => {
      console.log(`server started on :${process.env.port}`);
    });
  } catch (error) {
    console.log(error.massage);
  }
}

run();
