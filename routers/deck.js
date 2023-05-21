const express = require('express');
const router = express.Router();
const {
  getDeck,
  getAllDeck,
  createDeck,
  updateDeck,
  deleteDeck
} = require('../controllers/deck');

router.route('/').get(getAllDeck).post(createDeck);
router.route('/:id').patch(updateDeck).delete(deleteDeck).get(getDeck);

module.exports = router;