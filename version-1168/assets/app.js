(function () {
    function selectAll(root, selector) {
        return Array.prototype.slice.call(root.querySelectorAll(selector));
    }

    var toggle = document.querySelector(".menu-toggle");
    var mobileNav = document.querySelector(".mobile-nav");
    if (toggle && mobileNav) {
        toggle.addEventListener("click", function () {
            mobileNav.classList.toggle("is-open");
        });
    }

    var hero = document.querySelector(".hero-stage");
    if (hero) {
        var slides = selectAll(hero, ".hero-card");
        var dots = selectAll(document, ".hero-dot");
        var current = 0;
        function showSlide(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("active", i === current);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("active", i === current);
            });
        }
        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                showSlide(index);
            });
        });
        window.setInterval(function () {
            showSlide(current + 1);
        }, 5200);
    }

    selectAll(document, ".catalog-section").forEach(function (section) {
        var input = section.querySelector(".movie-search");
        var year = section.querySelector(".year-filter");
        var region = section.querySelector(".region-filter");
        var type = section.querySelector(".type-filter");
        var cards = selectAll(section, ".movie-card");
        var empty = section.querySelector(".empty-state");
        function valueOf(control) {
            return control ? control.value.trim().toLowerCase() : "";
        }
        function applyFilters() {
            var queryValue = valueOf(input);
            var yearValue = valueOf(year);
            var regionValue = valueOf(region);
            var typeValue = valueOf(type);
            var shown = 0;
            cards.forEach(function (card) {
                var text = [
                    card.getAttribute("data-title") || "",
                    card.getAttribute("data-tags") || "",
                    card.getAttribute("data-region") || "",
                    card.getAttribute("data-type") || ""
                ].join(" ").toLowerCase();
                var ok = true;
                if (queryValue && text.indexOf(queryValue) === -1) {
                    ok = false;
                }
                if (yearValue && String(card.getAttribute("data-year") || "").toLowerCase() !== yearValue) {
                    ok = false;
                }
                if (regionValue && String(card.getAttribute("data-region") || "").toLowerCase() !== regionValue) {
                    ok = false;
                }
                if (typeValue && String(card.getAttribute("data-type") || "").toLowerCase() !== typeValue) {
                    ok = false;
                }
                card.style.display = ok ? "" : "none";
                if (ok) {
                    shown += 1;
                }
            });
            if (empty) {
                empty.classList.toggle("is-visible", shown === 0);
            }
        }
        [input, year, region, type].forEach(function (control) {
            if (control) {
                control.addEventListener("input", applyFilters);
                control.addEventListener("change", applyFilters);
            }
        });
    });
})();

function initializeMoviePlayer(videoId, overlayId, sourceUrl) {
    var video = document.getElementById(videoId);
    var overlay = document.getElementById(overlayId);
    if (!video || !overlay || !sourceUrl) {
        return;
    }
    var started = false;
    var hlsInstance = null;
    function bindSource() {
        if (started) {
            return;
        }
        started = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = sourceUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new Hls();
            hlsInstance.loadSource(sourceUrl);
            hlsInstance.attachMedia(video);
        } else {
            video.src = sourceUrl;
        }
    }
    function play() {
        bindSource();
        overlay.classList.add("is-hidden");
        video.controls = true;
        var promise = video.play();
        if (promise && typeof promise.catch === "function") {
            promise.catch(function () {
                overlay.classList.remove("is-hidden");
            });
        }
    }
    overlay.addEventListener("click", play);
    video.addEventListener("click", function () {
        if (video.paused) {
            play();
        }
    });
    window.addEventListener("beforeunload", function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
}
