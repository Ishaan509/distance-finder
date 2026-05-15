const mongoose = require("mongoose");

const geoHashSchema = new mongoose.Schema({
    state: {
        type: String
    },
    district: {
        type: String
    },
    location: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates:{
            type:[Number]
        }
    }
});

const geoSpatial_district_states = new mongoose.model('geoSpatial_district_states', geoHashSchema, 'geoSpatial_district_states');

module.exports = geoSpatial_district_states;