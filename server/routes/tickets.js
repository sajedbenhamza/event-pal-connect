const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');

// Get all tickets for a user
router.get('/user/:userId', async (req, res) => {
  const tickets = await Ticket.find({ userId: req.params.userId });
  res.json(tickets);
});

// Purchase ticket
router.post('/', async (req, res) => {
  try {
    const ticket = new Ticket(req.body);
    await ticket.save();
    res.status(201).json(ticket);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Mark ticket as used
router.put('/:id/use', async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, { isUsed: true }, { new: true });
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
    res.json(ticket);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
