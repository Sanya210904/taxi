const express = require('express');

const carController = require('../controllers/carController')

const router = express.Router();

router.get("/", carController.getCars)

router.get("/free", carController.getFreeCars);

router.post("/free", carController.setFreeCar);


module.exports = router;