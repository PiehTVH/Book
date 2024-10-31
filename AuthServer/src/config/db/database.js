const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql", // or 'mysql', 'sqlite', 'mariadb', 'mssql'
    // additional config options can go here
    logging: console.log,
  }
);

module.exports = sequelize;
