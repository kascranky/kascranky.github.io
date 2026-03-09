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

function initPhotoCarousel() {
    const carousel = document.querySelector(".carousel");
    if (!carousel) return;

    const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
    const dots = Array.from(carousel.querySelectorAll(".carousel-dot"));
    const prevBtn = carousel.querySelector('[data-dir="prev"]');
    const nextBtn = carousel.querySelector('[data-dir="next"]');
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lightbox = document.getElementById("photo-lightbox");
    const lightboxImage = document.getElementById("lightbox-image");
    const lightboxCloseBtn = lightbox ? lightbox.querySelector(".lightbox-close") : null;

    if (!slides.length) return;

    let currentIndex = 0;
    let timer = null;
    let lastFocusedElement = null;

    function openLightbox(sourceImage) {
        if (!lightbox || !lightboxImage || !sourceImage) return;

        lightboxImage.src = sourceImage.currentSrc || sourceImage.src;
        lightboxImage.alt = sourceImage.alt || "Foto ampliada";
        lightbox.hidden = false;
        document.body.classList.add("lightbox-open");
        lastFocusedElement = document.activeElement;
        if (lightboxCloseBtn) lightboxCloseBtn.focus();
    }

    function closeLightbox() {
        if (!lightbox || !lightboxImage) return;

        lightbox.hidden = true;
        lightboxImage.src = "";
        lightboxImage.alt = "";
        document.body.classList.remove("lightbox-open");
        if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
            lastFocusedElement.focus();
        }
    }

    function render(index) {
        slides.forEach((slide, slideIndex) => {
            slide.classList.toggle("is-active", slideIndex === index);
        });

        dots.forEach((dot, dotIndex) => {
            const isActive = dotIndex === index;
            dot.classList.toggle("is-active", isActive);
            dot.setAttribute("aria-selected", String(isActive));
        });
    }

    function goTo(index) {
        const lastIndex = slides.length - 1;
        if (index < 0) {
            currentIndex = lastIndex;
        } else if (index > lastIndex) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }
        render(currentIndex);
    }

    function restartAutoPlay() {
        if (timer) clearInterval(timer);
        if (reduceMotion) return;

        timer = setInterval(() => {
            if (!document.hidden) goTo(currentIndex + 1);
        }, 4000);
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            goTo(currentIndex - 1);
            restartAutoPlay();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            goTo(currentIndex + 1);
            restartAutoPlay();
        });
    }

    dots.forEach((dot) => {
        dot.addEventListener("click", () => {
            const targetIndex = Number(dot.getAttribute("data-slide-to"));
            if (Number.isNaN(targetIndex)) return;
            goTo(targetIndex);
            restartAutoPlay();
        });
    });

    slides.forEach((slide) => {
        slide.tabIndex = 0;
        slide.setAttribute("role", "button");
        slide.setAttribute("aria-label", "Abrir foto em tamanho maior");

        slide.addEventListener("click", () => openLightbox(slide));
        slide.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openLightbox(slide);
            }
        });
    });

    if (lightboxCloseBtn) {
        lightboxCloseBtn.addEventListener("click", closeLightbox);
    }

    if (lightbox) {
        lightbox.addEventListener("click", (event) => {
            if (event.target === lightbox) closeLightbox();
        });
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && lightbox && !lightbox.hidden) {
            closeLightbox();
        }
    });

    render(currentIndex);
    restartAutoPlay();
}

document.addEventListener("DOMContentLoaded", () => {
    updateAge();
    updateFooterYearRange();
    startTypingEffect();
    initPhotoCarousel();
});
