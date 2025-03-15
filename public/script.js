let currentUser = null;

function register() {
const name = document.getElementById('reg-name').value;
const email = document.getElementById('reg-email').value;
const password = document.getElementById('reg-password').value;

fetch('/register', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ name, email, password })
})
.then(res => res.json())
.then(data => {
if (data.error) alert(data.error);
else {
alert('Registered! Your referral code: ' + data.refCode);
login(email, password);
}
});
}

function login(email, password) {
if (!email) email = document.getElementById('login-email').value;
if (!password) password = document.getElementById('login-password').value;

fetch('/login', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ email, password })
})
.then(res => res.json())
.then(data => {
if (data.error) alert(data.error);
else {
currentUser = data.user;
document.getElementById('auth').style.display = 'none';
document.getElementById('dashboard').style.display = 'block';
document.getElementById('user-name').innerText = currentUser.name;
document.getElementById('ref-code').innerText = currentUser.refCode;
document.getElementById('ref-count').innerText = currentUser.referrals;
document.getElementById('points').innerText = currentUser.points;
loadLeaderboard();
}
});
}

function logout() {
currentUser = null;
document.getElementById('auth').style.display = 'block';
document.getElementById('dashboard').style.display = 'none';
}

function copyRefCode() {
const refCode = currentUser.refCode;
const link = `${window.location.origin}/?ref=${refCode}`;
navigator.clipboard.writeText(link).then(() => alert('Referral link copied: ' + link));
}

function loadLeaderboard() {
fetch('/leaderboard')
.then(res => res.json())
.then(data => {
const table = document.getElementById('leaderboard');
table.innerHTML = '<tr><th>Rank</th><th>Name</th><th>Referrals</th><th>Points</th></tr>';
data.forEach((user, index) => {
table.innerHTML += `<tr><td>${index + 1}</td><td>${user.name}</td><td>${user.referrals}</td><td>${user.points}</td></tr>`;
});
});
}

const urlParams = new URLSearchParams(window.location.search);
const refCode = urlParams.get('ref');
if (refCode) {
fetch('/referral ', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ refCode })
});
}
