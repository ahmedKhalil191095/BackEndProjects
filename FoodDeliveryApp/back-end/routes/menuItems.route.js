const express = require("express");
const router = express.Router();
const menuItemsController = require("../controllers/menuItems.controller");
const { authentecateToken, authorizeRoles } = require("../middleware/authentication");
const { validate, validateParams } = require("../middleware/validator");
const { createMenuItemSchema, updateMenuItemSchema } = require("../validators/menuItem.validator");
const { objectIdSchema } = require("../validators/user.validator");

// Customer access: View menu items
router.get("/", authentecateToken, authorizeRoles("customer", "admin"), menuItemsController.getAllmenuItems);
router.get("/:id", authentecateToken, authorizeRoles("customer", "admin"), validateParams(objectIdSchema), menuItemsController.getItemById);

// Admin only: Create, update and delete menu items with validation
router.post("/createFoodItem", authentecateToken, authorizeRoles("admin"), validate(createMenuItemSchema), menuItemsController.addFoodItem);
router.put("/updateFoodItem/:id", authentecateToken, authorizeRoles("admin"), validateParams(objectIdSchema), validate(updateMenuItemSchema), menuItemsController.updateFoodItem);
router.delete("/deleteFoodItem/:id", authentecateToken, authorizeRoles("admin"), validateParams(objectIdSchema), menuItemsController.deleteFoodItem);

module.exports = router;