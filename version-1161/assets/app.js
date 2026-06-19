(function () {
  var toggle = document.querySelector('[data-nav-toggle]');
  var panel = document.querySelector('[data-mobile-nav]');

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('[data-search-form]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      var input = form.querySelector('input[name="q"]');
      var value = input ? input.value.trim() : '';

      if (value) {
        event.preventDefault();
        window.location.href = './search.html?q=' + encodeURIComponent(value);
      }
    });
  });

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }
  }

  var searchArea = document.querySelector('[data-search-page]');
  var localSearch = document.querySelector('[data-local-search]');

  if (searchArea && localSearch) {
    var input = localSearch.querySelector('input[type="search"]');
    var cards = Array.prototype.slice.call(searchArea.querySelectorAll('.js-search-card'));
    var emptyState = searchArea.querySelector('[data-empty-state]');
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';

    function normalize(value) {
      return String(value || '').toLowerCase().replace(/\s+/g, '');
    }

    function filterCards(value) {
      var needle = normalize(value);
      var visible = 0;

      cards.forEach(function (card) {
        var text = normalize(card.getAttribute('data-search'));
        var title = normalize(card.getAttribute('data-title'));
        var matched = !needle || text.indexOf(needle) !== -1 || title.indexOf(needle) !== -1;

        card.style.display = matched ? '' : 'none';

        if (matched) {
          visible += 1;
        }
      });

      if (emptyState) {
        emptyState.classList.toggle('is-visible', visible === 0);
      }
    }

    if (input && query) {
      input.value = query;
    }

    filterCards(query);

    localSearch.addEventListener('submit', function (event) {
      event.preventDefault();
      filterCards(input ? input.value : '');
    });

    if (input) {
      input.addEventListener('input', function () {
        filterCards(input.value);
      });
    }
  }
})();
