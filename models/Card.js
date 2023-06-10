
const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  cardname: {
    type: String,
    required: [true, 'Please provide a cardname'],
    validate: {
      validator: uniquenessValidator,
      message: 'cardname already exists'
    }
  },
  definition: {
    type: Array,
    validate: {
      validator: function(arr) {
        return arr.length >= 1
      },
      message: 'Please provide a definition'
    },
    required: [true, 'Please provide a definition']
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
    required: [true, 'Please provide a user']
  },
  deck: {
    type: mongoose.Types.ObjectId,
    ref: 'deck',
    required: [true, 'Please provide a deck']
  },
  mastery: {
    type: Number,
    default: 0
  }
}, {timestamps: true});



async function uniquenessValidator() {
  const Card = mongoose.model('card');
  const count = await Card.countDocuments({cardname:this.cardname, createdBy: this.createdBy, deck: this.deck});
  if (count === 0) {
    return true;
  } else {
    return false;
  }
}

// function uniquenessValidator() {
//   const Card = mongoose.model('card');
//   console.log(this.cardname)
//   return Card.countDocuments({ cardname: this.cardname, createdBy: this.createdBy })
//     .then((count) => {
//       if (count === 0) {
//         return true;
//       } else {
//         return false;
//       }
//     });
// }

module.exports = mongoose.model('card', cardSchema);
