const Restaurant = require("../models/Restaurant");

// Function to handle GET /restaurants/:resId
exports.getRestaurantById = async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ restaurantId: req.params.resId });
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        res.json(restaurant);
    } catch(error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};
