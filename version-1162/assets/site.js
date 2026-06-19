document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.querySelector(".mobile-toggle");
    const mobileNav = document.querySelector(".mobile-nav");

    if (toggle && mobileNav) {
        toggle.addEventListener("click", function () {
            const isOpen = mobileNav.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", String(isOpen));
        });
    }

    document.querySelectorAll("[data-hero]").forEach(function (hero) {
        const slides = Array.from(hero.querySelectorAll(".hero-slide"));
        const dots = Array.from(hero.querySelectorAll(".hero-dot"));
        const prev = hero.querySelector("[data-hero-prev]");
        const next = hero.querySelector("[data-hero-next]");
        let current = 0;
        let timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        function start() {
            stop();
            timer = setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
        }

        if (prev) {
            prev.addEventListener("click", function () {
                show(current - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                show(current + 1);
                start();
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                show(index);
                start();
            });
        });

        hero.addEventListener("mouseenter", stop);
        hero.addEventListener("mouseleave", start);
        start();
    });

    function applyFilter(section) {
        const input = section.querySelector("[data-search-input]");
        const yearFilter = section.querySelector("[data-year-filter]");
        const root = section.closest("main") || document;
        const targetId = input ? input.getAttribute("data-search-scope") : "";
        const cardRoot = targetId ? document.getElementById(targetId) || root : root;
        const cards = Array.from(cardRoot.querySelectorAll(".movie-card"));
        const empty = cardRoot.querySelector(".empty-state") || root.querySelector(".empty-state");
        const query = input ? input.value.trim().toLowerCase() : "";
        const year = yearFilter ? yearFilter.value : "";
        let visible = 0;

        cards.forEach(function (card) {
            const text = (card.getAttribute("data-search") || card.textContent || "").toLowerCase();
            const cardYear = card.getAttribute("data-year") || "";
            const matchedText = !query || text.indexOf(query) !== -1;
            const matchedYear = !year || cardYear === year;
            const matched = matchedText && matchedYear;
            card.classList.toggle("is-hidden", !matched);
            if (matched) {
                visible += 1;
            }
        });

        if (empty) {
            empty.classList.toggle("is-visible", visible === 0);
        }
    }

    document.querySelectorAll("[data-search-input], [data-year-filter]").forEach(function (control) {
        const section = control.closest("[data-filter-section]") || control.closest("section") || document;
        const eventName = control.matches("select") ? "change" : "input";
        control.addEventListener(eventName, function () {
            applyFilter(section);
        });
    });
});
