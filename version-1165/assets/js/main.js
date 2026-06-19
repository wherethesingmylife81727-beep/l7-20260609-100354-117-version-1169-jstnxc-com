(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobilePanel = document.querySelector('[data-mobile-panel]');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var previous = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var activeIndex = 0;
    var timer = null;

    function activate(index) {
      if (!slides.length) {
        return;
      }

      activeIndex = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === activeIndex);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === activeIndex);
      });
    }

    function queue() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        activate(activeIndex + 1);
      }, 5200);
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        activate(index);
        queue();
      });
    });

    if (previous) {
      previous.addEventListener('click', function () {
        activate(activeIndex - 1);
        queue();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        activate(activeIndex + 1);
        queue();
      });
    }

    activate(0);
    queue();
  }

  var filterInput = document.querySelector('[data-local-filter]');
  var queryInput = document.querySelector('[data-query-input]');
  var summary = document.querySelector('[data-search-summary]');

  function normalize(value) {
    return String(value || '').toLowerCase().replace(/\s+/g, '');
  }

  function applyFilter(value) {
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-filter-card]'));
    var needle = normalize(value);
    var visibleCount = 0;

    cards.forEach(function (card) {
      var haystack = normalize([
        card.getAttribute('data-title'),
        card.getAttribute('data-region'),
        card.getAttribute('data-category'),
        card.getAttribute('data-tags'),
        card.textContent
      ].join(' '));
      var visible = !needle || haystack.indexOf(needle) !== -1;
      card.classList.toggle('is-hidden', !visible);

      if (visible) {
        visibleCount += 1;
      }
    });

    if (summary) {
      summary.textContent = needle ? '找到 ' + visibleCount + ' 条相关内容。' : '输入关键词后自动筛选当前片库。';
    }
  }

  if (filterInput) {
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';

    if (queryInput && query) {
      queryInput.value = query;
      filterInput.value = query;
    }

    applyFilter(filterInput.value);

    filterInput.addEventListener('input', function () {
      applyFilter(filterInput.value);
    });
  }

  document.querySelectorAll('img').forEach(function (image) {
    image.addEventListener('error', function () {
      image.classList.add('image-missing');
    }, { once: true });
  });
})();
