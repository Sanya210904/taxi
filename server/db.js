const mysql = require('mysql2');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'taxidb',
  password: 'frontend2109',
});

db.getConnection(() => {
  console.log('Successfully connected to my server');
});

module.exports = db;
