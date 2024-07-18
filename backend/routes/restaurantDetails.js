const express = require("express");
const restaurantController = require("../controllers/restaurantController");

const router = express.Router();

router.get("/:resId", restaurantController.getRestaurantById);

module.exports = router;