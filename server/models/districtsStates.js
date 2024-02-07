const mongoose = require("mongoose");

const coordinatesSchema = new mongoose.Schema({
    state: String,
    district: String,
    lat: Number,
    lon: Number
});

const districts_states = new mongoose.model('districts_states', coordinatesSchema,'districts_states');

module.exports = districts_states;