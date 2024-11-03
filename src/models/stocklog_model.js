const mongoose = require('mongoose')

const StockLogSchema = new mongoose.Schema({
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true
    },
    bookStockId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BookStock',
      required: true
    },
    action: {
      type: String,
      enum: ['ADD', 'REMOVE', 'BORROW', 'RETURN'],
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    reason: {
      type: String,
      required: true
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    }
  }, {
    timestamps: true
  });
  
  module.exports = StockLogSchema