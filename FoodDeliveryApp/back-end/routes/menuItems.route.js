const express = require("express");
const router = express.Router();
// const foodItems = require("../models/menuItems.model");
const menuItemsController = require("../controllers/menuItems.controller");

router.get("/", menuItemsController.getAllmenuItems);
router.get("/:id", menuItemsController.getItemById);
router.post("/createFoodItem", menuItemsController.addFoodItem);
router.put("/updateFoodItem/:id", menuItemsController.updateFoodItem);
router.delete("/deleteFoodItem/:id", menuItemsController.deleteFoodItem);

module.exports = router;