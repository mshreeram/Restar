const express = require('express');
const Restaurant = require('../models/Restaurant');
const app = express();

// Function to handle GET /restaurant/
exports.getRestaurantList = async (req, res) => {
    const userLat = parseFloat(req.query.lat) || 0;
    const userLon = parseFloat(req.query.lon) || 0;
    const maxDistance = parseFloat(req.query.maxDistance) || 30; // Default max distance in km
    const page = parseInt(req.query.page) || 1; // Page number
    const pageSize = parseInt(req.query.pageSize) || 10; // Number of restaurants per page
    const minRating = parseFloat(req.query.minRating) || 0;
    const minCost = parseFloat(req.query.minCost) || 0;
    const maxCost = parseFloat(req.query.maxCost) || Number.MAX_SAFE_INTEGER;
    const countryCode = parseInt(req.query.countryCode) || null;
    const searchString = req.query.searchString;
    const filter = req.query.filter === 'true';
    const search = req.query.search === 'true';

    if (search) {
        console.log(searchString);
        try {
            const searchQuery = {
                $text: { $search: searchString },
                aggregateRating: { $gte: minRating },
                averageCostForTwo: { $gte: minCost, $lte: maxCost },
            };

            if (countryCode) {
                searchQuery.countryCode = countryCode;
            }

            // Perform the search
            let searchResults = await Restaurant.find(searchQuery)
                .skip((page - 1) * pageSize)
                .limit(pageSize);

            return res.json({
                total: searchResults.length,
                msg: "Search Results",
                restaurants: searchResults,
            });
        } catch(e) {
            console.error(e);
            res.status(500).send(e);
            return;
        }
    }
    
    if (filter) {
        try {
            const filterQuery = {
                aggregateRating: { $gte: minRating },
                averageCostForTwo: { $gte: minCost, $lte: maxCost },
            };

            if (countryCode) {
                filterQuery.countryCode = countryCode;
            }

            let filteredRestaurants = await Restaurant.find(filterQuery)
                .skip((page - 1) * pageSize)
                .limit(pageSize);
            
            console.log(filteredRestaurants);
            return res.json({
                total: filteredRestaurants.length,
                msg: "Filtered Restaurants",
                restaurants: filteredRestaurants,
            });
        } catch (e) {
            console.error(e);
            res.status(500).send(e);
            return;
        }
    }

    // const maxDistanceMeters = maxDistance * 1000;
    const skip = (page - 1) * pageSize;

    let isNearBy = false;
    let msg = "";

    try {
        let nearbyRestaurants = await Restaurant.find({
            location: {
                $geoWithin: {
                    $centerSphere: [[userLon, userLat], maxDistance / 6371], // Convert maxDistance to radians
                },
            },
        })
        .skip(skip)
        .limit(pageSize);

        // if there are no more nearby Restaurants
        if (nearbyRestaurants.length === 0) {
            nearbyRestaurants = await Restaurant.find({})
            .skip(skip)
            .limit(pageSize);
            isNearBy = false;
        } else if (userLat === 0 && userLon === 0) {
            isNearBy = false;
        } else {
            isNearBy = true;
        }

        // Calculate distance for each restaurant and add it to the response
        const restaurantsWithDistance = nearbyRestaurants.map(restaurant => {
            const distance = calculateDistance(userLat, userLon, restaurant.latitude, restaurant.longitude);
            return {
                ...restaurant.toObject(),
                distance: distance.toFixed(1) // Round to 1 decimal places
            };
        });

        if (!isNearBy) {
            msg += "Restaurants all over the world!"
        } else {
            msg += "Restaurants within 30km!"
        }

        res.json({
            total: restaurantsWithDistance.length,
            msg: msg,
            restaurants: restaurantsWithDistance,
        });
    } catch (error) {
        res.status(500).send(error);
    }
};

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
}
  
function deg2rad(deg) {
    return deg * (Math.PI / 180);
}