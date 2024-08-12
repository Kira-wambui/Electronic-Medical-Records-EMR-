const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
const db = mysql.createConnection(require('./dbConfig').newDbConfig);

db.connect(err => {
    if (err) throw err;
    console.log('Database connected...');
});

const register = (req, res) => {
    const { username, password, role } = req.body;
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) throw err;
        db.query('INSERT INTO Users (Username, PasswordHash, Role) VALUES (?, ?, ?)', [username, hashedPassword, role], (err, result) => {
            if (err) return res.status(500).send(err);
            res.status(201).send('User registered');
        });
    });
};

const login = (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM Users WHERE Username = ?', [username], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).send('User not found');
        const user = results[0];
        bcrypt.compare(password, user.PasswordHash, (err, isMatch) => {
            if (err) return res.status(500).send(err);
            if (!isMatch) return res.status(401).send('Invalid credentials');
            const token = jwt.sign({ id: user.UserID, role: user.Role }, 'your_jwt_secret', { expiresIn: '1h' });
            res.status(200).send({ token });
        });
    });
};

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send('Access denied');
    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).send('Invalid token');
    }
};

module.exports = { register, login, authMiddleware };
