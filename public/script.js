// Alustetaan tilan hallinta
document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const authSection = document.getElementById('auth');
    const dashboardSection = document.getElementById('dashboard');
    const logoutLink = document.getElementById('logout-link');

    if (isLoggedIn) {
        authSection.style.display = 'none';
        dashboardSection.style.display = 'block';
        logoutLink.style.display = 'block';
        populateDashboard();
    } else {
        authSection.style.display = 'block';
        dashboardSection.style.display = 'none';
        logoutLink.style.display = 'none';
    }

    const menuIcon = document.querySelector('.menu-icon');
    const navOptions = document.querySelector('.nav-options');
    menuIcon.addEventListener('click', () => {
        navOptions.style.display = navOptions.style.display === 'flex' ? 'none' : 'flex';
    });
});

// Rekisteröityminen
function register() {
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value.trim();

    if (!name || !email || !password) {
        alert('Please fill in all fields to register.');
        return;
    }

    const user = {
        name: name,
        email: email,
        password: password,
        refCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
        refCount: 0,
        points: 0
    };

    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('isLoggedIn', 'true');

    document.getElementById('auth').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('logout-link').style.display = 'block';

    populateDashboard();
}

// Kirjautuminen
function login() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (!email || !password) {
        alert('Please fill in all fields to login.');
        return;
    }

    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || user.email !== email || user.password !== password) {
        alert('Invalid email or password.');
        return;
    }

    localStorage.setItem('isLoggedIn', 'true');

    document.getElementById('auth').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('logout-link').style.display = 'block';

    populateDashboard();
}

// Uloskirjautuminen
function logout() {
    localStorage.setItem('isLoggedIn', 'false');

    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('auth').style.display = 'block';
    document.getElementById('logout-link').style.display = 'none';

    document.getElementById('reg-name').value = '';
    document.getElementById('reg-email').value = '';
    document.getElementById('reg-password').value = '';
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
}

// Täytetään dashboardin tiedot
function populateDashboard() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById('user-name').textContent = user.name;
        document.getElementById('ref-code').textContent = user.refCode;
        document.getElementById('ref-count').textContent = user.refCount;
        document.getElementById('points').textContent = user.points;
    }

    const leaderboard = document.getElementById('leaderboard');
    leaderboard.innerHTML = `
        <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Points</th>
        </tr>
        <tr>
            <td>1</td>
            <td>${user.name}</td>
            <td>${user.points}</td>
        </tr>
    `;
}

// Kopioi koko referral-linkki
function copyRefCode() {
    const user = JSON.parse(localStorage.getItem('user'));
    const baseUrl = 'https://yourdomain.com/register'; // Korvaa oikealla Heroku-URL:lla
    const referralLink = `${baseUrl}?ref=${user.refCode}`;
    navigator.clipboard.writeText(referralLink).then(() => {
        alert('Referral link copied: ' + referralLink);
    });
}

// Jako sosiaalisessa mediassa
function shareOnX() {
    const user = JSON.parse(localStorage.getItem('user'));
    const baseUrl = 'https://yourdomain.com/register'; // Korvaa oikealla Heroku-URL:lla
    const referralLink = `${baseUrl}?ref=${user.refCode}`;
    const text = `Join the BlondieToken Referral Contest with my code! Win €10,000! ${referralLink}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
}

function shareOnWhatsApp() {
    const user = JSON.parse(localStorage.getItem('user'));
    const baseUrl = 'https://yourdomain.com/register'; // Korvaa oikealla Heroku-URL:lla
    const referralLink = `${baseUrl}?ref=${user.refCode}`;
    const text = `Join the BlondieToken Referral Contest with my code! Win €10,000! ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

function shareOnFacebook() {
    const user = JSON.parse(localStorage.getItem('user'));
    const baseUrl = 'https://yourdomain.com/register'; // Korvaa oikealla Heroku-URL:lla
    const referralLink = `${baseUrl}?ref=${user.refCode}`;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`, '_blank');
}

function shareOnTelegram() {
    const user = JSON.parse(localStorage.getItem('user'));
    const baseUrl = 'https://yourdomain.com/register'; // Korvaa oikealla Heroku-URL:lla
    const referralLink = `${baseUrl}?ref=${user.refCode}`;
    const text = `Join the BlondieToken Referral Contest with my code! Win €10,000! ${referralLink}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(text)}`, '_blank');
}
