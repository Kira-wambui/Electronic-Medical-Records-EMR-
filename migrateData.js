const mysql = require('mysql2');
const { legacyDbConfig, newDbConfig } = require('./dbConfig');
const legacyDb = mysql.createConnection(legacyDbConfig);
const newDb = mysql.createConnection(newDbConfig);

legacyDb.connect(err => {
    if (err) throw err;
    console.log('Connected to legacy database...');
});

newDb.connect(err => {
    if (err) throw err;
    console.log('Connected to new database...');
});

const migrateData = () => {
    legacyDb.query('SELECT * FROM old_patients', (err, results) => {
        if (err) throw err;
        results.forEach(patient => {
            const query = `INSERT INTO Patients (FirstName, LastName, DateOfBirth, Gender, ContactInfo)
                           VALUES (?, ?, ?, ?, ?)`;
            newDb.query(query, [patient.firstName, patient.lastName, patient.dob, patient.gender, patient.contact], (err, res) => {
                if (err) throw err;
            });
        });
    });
};

migrateData();
