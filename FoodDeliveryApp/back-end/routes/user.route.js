const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const loginService = require("../sevices/login.service");
const authentecateToken = require("../middleware/authentication");



router.get("/", authentecateToken.authentecateToken,userController.getAllUsers);
router.get("/:id", authentecateToken.authentecateToken, userController.getUserById);
// router.post("/createUser", userController.createUser);
router.put("/updateUser/:id", authentecateToken.authentecateToken, userController.updateUser);
router.delete("/deleteUser/:id", authentecateToken.authentecateToken, userController.deleteUser);
router.post("/login", loginService.login);
router.post("/signup", userController.createUser);

module.exports = router;