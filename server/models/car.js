const db = require('../db');

module.exports = class Car {
  constructor(model, brand, carClass, isBusy) {
    this.model = model;
    this.brand = brand;
    this.carClass = carClass;
    this.isBusy = isBusy;
  }

  static async findAll() {
    return new Promise((resolve) => {
      db.query('select * from Car', (error, results) => {
        if (!error) {
          resolve(results);
        } else {
          console.log(error);
        }
      });
    });
  }

  static async findByBusy(carClass) {
    return new Promise((resolve) => {
      db.query(
        `select * from Car where Car.isBusy = 0 AND class = '${carClass}';`,
        (error, results) => {
          if (!error) {
            resolve(results);
          } else {
            console.log(error);
          }
        }
      );
    });
  }

  static async setFreeCar(carId) {
    return new Promise((resolve) => {
      db.query(
        `UPDATE Car
        SET isBusy = NOT isBusy
        WHERE car_id = ${carId};
        `,
        (error, results) => {
          if (!error) {
            resolve(results);
          } else {
            console.log(error);
          }
        }
      );
    });
  }

  static async deleteAll() {
    return new Promise((resolve) => {
      db.query('DELETE FROM Car', (error, results) => {
        if (!error) {
          resolve(results);
        } else {
          console.log(error);
        }
      });
    });
  }
  
  static async deleteById(carId) {
    return new Promise((resolve) => {
      db.query('DELETE FROM Car WHERE car_id = ?', [carId], (error, results) => {
        if (!error) {
          resolve(results);
        } else {
          console.log(error);
        }
      });
    });
  }

  static async updateById(carId, newModel, newBrand, newSeatPlace, newClass, newIsBusy) {
    return new Promise((resolve) => {
      db.query('UPDATE Car SET model = ?, brand = ?, seatPlace = ?, class = ?, isBusy = ? WHERE car_id = ?', [newModel, newBrand, newSeatPlace, newClass, newIsBusy, carId], (error, results) => {
        if (!error) {
          resolve(results);
        } else {
          console.log(error);
        }
      });
    });
  }
  

  static async addCar(model, brand, seatPlace, carClass) {
    return new Promise((resolve) => {
      db.query('INSERT INTO Car (model, brand, seatPlace, class, isBusy) VALUES (?, ?, ?, ?, 0)', [model, brand, seatPlace, carClass], (error, results) => {
        if (!error) {
          resolve(results.insertId);
        } else {
          console.log(error);
        }
      });
    });
  }

  static isCar(carName) {
    let result = false;
    let carList = this.findAll();

    const carListLength = carList.length;

    if (carListLength >= 0) {
      for (let i = 0; i < carListLength; i++) {
          if (carList[i] === carName) {
            result = true;
            break;
          }
      }
    }

    return result;
  }

  getCarClassCoefficient = (carClass) => {
    let carClassCoefficient;
  
    switch (carClass) {
      case "Standart":
        carClassCoefficient = 1;
        break;
      case "Comfort":
        carClassCoefficient = 1.2;
        break;
      case "Business":
        carClassCoefficient = 1.5;
        break;
      default:
        carClassCoefficient = 1;
        break;
    }
  
    return carClassCoefficient;
  }
  
  
};
