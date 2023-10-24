const Order = require('../models/order');

async function getOrders(req, res) {
  try {
    const result = await Order.findAll();
    return res.status(200).json({
      data: result,
    });
  } catch (e) {
    return res.status(500).json({
      error: {
        statusCode: 500,
        message: 'Server error',
      },
    });
  }
}

async function addOrder(req, res) {
  const { sum, distance, addressDeparture, addressArrival, customerId, carId } =
    req.body;
  try {
    const result = await Order.addOne(
      sum,
      distance,
      addressDeparture,
      addressArrival,
      carId,
      customerId,
    );
    return res.status(200).json({
      data: result,
    });
  } catch (e) {
    return res.status(500).json({
      error: {
        statusCode: 500,
        message: 'Server error',
      },
    });
  }
}

module.exports = {
  getOrders,
  addOrder,
};
