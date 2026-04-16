const mysql = require('mysql2/promise');
const config = require('../env/mysqlTalentConfig');

const pool = mysql.createPool(config);

module.exports = pool;