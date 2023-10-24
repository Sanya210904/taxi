const db = require('../db');

module.exports = class Order {
  constructor(sum, distance, addressDeparture, addressArrival) {
    this.sum = sum;
    this.distance = distance;
    this.addressDeparture = addressDeparture;
    this.addressArrival = addressArrival;
  }

  static async findAll() {
    return new Promise((resolve) => {
      db.query('select * from OrderDetails', (error, results) => {
        if (!error) {
          resolve(results);
        } else {
          console.log(error);
        }
      });
    });
  }

  static async deleteAll() {
    return new Promise((resolve) => {
      db.query('DELETE FROM OrderDetails', (error, results) => {
        if (!error) {
          resolve(results);
        } else {
          console.log(error);
        }
      });
    });
  }

  static async deleteById(orderId) {
    return new Promise((resolve) => {
      db.query('DELETE FROM OrderDetails WHERE order_id = ?', [orderId], (error, results) => {
        if (!error) {
          resolve(results);
        } else {
          console.log(error);
        }
      });
    });
  }

  static async updateById(orderId, newSum, newDistance, newAddressDeparture, newAddressArrival, newCarId, newCustomerId) {
    return new Promise((resolve) => {
      db.query('UPDATE OrderDetails SET sum = ?, distance = ?, address_departure = ?, address_arrival = ?, car_id = ?, customer_id = ? WHERE order_id = ?', [newSum, newDistance, newAddressDeparture, newAddressArrival, newCarId, newCustomerId, orderId], (error, results) => {
        if (!error) {
          resolve(results);
        } else {
          console.log(error);
        }
      });
    });
  }
  

  static async addOne(
    sum,
    distance,
    address_departure,
    address_arrival,
    carId,
    customerId
  ) {
    return new Promise((resolve) => {
      db.query(
        `INSERT INTO OrderDetails (sum, distance, address_departure, address_arrival, car_id, customer_id)
      VALUES (${sum}, ${distance}, '${address_departure}', '${address_arrival}', ${carId}, ${customerId});
      `,
        (error, results) => {
          if (!error) {
            console.log('setting...')
            db.query(
              `UPDATE Car SET isBusy = 1 WHERE car_id = ${carId};
            `,
              (error, results) => {
                if (!error) {
                  resolve(results);
                } else {
                  console.log(error);
                }
              }
            );
          } else {
            console.log(error);
          }
        }
      );
    });
  }

  
};
