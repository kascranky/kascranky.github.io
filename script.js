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

function initFloatingNav() {
    const floatingNav = document.querySelector(".floating-nav");
    if (!floatingNav) return;

    const revealAfter = 150;
    const autoHideDelayMs = 1500;
    let hideTimer = null;

    function clearHideTimer() {
        if (hideTimer) {
            clearTimeout(hideTimer);
            hideTimer = null;
        }
    }

    function scheduleHide() {
        clearHideTimer();
        if (window.scrollY <= revealAfter) return;

        hideTimer = setTimeout(() => {
            floatingNav.classList.remove("is-visible");
        }, autoHideDelayMs);
    }

    function onScroll() {
        const shouldShow = window.scrollY > revealAfter;
        floatingNav.classList.toggle("is-visible", shouldShow);
        if (shouldShow) {
            scheduleHide();
        } else {
            clearHideTimer();
        }
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    floatingNav.addEventListener("mouseenter", () => {
        clearHideTimer();
        if (window.scrollY > revealAfter) {
            floatingNav.classList.add("is-visible");
        }
    });
    floatingNav.addEventListener("mouseleave", scheduleHide);
}

function initImageSkeletons() {
    const images = Array.from(document.querySelectorAll("img.skeleton-image"));
    if (!images.length) return;

    images.forEach((image) => {
        function markAsLoaded() {
            image.classList.add("is-loaded");
        }

        if (image.complete && image.naturalWidth > 0) {
            markAsLoaded();
            return;
        }

        image.addEventListener("load", markAsLoaded, { once: true });
        image.addEventListener("error", markAsLoaded, { once: true });
    });
}

function initTopLinkScroll() {
    const topLink = document.querySelector(".top-link");
    if (!topLink) return;

    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        // esta funcao faz a animacao de scroll ficar mais suave, acelerando no inicio e desacelerando no final. com a logica de que para os primeiros 50% do tempo, a posicao do scroll aumenta mais rapidamente, e para os ultimos 50%, a posicao aumenta mais lentamente, criando um efeito de ease-in-out. vemos isso onde para t < 0.5, a funcao retorna 4 * t^3, o que faz o scroll acelerar, e para t >= 0.5, a funcao retorna 1 - ((-2 * t + 2)^3) / 2, o que faz o scroll desacelerar.
    }

    topLink.addEventListener("click", (event) => {
        event.preventDefault();

        const startY = window.scrollY;
        const durationMs = 1000;
        const startTime = performance.now();

        function step(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / durationMs, 1);
            const eased = easeInOutCubic(progress);
            const nextY = startY * (1 - eased);

            window.scrollTo(0, nextY);

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                window.scrollTo(0, 0);
            }
        }

        requestAnimationFrame(step);
    });
}

function initSectionTopSync() {
    const navLinks = Array.from(
        document.querySelectorAll('.quick-nav a[href^="#"], .floating-nav a[href^="#"]')
    );
    if (!navLinks.length) return;

    const sectionIds = Array.from(new Set(
        navLinks
            .map((link) => link.getAttribute("href"))
            .filter((href) => href && href.startsWith("#"))
    ));

    const sections = sectionIds
        .map((id) => document.querySelector(id))
        .filter(Boolean);
    if (!sections.length) return;

    function setActive(id) {
        navLinks.forEach((link) => {
            const isActive = link.getAttribute("href") === id;
            link.classList.toggle("is-active", isActive);
            link.setAttribute("aria-current", isActive ? "location" : "false");
        });
    }

    function updateByScroll() {
        const triggerY = 120;
        let currentSection = sections[0];

        sections.forEach((section) => {
            const top = section.getBoundingClientRect().top;
            if (top <= triggerY) currentSection = section;
        });

        const id = `#${currentSection.id}`;
        setActive(id);
        if (history.replaceState) {
            history.replaceState(null, "", id);
        }
    }

    updateByScroll();
    window.addEventListener("scroll", updateByScroll, { passive: true });
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
    initFloatingNav();
    initImageSkeletons();
    initTopLinkScroll();
    initSectionTopSync();
});
