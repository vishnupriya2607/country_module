const express = require('express');
const { ObjectId } = require('mongodb');

module.exports = (db) => {
  const router = express.Router();
  const collection = db.collection('states');

  // Get all states
  router.get('/', async (req, res) => {
    try {
      const states = await collection.find().toArray();
      res.json(states);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Add a new state
  router.post('/', async (req, res) => {
    try {
      const result = await collection.insertOne(req.body);
      if (result.insertedId) {
        res.json({ _id: result.insertedId, ...req.body });
      } else {
        res.status(500).json({ error: 'Failed to add state' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Update a state
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

  // Delete a state
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 1) {
        res.json({ message: 'State deleted' });
      } else {
        res.status(404).json({ error: 'State not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  router.get('/:countryId', async (req, res) => {
    try {
      const { countryId } = req.params;
      const states = await db.collection('states').find({ countryId }).toArray();
      if (!states.length) {
        return res.status(404).json({ error: 'No states found for this country' });
      }
      res.json(states);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch states' });
    }
  });

  return router;
};
