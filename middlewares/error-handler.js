const {StatusCodes} = require('http-status-codes');

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);
  let customError = {
    message: err.message || 'Something went wrong ',
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
  }
  
  if (err.name === 'ValidationError') {
    const msg = Object.values(err.errors).map(item => item.message).join(',');
    customError.message = `${msg},V`;
    customError.statusCode = 400;
  }
  
  if (err.code && err.code === 11000) {
    //customError.message = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please provide another value`
    customError.message = `${Object.keys(err.keyValue)} has already been taken`
    customError.statusCode = 400;
  }
  
  if (err.name === 'CastError') {
    customError.message = `no item was found with an id of: ${err.value}`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }
  
  //res.send(err)
  res.status(customError.statusCode).json({message: customError.message});
}

module.exports = errorHandlerMiddleware;