const logger = require("../config/logger");

const errorHandler = (err, req, res, next) => {
  logger.error(`${err.message} - ${req.method} ${req.originalUrl}`);

  const statusCode =
    err.status || (res.statusCode === 200 ? 500 : res.statusCode);

  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack || "",
  });
};

module.exports = errorHandler;
