const mongoose = require('mongoose');

const deckSchema = new mongoose.Schema({
  deckname: {
    type: String,
    // maxlength: [12, 'deckname must be less than 13 characters'],
    required: [true, 'Please provide a deckname'],
    validate: {
      validator: uniquenessValidator,
      message: 'deckname already exists'
    }
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
    required: [true, 'Please provide a user']
  },
  description: {
    type: String,
    default: '...',
    // maxlength: [25, 'description must be less than 26 characters']
  }
}, {timestamps: true});

async function uniquenessValidator() {
  const Deck = mongoose.model('deck');
  const count = await Deck.countDocuments({deckname:this.deckname, createdBy: this.createdBy});
  if (count === 0) {
    return true;
  } else {
    return false;
  }
}

module.exports = mongoose.model('deck', deckSchema);