(function() {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function() {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.querySelector('.nav-links');

    if (toggle && nav) {
      toggle.addEventListener('click', function() {
        var open = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }

    var hero = document.querySelector('.hero');

    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
      var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
      var prev = hero.querySelector('[data-hero-prev]');
      var next = hero.querySelector('[data-hero-next]');
      var index = 0;
      var timer = null;

      function show(n) {
        if (!slides.length) {
          return;
        }

        index = (n + slides.length) % slides.length;

        slides.forEach(function(slide, i) {
          slide.classList.toggle('active', i === index);
        });

        dots.forEach(function(dot, i) {
          dot.classList.toggle('active', i === index);
        });
      }

      function start() {
        if (timer) {
          window.clearInterval(timer);
        }

        timer = window.setInterval(function() {
          show(index + 1);
        }, 5200);
      }

      dots.forEach(function(dot, i) {
        dot.addEventListener('click', function() {
          show(i);
          start();
        });
      });

      if (prev) {
        prev.addEventListener('click', function() {
          show(index - 1);
          start();
        });
      }

      if (next) {
        next.addEventListener('click', function() {
          show(index + 1);
          start();
        });
      }

      show(0);
      start();
    }

    var filterInputs = Array.prototype.slice.call(document.querySelectorAll('.js-filter-input'));

    filterInputs.forEach(function(input) {
      var scope = document.querySelector(input.getAttribute('data-target')) || document;
      var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));
      var empty = document.querySelector(input.getAttribute('data-empty'));

      function apply() {
        var value = input.value.trim().toLowerCase();
        var visible = 0;

        cards.forEach(function(card) {
          var text = ((card.getAttribute('data-title') || '') + ' ' + (card.getAttribute('data-meta') || '')).toLowerCase();
          var ok = !value || text.indexOf(value) !== -1;
          card.style.display = ok ? '' : 'none';
          if (ok) {
            visible += 1;
          }
        });

        if (empty) {
          empty.style.display = visible ? 'none' : 'block';
        }
      }

      input.addEventListener('input', apply);
      apply();
    });

    var sortSelects = Array.prototype.slice.call(document.querySelectorAll('.js-sort-select'));

    sortSelects.forEach(function(select) {
      var scope = document.querySelector(select.getAttribute('data-target'));

      if (!scope) {
        return;
      }

      select.addEventListener('change', function() {
        var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));
        var mode = select.value;

        cards.sort(function(a, b) {
          var ay = Number(a.getAttribute('data-year')) || 0;
          var by = Number(b.getAttribute('data-year')) || 0;
          var at = a.getAttribute('data-title') || '';
          var bt = b.getAttribute('data-title') || '';

          if (mode === 'year-asc') {
            return ay - by || at.localeCompare(bt, 'zh-CN');
          }

          if (mode === 'title') {
            return at.localeCompare(bt, 'zh-CN');
          }

          return by - ay || at.localeCompare(bt, 'zh-CN');
        });

        cards.forEach(function(card) {
          scope.appendChild(card);
        });
      });
    });
  });
})();
