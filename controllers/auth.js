const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const {
  BadRequestError,
  UnauthenticatedError
} = require('../errors');

const register = async (req, res) => {
  console.log(req.headers)
  const user = await User.create({...req.body});
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({username: req.body.username, token});
}

const login = async (req, res) => {
  const {email, password} = req.body;
  
  if (!email) {
    throw new BadRequestError('Please provide an Email');
  } else if (!password) {
    throw new BadRequestError('Please provide a Password');
  }
  
  const user = await User.findOne({email});
  if (!user) {
    throw new UnauthenticatedError('Invalid Email');
  }
  
  // comparing the password
  
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new UnauthenticatedError('Invalid Password');
  }
  
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({username: user.username, token});
  
}

module.exports = {
  register,
  login
}