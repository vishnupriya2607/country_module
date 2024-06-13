const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  name: String,
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'State',
  },
});

const City = mongoose.model('City', citySchema);

module.exports = City;
