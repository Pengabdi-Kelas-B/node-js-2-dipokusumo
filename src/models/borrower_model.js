const mongoose = require('mongoose')

const BorrowerSchema = new mongoose.Schema({
    membershipId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
      default: 'ACTIVE'
    },
    borrowHistory: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Borrowing'
    }]
  }, {
    timestamps: true
  });
  
  module.exports = BorrowerSchema