// Countdown timer
function startCountdown() {
    const endDate = new Date("2025-04-15T00:00:00").getTime();
    const countdownElement = document.getElementById("countdown");

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = endDate - now;

        if (distance < 0) {
            countdownElement.innerHTML = "Competition has ended!";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdownElement.innerHTML = `Competition ends in: ${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Copy referral link
function copyLink() {
    const link = document.getElementById("ref-link").innerText;
    navigator.clipboard.writeText(link).then(() => {
        alert("Referral link copied!");
    });
}

// Start countdown on pages that need it
if (document.getElementById("countdown")) {
    startCountdown();
}

