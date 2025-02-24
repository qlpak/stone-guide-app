const express = require("express");
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

app.use(errorHandler);

connectDB();

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Stone Guide API" });
});
/* istanbul ignore next */
const PORT = process.env.PORT || 5001;

/* istanbul ignore next */
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
