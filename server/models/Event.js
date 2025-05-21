const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  organizerName: String,
  date: Date,
  location: String,
  price: Number,
  ticketLimit: Number,
  ticketsSold: { type: Number, default: 0 },
  image: String,
  approved: { type: Boolean, default: false }
});

module.exports = mongoose.model('Event', eventSchema);
