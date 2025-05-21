const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Get all events
router.get('/', async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

// Get event by ID
router.get('/:id', async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ error: 'Event not found' });
  res.json(event);
});

// Create event
router.post('/', async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update event
router.put('/:id', async (req, res) => {
  try {
    // Ensure only allowed fields are updated
    const update = { ...req.body };
    // If approved is present, force Boolean
    if (Object.prototype.hasOwnProperty.call(update, 'approved')) {
      // Accept both true/false, 'true'/'false', 1/0, '1'/'0'
      if (update.approved === true || update.approved === 'true' || update.approved === 1 || update.approved === '1') {
        update.approved = true;
      } else if (update.approved === false || update.approved === 'false' || update.approved === 0 || update.approved === '0') {
        update.approved = false;
      } else {
        // fallback: force Boolean
        update.approved = Boolean(update.approved);
      }
    }
    // Closing brace added here
    console.log('Updating event:', req.params.id, update); // Log the update payload
    const event = await Event.findByIdAndUpdate(req.params.id, update, { new: true });
    console.log('Updated event result:', event); // Log the result
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete event
router.delete('/:id', async (req, res) => {
  try {
    // Normalize id: if it's a 24-char hex string, treat as _id, else try to find by id field
    const id = req.params.id;
    let event = null;
    if (/^[a-fA-F0-9]{24}$/.test(id)) {
      event = await Event.findById(id);
    }
    if (!event) {
      // Try to find by alternate field if needed (e.g., if id is passed as 'id' instead of '_id')
      event = await Event.findOne({ id });
    }
    if (!event) {
      console.log('Event not found for delete:', id);
      return res.status(404).json({ error: 'Event not found' });
    }
    await Event.deleteOne({ _id: event._id });
    console.log('Event deleted:', event);
    res.json({ message: 'Event deleted' });
  } catch (err) {
    console.error('Delete event error:', err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
