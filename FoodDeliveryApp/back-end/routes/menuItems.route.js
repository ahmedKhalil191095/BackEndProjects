const express = require("express");
const router = express.Router();
const menuItemsController = require("../controllers/menuItems.controller");
const { authentecateToken, authorizeRoles } = require("../middleware/authentication");

// Customer access: View menu items and add new items
router.get("/", authentecateToken, authorizeRoles("customer", "admin"), menuItemsController.getAllmenuItems);
router.get("/:id", authentecateToken, authorizeRoles("customer", "admin"), menuItemsController.getItemById);

// Admin only: Update and delete menu items
router.post("/createFoodItem", authentecateToken, authorizeRoles("admin"), menuItemsController.addFoodItem);
router.put("/updateFoodItem/:id", authentecateToken, authorizeRoles("admin"), menuItemsController.updateFoodItem);
router.delete("/deleteFoodItem/:id", authentecateToken, authorizeRoles("admin"), menuItemsController.deleteFoodItem);

module.exports = router;