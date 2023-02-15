const express = require("express");

const app = express();

const port = process.env.PORT || 8080;

const urlShortener = require("./src/routes/urlShortener.route");

const path = require("path");

const swaggerUI = require("swagger-ui-express");

const swaggerJsDoc = require("swagger-jsdoc");

const doc = require("./swagger.json");

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use("/doc", swaggerUI.serve, swaggerUI.setup(doc));
app.use("/", urlShortener);

app.listen(port, () => {
  console.log(`App online en puerto: ${port}`);
});

app.on("error", (error) => {
  console.error(error);
});