const Deck = require('../models/Deck');
const {StatusCodes} = require('http-status-codes')
const {NotFoundError} = require('../errors');

const getAllDeck = async (req, res) => {
  const { sort } = req.query;
  const {userId} = req.user;
  let queryObject = {createdBy: userId}
  let result = Deck.find(queryObject);
  
  if (sort) {
    const sortList = sort.split(',').join(' ');
    result = result.sort()
  } else {
    result = result.sort('createdAt');
  }
  
  const deck = await result;
  console.log(deck)
  
  res.status(StatusCodes.OK).json({count: deck.length, deck})
}

const createDeck = async (req, res) => {
  const {user:{userId}, body} = req;
  const deck = await Deck.create({...body, createdBy: userId})
  res.status(StatusCodes.CREATED).json(deck);
}

const getDeck = async (req, res) => {
  const {user:{userId}, params:{id: deckId}} = req;
  
  const deck = await Deck.findOne({_id: deckId, createdBy: userId});
  if (!deck) {
    throw new NotFoundError(`there is no deck with an id of: ${deckId}`);
  }
  
  res.status(StatusCodes.OK).json({deck});
}

const updateDeck = async (req, res) => {
  const {user:{userId}, params:{id: deckId}, body} = req;
  
  const deck = await Deck.findOneAndUpdate({_id: deckId, createdBy: userId}, {...body}, {
    runValidators: true,
    new: true
  });
  
  if (!deck) {
    throw new NotFoundError(`there is no deck with an id of: ${deckId}`);
  }
  
  res.status(StatusCodes.OK).json({deck})
}

const deleteDeck = async (req, res) => {
  const {user:{userId}, params:{id:deckId}} = req;
  
  const deck = await Deck.findOneAndDelete({_id: deckId, createdBy: userId});
  
  if (!deck) {
    throw new NotFoundError(`there is no deck with an id of: ${deckId}`);
  }
  
  res.status(StatusCodes.OK).json({deck});
}


module.exports = {
  getDeck,
  getAllDeck,
  createDeck,
  updateDeck,
  deleteDeck
}