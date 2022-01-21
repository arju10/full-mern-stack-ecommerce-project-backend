const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error";

  if (process.env.NODE_ENV === "DEVELOPMENT") {
    // Wrong mongoose ID
    if (err.name === "castError") {
      const message = `Resources not found. Invalid : ${err.path}`;

      err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
      success: false,
      error: err,
      errMessage: err.message,
      stack: err.stack,
    });
  }

  if (process.env.NODE_ENV === "PRODUCTION") {
    error = { ...err };
    error.message = err.message;

    // Wrong mongoose ID
    if (err.name === "CastError") {
      const message = `Resources not found. Invalid : ${err.path}`;

      error = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
      success: false,
      error: error.message || "Internal Server Error!",
    });
  }
};
