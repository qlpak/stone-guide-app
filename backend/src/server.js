const express = require("express");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");
const connectDB = require("./config/database");
const stoneRoutes = require("./routes/stones");
const pricingRoutes = require("./routes/pricing");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const logger = require("./config/logger");
const errorHandler = require("./middlewares/errorMiddleware");
dotenv.config();

const app = express();

app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

app.use("/api/stones", stoneRoutes);
app.use("/api/pricing", pricingRoutes);
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Stone Guide API" });
});

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Stone Guide API",
      version: "1.0.0",
      description: "API for searching, recommending, and pricing natural stone",
    },
    servers: [
      {
        url: "http://localhost:5001",
      },
    ],
  },
  apis: [path.join(__dirname, "./routes/*.js")],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

console.log("Swagger available at: http://localhost:5001/api-docs");

app.use(errorHandler);

connectDB();

/* istanbul ignore next */
const PORT = process.env.PORT || 5001;

/* istanbul ignore next */
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
