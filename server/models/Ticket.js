const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  purchaseDate: { type: Date, default: Date.now },
  qrCode: String,
  isUsed: { type: Boolean, default: false }
});

module.exports = mongoose.model('Ticket', ticketSchema);
