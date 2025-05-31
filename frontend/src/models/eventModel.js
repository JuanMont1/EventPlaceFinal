const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  nombre: String,
  categoria: String,
  imagen: String,
  fecha: Date,
  facultad: String
});

module.exports = mongoose.model('Event', eventSchema);