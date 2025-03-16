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
        showSection('home-section');
    } else {
        authSection.style.display = 'block';
        dashboardSection.style.display = 'none';
        logoutLink.style.display = 'none';
        showSection('home-section');
    }

    const menuIcon = document.querySelector('.menu-icon');
    const navOptions = document.querySelector('.nav-options');
    menuIcon.addEventListener('click', () => {
        navOptions.style.display = navOptions.style.display === 'flex' ? 'none' : 'flex';
    });
});

// Näytä valittu osio
function showSection(sectionId) {
    const sections = document.getElementsByClassName('section');
    for (let section of sections) {
        section.style.display = 'none';
    }
    document.getElementById(sectionId).style.display = 'block';
    if (sectionId === 'home-section' && localStorage.getItem('isLoggedIn') === 'true') {
        document.getElementById('dashboard').style.display = 'block';
        document.getElementById('auth').style.display = 'none';
        populateDashboard();
    } else if (sectionId === 'home-section' && localStorage.getItem('isLoggedIn') !== 'true') {
        document.getElementById('auth').style.display = 'block';
        document.getElementById('dashboard').style.display = 'none';
    }
    if (sectionId === 'wallet-section' && localStorage.getItem('isLoggedIn') === 'true') {
        updateWallet();
    }
}

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
        points: 0,
        level: 1 // Aloitetaan tasolta 1
    };

    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('isLoggedIn', 'true');

    document.getElementById('auth').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('logout-link').style.display = 'block';

    populateDashboard();
    showSection('home-section');
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
    showSection('home-section');
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
    showSection('home-section');
}

// Laske kumulatiiviset tason vaatimukset
function getCumulativeLevelRequirements(level) {
    let total = 0;
    for (let i = 1; i < level; i++) {
        total += 5 + (i - 1) * 3; // Lasketaan kunkin tason vaatimus ja summataan
    }
    return total;
}

// Laske yksittäisen tason vaatimus (käytetään progress barin max-arvon laskemiseen)
function getSingleLevelRequirement(level) {
    return 5 + (level - 1) * 3; // Taso 1: 5, Taso 2: 8, Taso 3: 11, Taso 4: 14 jne.
}

// Täytetään dashboardin tiedot
function populateDashboard() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        console.error('User not found in localStorage');
        return;
    }

    console.log('Populating dashboard for user:', user);

    // Päivitetään taso viitteiden perusteella
    let currentLevel = user.level;
    let totalReferrals = user.refCount;
    let nextLevelRefs = getCumulativeLevelRequirements(currentLevel + 1); // Seuraavan tason kumulatiiviset vaatimukset
    let leveledUp = false;

    // Tarkistetaan vain yksi tason nousu kerrallaan
    if (totalReferrals >= nextLevelRefs) {
        currentLevel++;
        user.level = currentLevel;
        user.points += currentLevel * 100; // Bonus: taso * 100 pistettä
        alert(`Congratulations! You reached Level ${currentLevel} and earned ${currentLevel * 100} bonus points!`);
        nextLevelRefs = getCumulativeLevelRequirements(currentLevel + 1);
        leveledUp = true;
    }

    localStorage.setItem('user', JSON.stringify(user));

    // Päivitä UI
    document.getElementById('user-name').textContent = user.name;
    const levelText = document.getElementById('user-level');
    levelText.textContent = user.level;
    if (leveledUp) {
        levelText.classList.add('level-up'); // Tasonousuanimaatio
    }
    document.getElementById('ref-count').textContent = user.refCount;
    document.getElementById('points').textContent = user.points;

    // Progress bar
    const refsForCurrentLevel = getCumulativeLevelRequirements(user.level); // Nykyisen tason kumulatiiviset vaatimukset
    const refsForNextLevel = getCumulativeLevelRequirements(user.level + 1); // Seuraavan tason kumulatiiviset vaatimukset
    const progress = totalReferrals - refsForCurrentLevel; // Edistyminen nykyisellä tasolla
    const maxProgress = getSingleLevelRequirement(user.level); // Nykyisen tason yksittäinen vaatimus
    const progressBar = document.getElementById('progress-bar');
    progressBar.max = maxProgress;
    progressBar.value = progress;
    console.log(`Progress: ${progress}/${maxProgress}, refs: ${user.refCount}, currentLevel: ${user.level}, refsForCurrentLevel: ${refsForCurrentLevel}, refsForNextLevel: ${refsForNextLevel}`);
    document.getElementById('next-level-refs').textContent = refsForNextLevel;

    // Päivitä leaderboard
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

// Päivitetään viitteitä ja pisteitä (mock-logiikka)
function updateReferral() {
    console.log('updateReferral called');
    let user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        console.error('User not found in localStorage');
        alert('Error: User not found. Please log in again.');
        return;
    }

    user.refCount += 1; // Lisätään viite
    user.points += 20; // 20 pistettä/viite
    console.log('Updated user:', user);

    localStorage.setItem('user', JSON.stringify(user));
    populateDashboard();
    if (document.getElementById('wallet-section').style.display === 'block') {
        updateWallet();
    }
}

// Lunasta pisteitä (mock-toiminto)
function redeemPoints() {
    let user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        console.error('User not found in localStorage');
        return;
    }

    if (user.points >= 50) {
        user.points -= 50;
        localStorage.setItem('user', JSON.stringify(user));
        populateDashboard();
        alert('Redeemed 50 points for a bonus entry! Remaining points: ' + user.points);
    } else {
        alert('You need at least 50 points to redeem!');
    }
    if (document.getElementById('wallet-section').style.display === 'block') {
        updateWallet();
    }
}

// Päivitä Wallet-sivun tiedot
function updateWallet() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById('wallet-points').textContent = user.points;
        document.getElementById('wallet-referrals').textContent = user.refCount;
        document.getElementById('wallet-mined').textContent = '0'; // Tulee myöhemmin
    }
}

// Suorita tehtävä
function completeTask(taskId) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert('Please log in to complete tasks.');
        return;
    }

    if (taskId === 'followX' && !localStorage.getItem('task_followX_completed')) {
        user.points += 500;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('task_followX_completed', 'true');
        alert('You earned 500 points for following @BlondieToken on X!');
        populateDashboard();
        if (document.getElementById('wallet-section').style.display === 'block') {
            updateWallet();
        }
    } else {
        alert('Task already completed or invalid task!');
    }
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
