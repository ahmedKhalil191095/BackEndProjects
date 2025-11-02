const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const loginService = require("../sevices/login.service");
const authentecateToken = require("../middleware/authentication");
const { validate, validateParams } = require("../middleware/validator");
const { userSignupSchema, userLoginSchema, userUpdateSchema, objectIdSchema } = require("../validators/user.validator");
const { loginLimiter, signupLimiter, authLimiter } = require("../middleware/rateLimiter");

// Public routes with validation and rate limiting
router.post("/signup", signupLimiter, validate(userSignupSchema), userController.createUser);
router.post("/login", loginLimiter, validate(userLoginSchema), loginService.login);
router.post("/refresh", authLimiter, loginService.refreshAccessToken);
router.post("/logout", authLimiter, loginService.logout);

// Protected routes with validation
router.get("/", authentecateToken.authentecateToken, userController.getAllUsers);
router.get("/:id", authentecateToken.authentecateToken, validateParams(objectIdSchema), userController.getUserById);
router.put("/updateUser/:id", authentecateToken.authentecateToken, validateParams(objectIdSchema), validate(userUpdateSchema), userController.updateUser);
router.delete("/deleteUser/:id", authentecateToken.authentecateToken, validateParams(objectIdSchema), userController.deleteUser);

module.exports = router;