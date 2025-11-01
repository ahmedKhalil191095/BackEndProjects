const express = require("express");
const router = express.Router();
const { authentecateToken, authorizeRoles } = require("../middleware/authentication");
const { validate, validateParams } = require("../middleware/validator");
const { createRestaurantSchema, updateRestaurantSchema } = require("../validators/resturant.validator");
const { objectIdSchema } = require("../validators/user.validator");
const resturentController = require("../controllers/resturant.controller");

// Public route: Get restaurant details
router.get("/getResturantDetails/:id", validateParams(objectIdSchema), resturentController.getResturantDetails);

// Protected routes: Only admin can create/update restaurants
router.post("/createResturantDetails", authentecateToken, authorizeRoles("admin"), validate(createRestaurantSchema), resturentController.addResturantDetails);
router.put("/updateResturantDetails/:id", authentecateToken, authorizeRoles("admin"), validateParams(objectIdSchema), validate(updateRestaurantSchema), resturentController.updateResturantDetails);

module.exports = router;