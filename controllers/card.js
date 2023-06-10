const Card = require('../models/Card');
const StatusCodes = require('http-status-codes');
const {NotFoundError, BadRequestError} = require('../errors');

const getCard = async (req, res) => {
  const {user: {userId}, params: {id}} = req;
  const [deckId, cardId] = id.split(',');
  const card = await Card.findOne({createdBy: userId, deck: deckId, _id: cardId});
  
  if (!card) {
    throw new NotFoundError(`there is no card with an Id of: ${cardId}`);
  }
  
  res.status(StatusCodes.OK).json({card});
}

const getAllCard = async (req, res) => {
  const {sort} = req.query;
  const {user: {userId}, headers: {deckid: deckId}} = req;
  const result = Card.find({createdBy: userId, deck: deckId})
  
  if (sort) {
    const sortList = sort.split(',').join(' ');
    result.sort(sortList);
  } else {
    result.sort('createdAt');
  }
  
  const cards = await result;
  
  res.status(StatusCodes.OK).json({count: cards.length, cards});
}

const createCard = async (req, res) => {
  const {user: {userId}, body} = req;
  const card = await Card.create({...body, createdBy: userId});
  res.status(StatusCodes.CREATED).json({card});
}


const updateCard = async (req, res) => {
  const {user: {userId}, params: {id:cardId}, body: {deck:deckId}, body} = req;
  
  const count = await Card.countDocuments({cardname: body.cardname, createdBy: userId, deck: deckId});
  
  if (count > 0) {
    throw new BadRequestError('cardname already in use')
  }
  
  const card = await Card.findByIdAndUpdate({createdBy: userId, _id: cardId, deck: deckId}, {...body}, {
    runValidators: true,
    context: 'query',
    new: true
  });
  
  if (!card) {
    throw new NotFoundError(`there is no card with an Id of: ${cardId}`);
  }
  
  res.status(StatusCodes.OK).json({card});
}

const deleteCard = async (req, res) => {
  const {user: {userId}, params: {id}} = req;
  const [deckId, cardId] = id.split(',');
  
  const card = await Card.findOneAndDelete({createdBy: userId, deck: deckId, _id: cardId});
  
  if (!card) {
    throw new NotFoundError(`there is no card with an Id of: ${cardId}`);
  }
  
  res.status(StatusCodes.OK).json({card});
}

module.exports = {
  getCard,
  getAllCard,
  createCard,
  updateCard,
  deleteCard
}