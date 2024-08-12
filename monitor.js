const mysql = require('mysql2');
const db = mysql.createConnection(require('./dbConfig').newDbConfig);

db.connect(err => {
    if (err) throw err;
    console.log('Database connected...');
});

// Function to monitor database performance
const monitorDatabase = () => {
    const query = `
        SHOW GLOBAL STATUS WHERE Variable_name IN ('Threads_connected', 'Questions', 'Slow_queries', 'Uptime');
    `;

    db.query(query, (err, results) => {
        if (err) throw err;
        console.log('Database Performance:');
        results.forEach(row => {
            console.log(`${row.Variable_name}: ${row.Value}`);
        });
    });
};

// Schedule the monitoring function to run every minute
setInterval(monitorDatabase, 60000);
