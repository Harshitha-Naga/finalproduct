const express = require("express");
const ApiRoutes = express.Router();
const location = require("../controller/LocationController");
const restaurant = require("../controller/RestaurantController");
const mealType = require("../controller/MealTypeController");
const {
  genOrderDetails,
  verifyPayment,
} = require("../controller/PaymentController");
//home base
ApiRoutes.get("/api", location.home);

//getLocationList
ApiRoutes.get("/api/get-location-list", location.getLocationList);

//getRestaurantListByLocationId
ApiRoutes.get(
  "/api/get-restaurant-list-by-location-id/:loc_id",
  restaurant.getRestaurantListByLocationId
);

//getRestaurantDetailsByRestaurantId
ApiRoutes.get(
  "/api/get-restaurant-details-by-restaurant-id/:id",
  restaurant.getRestaurantDetailsByRestaurantId
);

//getMenuItemsByRestaurantId
ApiRoutes.get(
  "/api/get-menu-items-by-restaurant-id/:r_id",
  restaurant.getMenuItemsByRestaurantId
);

//getMealTypeList
ApiRoutes.get("/api/get-meal-type-list", mealType.getMealTypeList);

//post - filter
ApiRoutes.post("/api/filter", restaurant.filter);

//payment
ApiRoutes.post("/api/gen-order-details", genOrderDetails);

//verifying payment
ApiRoutes.post("/api/verify-payment", verifyPayment);

module.exports = ApiRoutes;
