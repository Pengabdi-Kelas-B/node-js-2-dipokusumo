const mongoose = require('mongoose')

const BookStockSchema = new mongoose.Schema({
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
      unique: true
    },
    totalQuantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    availableQuantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    borrowedQuantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  }, {
    timestamps: true
  });

  BookStockSchema.pre('save', function(next) {
    if (this.totalQuantity !== this.availableQuantity + this.borrowedQuantity) {
      next(new Error('Stock quantities mismatch'));
    }
    next();
  });
  
  module.exports = BookStockSchema