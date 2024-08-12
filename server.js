const express = require('express');
const { register, login, authMiddleware } = require('./auth');
const cron = require('node-cron');
const sendSMS = require('./smsSender');
const mysql = require('mysql2');
const db = mysql.createConnection(require('./dbConfig').newDbConfig);

const app = express();
app.use(express.json());

app.post('/register', register);
app.post('/login', login);

db.connect(err => {
    if (err) throw err;
    console.log('Database connected...');
});

// Function to get upcoming appointments and send reminders
const sendReminders = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

    const query = `
        SELECT a.AppointmentID, a.AppointmentDate, p.ContactInfo, p.FirstName
        FROM Appointments a
        JOIN Patients p ON a.PatientID = p.PatientID
        WHERE a.AppointmentDate BETWEEN ? AND ?;
    `;

    db.query(query, [tomorrow, dayAfterTomorrow], (err, results) => {
        if (err) throw err;

        results.forEach(appointment => {
            const message = `Dear ${appointment.FirstName}, this is a reminder for your appointment on ${appointment.AppointmentDate}.`;
            sendSMS(appointment.ContactInfo, message);
        });
    });
};

// Schedule the reminder function to run every day at 8 AM
cron.schedule('0 8 * * *', () => {
    sendReminders();
});

// Protected route example
app.get('/patients', authMiddleware, (req, res) => {
    db.query('SELECT * FROM Patients', (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(results);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
