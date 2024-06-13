const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const url = 'mongodb://localhost:27017';
const dbName = 'countryStateCity';
let db;

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to MongoDB');
    db = client.db(dbName);

    // Routes
    const countryRoutes = require('./routes/countries')(db);
    const stateRoutes = require('./routes/states')(db);
    const cityRoutes = require('./routes/cities')(db);

    app.use('/api/countries', countryRoutes);
    app.use('/api/states', stateRoutes);
    app.use('/api/cities', cityRoutes);

    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch(err => console.error('Could not connect to MongoDB', err));
