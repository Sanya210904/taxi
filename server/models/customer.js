const db = require('../db');

module.exports = class Customer {
  constructor(name, surname) {
    this.name = name;
    this.surname = surname;
  }

  static async findAll() {
    return new Promise((resolve) => {
      db.query('select * from Customer', (error, results) => {
        if (!error) {
          resolve(results);
        }
      });
    });
  }

  static async addOne(name, surname) {
    return new Promise((resolve) => {
      db.query(
        `INSERT INTO Customer (name, surname)
      VALUES ('${name}', '${surname}');`,
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
      db.query('DELETE FROM Customer', (error, results) => {
        if (!error) {
          resolve(results);
        } else {
          console.log(error);
        }
      });
    });
  }

  static async deleteById(customerId) {
    return new Promise((resolve) => {
      db.query('DELETE FROM Customer WHERE customer_id = ?', [customerId], (error, results) => {
        if (!error) {
          resolve(results);
        } else {
          console.log(error);
        }
      });
    });
  }

  static async updateById(customerId, newName, newSurname) {
    return new Promise((resolve) => {
      db.query('UPDATE Customer SET name = ?, surname = ? WHERE customer_id = ?', [newName, newSurname, customerId], (error, results) => {
        if (!error) {
          resolve(results);
        } else {
          console.log(error);
        }
      });
    });
  }

  static async addCustomer(name, surname) {
    return new Promise((resolve) => {
      db.query('INSERT INTO Customer (name, surname) VALUES (?, ?)', [name, surname], (error, results) => {
        if (!error) {
          resolve(results.insertId);
        } else {
          console.log(error);
        }
      });
    });
  }
  

  
};
