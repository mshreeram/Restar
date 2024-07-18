const express = require("express");
const restaurantListController = require("../controllers/restaurantListController");

const router = express.Router();

router.get("/", restaurantListController.getRestaurantList);

module.exports = router;