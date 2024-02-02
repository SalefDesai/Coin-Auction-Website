
const errorHandlerMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'something went wrong try again later';
  res.status(statusCode).json({ msg: message });
};

export default errorHandlerMiddleware;