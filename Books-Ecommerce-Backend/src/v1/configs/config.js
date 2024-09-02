"use strict";

const development = {
  app: {
    port: process.env.DEV_APP_PORT || 3055,
    session_key: process.env.DEV_SESSION_KEY_SECRET,
    session_name: process.env.DEV_SESSION_NAME,
    session_db: process.env.DEV_SESSION_DB_NAME,
  },

  db: {
    host: process.env.DEV_DB_HOST || "localhost",
    username: process.env.DEV_DB_USERNAME || "hiep",
    password: process.env.DEV_DB_PASSWORD || "hiep",
  },

  mysql_db_1: {
    alias: process.env.MYSQL_DB_ALIAS_MASTER || "mydb",
  },
};

const config = { development };
const env = process.env.NODE_ENV || "dev";

console.log(`Running on Environment::${env} \n`, config[env]);
module.exports = config[env];
