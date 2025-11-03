const express = require("express");
const router = express.Router();
const { authentecateToken, authorizeRoles } = require("../middleware/authentication");
const { validate, validateParams } = require("../middleware/validator");
const { createRestaurantSchema, updateRestaurantSchema } = require("../validators/restaurant.validator");
const { objectIdSchema } = require("../validators/user.validator");
const restaurantController = require("../controllers/restaurant.controller");

// Public route: Get restaurant details
router.get("/getrestaurantDetails/:id", validateParams(objectIdSchema), restaurantController.getRestaurantDetails);

// Protected routes: Only admin can create/update restaurants
router.post("/createrestaurantDetails", authentecateToken, authorizeRoles("admin"), validate(createRestaurantSchema), restaurantController.addRestaurantDetails);
router.put("/updaterestaurantDetails/:id", authentecateToken, authorizeRoles("admin"), validateParams(objectIdSchema), validate(updateRestaurantSchema), restaurantController.updateRestaurantDetails);

module.exports = router;