// errorMiddleware.js
const ErrorResponse = require("./errorResponce");

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Log the error (you can customize the logging mechanism based on your needs)
  console.error(err.stack);

  // Check if the error is an instance of ErrorResponse
  if (err instanceof ErrorResponse) {
    statusCode = err.statusCode;
    message = err.message;
  }

  res.status(statusCode).json({ error: message });
};

module.exports = errorHandler;
