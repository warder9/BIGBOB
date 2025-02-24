const express = require('express');
const auth = require('../middleware/auth');
const Habit = require('../models/Habit');
const router = express.Router();

// Create a new habit
router.post('/', auth, async (req, res) => {
  try {
    const habit = new Habit({
      ...req.body,
      user: req.user._id, // Associate the habit with the logged-in user
    });
    await habit.save();
    res.status(201).send(habit);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Get all habits for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id });
    res.send(habits);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Get a specific habit by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });
    if (!habit) {
      return res.status(404).send({ error: 'Habit not found' });
    }
    res.send(habit);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Update a specific habit
router.put('/:id', auth, async (req, res) => {
  try {
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id }, // Ensure the habit belongs to the user
      req.body,
      { new: true }
    );
    if (!habit) {
      return res.status(404).send({ error: 'Habit not found' });
    }
    res.send(habit);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Delete a specific habit
router.delete('/:id', auth, async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!habit) {
      return res.status(404).send({ error: 'Habit not found' });
    }
    res.send(habit);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

module.exports = router;