const express = require('express');
const router = express.Router();
const {
  getCard,
  getAllCard,
  createCard,
  updateCard,
  deleteCard 
} = require('../controllers/card');

router.route('/').get(getAllCard).post(createCard);
router.route('/:id').get(getCard).patch(updateCard).delete(deleteCard);

module.exports = router;