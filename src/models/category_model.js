const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    }
  }, {
    timestamps: true
  });

  module.exports = CategorySchema