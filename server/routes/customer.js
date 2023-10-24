const express = require('express');

const customerController = require('../controllers/customerController')

const router = express.Router();

router.get("/", customerController.getCustomers)

router.post("/", customerController.addCustomer)


module.exports = router;