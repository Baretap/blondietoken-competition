const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

let users = [];
if (fs.existsSync('users.json')) {
users = JSON.parse(fs.readFileSync('users.json'));
}

app.post('/register', (req, res) => {
const { name, email, password } = req.body;
if (users.find(u => u.email === email)) {
return res.status(400).json({ error: 'Email already exists' });
}
const refCode = Math.random().toString(36).substring(2, 8).toUpperCase();
const user = { name, email, password, refCode, referrals: 0, points: 0 };
users.push(user);
fs.writeFileSync('users.json', JSON.stringify(users));
res.json({ message: 'Registered successfully', refCode });
});

app.post('/login', (req, res) => {
const { email, password } = req.body;
const user = users.find(u => u.email === email && u.password === password);
if (!user) {
return res.status(401).json({ error: 'Invalid credentials' });
}
res.json({ message: 'Logged in', user: { name: user.name, refCode: user.refCode, referrals: user.referrals, points: user.points } });
});

app.post('/referral', (req, res) => {
const { refCode } = req.body;
const user = users.find(u => u.refCode === refCode);
if (user) {
user.referrals += 1;
user.points += 10;
fs.writeFileSync('users.json', JSON.stringify(users));
res.json({ message: 'Referral counted' });
} else {
res.status(404).json({ error: 'Invalid referral code' });
}
});

app.get('/leaderboard', (req, res) => {
const leaderboard = users.sort((a, b) => b.points - a.points).slice(0, 10);
res.json(leaderboard.map(u => ({ name: u.name, referrals: u.referrals, points: u.points })));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
console.log(`Server running on port ${port}`);
});
