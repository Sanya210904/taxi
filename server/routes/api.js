const express = require("express");

const orderRoute = require("./order")
const carRoute = require("./car")
const customerRoute = require("./customer")

const app = express();

app.get("/", (req, res) => {
    res.status(200).send('Taxi program API is OK')
})

app.use("/order", orderRoute)
app.use("/car", carRoute)
app.use("/customer", customerRoute)


module.exports = app;