const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("task5", "root", "root", {
  host: "localhost",
  port: 3306,
  dialect: "mysql",

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 1000,
  },
  logging: false,
});
module.exports = sequelize;
