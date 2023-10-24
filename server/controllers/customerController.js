const Customer = require('../models/customer');

async function getCustomers(req, res) {
  try {
    const result = await Customer.findAll();
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

async function addCustomer(req, res) {
  const { name, surname } = req.body;
  try {
    const result = await Customer.addOne(name, surname);
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

async function deleteCustomerById(req, res) {
  const customerId = req.params.id;

  try {
    await Customer.deleteById(customerId);
    return res.status(200).json({
      message: 'Customer deleted successfully',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: {
        statusCode: 500,
        message: 'Server error',
      },
    });
  }
}

async function updateCustomerById(req, res) {
  const customerId = req.params.id;
  const { name, surname } = req.body;

  try {
    await Customer.updateById(customerId, name, surname);
    return res.status(200).json({
      message: 'Customer updated successfully',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: {
        statusCode: 500,
        message: 'Server error',
      },
    });
  }
}

module.exports = {
  getCustomers,
  addCustomer,
  updateCustomerById,
  deleteCustomerById
};
