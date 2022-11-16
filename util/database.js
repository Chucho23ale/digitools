const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'mysql-digitools.alwaysdata.net',
    user: 'digitools',
    database: 'digitools_v1',
    password: 'Digitools123#',
});

module.exports = pool.promise();