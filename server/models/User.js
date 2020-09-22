const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoriteSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  recipeId: {
    type: String,
    required: true
  }
});

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  recipes: [{
    type: Schema.Types.ObjectId,
    ref: 'Recipe'
  }],
  favorites: [favoriteSchema]
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;