function calculateAge(birthYear, birthMonthIndex, birthDay) {
    const today = new Date();
    let age = today.getFullYear() - birthYear;
    const hasHadBirthday =
        today.getMonth() > birthMonthIndex ||
        (today.getMonth() === birthMonthIndex && today.getDate() >= birthDay);

    if (!hasHadBirthday) {
        age -= 1;
    }

    return age;
}

function updateAge() {
    const ageEl = document.getElementById("age-value");
    if (!ageEl) return;

    const age = calculateAge(2003, 9, 10);
    ageEl.textContent = String(age);
}

function updateFooterYearRange() {
    const yearEl = document.getElementById("footer-year-range");
    if (!yearEl) return;

    const currentYear = new Date().getFullYear();
    yearEl.textContent = `2016 - ${currentYear}`;
}

function startTypingEffect() {
    const titleEl = document.querySelector(".typing-title");
    if (!titleEl) return;

    const fullText = titleEl.getAttribute("data-text") || titleEl.textContent || "";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
        titleEl.textContent = fullText;
        titleEl.classList.add("done");
        return;
    }

    titleEl.textContent = "";

    let index = 0;
    const speedMs = 170;

    const timer = setInterval(() => {
        titleEl.textContent += fullText.charAt(index);
        index += 1;

        if (index >= fullText.length) {
            clearInterval(timer);
            titleEl.classList.add("done");
        }
    }, speedMs);
}

document.addEventListener("DOMContentLoaded", () => {
    updateAge();
    updateFooterYearRange();
    startTypingEffect();
});
