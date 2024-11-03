const mongoose = require('mongoose')

const BookSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    isbn: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    coverUrl: {
      type: String,
      default: null
    },
    totalPages: {
      type: Number,
      required: true,
      min: 1
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Author',
      required: true
    },
    publishedDate: {
      type: Date,
      required: true
    },
    publisher: {
      type: String,
      required: true
    },
    language: {
      type: String,
      required: true,
      trim: true
    }
  }, {
    timestamps: true
  });

  module.exports = BookSchema