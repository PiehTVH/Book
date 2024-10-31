require("dotenv").config();
const express = require("express");
const routes = require("./api/routes");
const sequelize = require("./config/db/database");
const { connectRedis } = require("./config/db/redisClient");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const cookieParser = require("cookie-parser");
const app = express();
const port = process.env.PORT || 8000;
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Express API with Swagger",
    version: "1.0.0",
  },
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};
const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: [
    "./src/api/routes/*.js",
    "./src/api/models/*.js",
    "./src/api/validations/*.js",
  ],
};
const swaggerSpec = swaggerJsdoc(options);

// Initiate Redis connection
connectRedis();
sequelize
  .sync()
  .then(() => {
    console.log("Database connected and models synced.");
  })
  .catch((error) => {
    console.error("Failed to sync database:", error);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", routes);
app.use(cookieParser());

app.listen(port, () => {
  console.log(`Example app listening on: http://localhost:${port}`);
});
