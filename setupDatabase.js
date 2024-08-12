const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: '127.0.0.1', // Use IPv4 address
    user: 'root',
    password: 'your_new_password' // Replace with your MariaDB root password
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting:', err.stack);
        return;
    }
    console.log('Connected to MySQL server');

    const createDatabaseAndTables = `
        CREATE DATABASE IF NOT EXISTS emr_system;
        USE emr_system;

        CREATE TABLE IF NOT EXISTS Patients (
            PatientID INT PRIMARY KEY AUTO_INCREMENT,
            FirstName VARCHAR(50) NOT NULL,
            LastName VARCHAR(50) NOT NULL,
            DateOfBirth DATE NOT NULL,
            Gender ENUM('Male', 'Female', 'Other') NOT NULL,
            ContactInfo VARCHAR(100) NOT NULL,
            CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS Appointments (
            AppointmentID INT PRIMARY KEY AUTO_INCREMENT,
            PatientID INT,
            AppointmentDate DATETIME NOT NULL,
            DoctorID INT,
            Notes TEXT,
            FOREIGN KEY (PatientID) REFERENCES Patients(PatientID)
        );

        CREATE TABLE IF NOT EXISTS MedicalRecords (
            RecordID INT PRIMARY KEY AUTO_INCREMENT,
            PatientID INT,
            VisitDate DATETIME NOT NULL,
            Diagnosis TEXT NOT NULL,
            Treatment TEXT NOT NULL,
            DoctorID INT,
            FOREIGN KEY (PatientID) REFERENCES Patients(PatientID)
        );

        CREATE TABLE IF NOT EXISTS Users (
            UserID INT PRIMARY KEY AUTO_INCREMENT,
            Username VARCHAR(50) NOT NULL UNIQUE,
            PasswordHash VARCHAR(255) NOT NULL,
            Role ENUM('Doctor', 'Nurse', 'Admin') NOT NULL,
            CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    connection.query(createDatabaseAndTables, (err, results) => {
        if (err) throw err;
        console.log('Database and tables created');
        connection.end();
    });
});
