const express = require('express');
const { ObjectId } = require('mongodb');

module.exports = (db) => {
  const router = express.Router();
  const collection = db.collection('cities');

  // Get all cities
  router.get('/', async (req, res) => {
    try {
      const cities = await collection.find().toArray();
      res.json(cities);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Add a new city
  router.post('/', async (req, res) => {
    try {
      const result = await collection.insertOne(req.body);
      if (result.insertedId) {
        res.json({ _id: result.insertedId, ...req.body });
      } else {
        res.status(500).json({ error: 'Failed to add city' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Update a city
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

  // Delete a city
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 1) {
        res.json({ message: 'City deleted' });
      } else {
        res.status(404).json({ error: 'City not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  router.get('/:stateId', async (req, res) => {
    try {
      const { stateId } = req.params;
      const cities = await db.collection('cities').find({ stateId }).toArray();
      if (!cities.length) {
        return res.status(404).json({ error: 'No cities found for this state' });
      }
      res.json(cities);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch cities' });
    }
  });


  return router;
};
