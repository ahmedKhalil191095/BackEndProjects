const express = require("express");
const router = express.Router();

const resturent = require("../models/resturant.model");
const resturentController = require("../controllers/resturant.controller");

router.post("/createResturantDetails", resturentController.addResturantDetails);
router.put("/updateResturantDetails/:id", resturentController.updateResturantDetails);
router.get("/getResturantDetails/:id", resturentController.getResturantDetails);   

module.exports = router;