const express = require('express');
const { ObjectId } = require('mongodb');

module.exports = (db) => {
  const router = express.Router();
  const collection = db.collection('countries');

  // Get all countries
  router.get('/', async (req, res) => {
    try {
      const countries = await db.collection('countries').find().toArray();
      res.json(countries);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch countries' });
    }
  });
  // Add a new country
  router.post('/', async (req, res) => {
    try {
      const result = await collection.insertOne(req.body);
      if (result.insertedId) {
        res.json({ _id: result.insertedId, ...req.body });
      } else {
        res.status(500).json({ error: 'Failed to add country' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Update a country
  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: req.body },
        { returnDocument: 'after' }  // Use returnDocument: 'after' to get the updated document
      );
      if (result.value) {
        res.json(result.value);
      } else {
        res.status(404).json({ error: 'Country not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Delete a country
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 1) {
        res.json({ message: 'Country deleted' });
      } else {
        res.status(404).json({ error: 'Country not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
