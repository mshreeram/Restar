const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
    restaurantId: Number,
    restaurantName: String,
    countryCode: Number,
    city: String,
    address: String,
    locality: String,
    localityVerbose: String,
    longitude: Number,
    latitude: Number,
    cuisines: String,
    averageCostForTwo: Number,
    currency: String,
    hasTableBooking: String,
    hasOnlineDelivery: String,
    isDeliveringNow: String,
    switchToOrderMenu: String,
    priceRange: Number,
    aggregateRating: Number,
    ratingColor: String,
    ratingText: String,
    votes: Number,
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
            default: 'Point',
        },
        coordinates: {
            type: [Number],
            required: true,
            default: [0, 0],
        },
    },
});

restaurantSchema.index({ location: '2dsphere' });

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
module.exports = Restaurant;
