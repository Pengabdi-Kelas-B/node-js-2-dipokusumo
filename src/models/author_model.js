const mongoose = require('mongoose')

const AuthorSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    bio: {
      type: String,
      required: true
    },
    birthDate: {
      type: Date,
      required: true
    },
    photoUrl: {
      type: String,
      default: null
    },
    books: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book'
    }]
  }, {
    timestamps: true
  });

  module.exports = AuthorSchema