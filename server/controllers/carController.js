const Car = require('../models/car');

async function getCars(req, res) {
  try {
    const result = await Car.findAll();
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

async function setFreeCar(req, res) {
  const { carId } = req.body;
  try {
    const result = await Car.setFreeCar(carId);
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

async function getFreeCars(req, res) {
  const { carClass } = req.query;
  try {
    const result = await Car.findByBusy(carClass);
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
  getCars,
  getFreeCars,
  setFreeCar
};
