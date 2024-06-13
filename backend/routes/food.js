const express = require('express');
const router = express.Router();
const Food = require('../models/Food');

// Get all food items
router.get('/', async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific food item
router.get('/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    res.json(food);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new food item
router.post('/', async (req, res) => {
  const food = new Food({
    name: req.body.name,
    calories: req.body.calories,
    protein: req.body.protein,
    fat: req.body.fat,
    carbs: req.body.carbs
  });
  try {
    const newFood = await food.save();
    res.status(201).json(newFood);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a food item
router.put('/:id', async (req, res) => {
  try {
    const updatedFood = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedFood);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a food item
router.delete('/:id', async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted food item' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
