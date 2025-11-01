const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const loginService = require("../sevices/login.service");
const authentecateToken = require("../middleware/authentication");
const { validate, validateParams } = require("../middleware/validator");
const { userSignupSchema, userLoginSchema, userUpdateSchema, objectIdSchema } = require("../validators/user.validator");

// Public routes with validation
router.post("/signup", validate(userSignupSchema), userController.createUser);
router.post("/login", validate(userLoginSchema), loginService.login);

// Protected routes with validation
router.get("/", authentecateToken.authentecateToken, userController.getAllUsers);
router.get("/:id", authentecateToken.authentecateToken, validateParams(objectIdSchema), userController.getUserById);
router.put("/updateUser/:id", authentecateToken.authentecateToken, validateParams(objectIdSchema), validate(userUpdateSchema), userController.updateUser);
router.delete("/deleteUser/:id", authentecateToken.authentecateToken, validateParams(objectIdSchema), userController.deleteUser);

module.exports = router;