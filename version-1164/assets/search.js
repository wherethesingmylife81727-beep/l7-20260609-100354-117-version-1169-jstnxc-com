(function() {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  ready(function() {
    var input = document.querySelector('#global-search-input');
    var results = document.querySelector('#global-search-results');
    var empty = document.querySelector('#global-search-empty');
    var movies = window.SEARCH_MOVIES || [];

    if (!input || !results) {
      return;
    }

    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';

    if (query) {
      input.value = query;
    }

    function render() {
      var keyword = input.value.trim().toLowerCase();
      var list = movies.filter(function(movie) {
        var text = [
          movie.title,
          movie.year,
          movie.region,
          movie.type,
          movie.genre,
          movie.category,
          (movie.tags || []).join(' '),
          movie.summary
        ].join(' ').toLowerCase();
        return !keyword || text.indexOf(keyword) !== -1;
      }).slice(0, 80);

      results.innerHTML = list.map(function(movie) {
        return '<a class="search-result" href="./' + escapeHtml(movie.url) + '">' +
          '<img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '">' +
          '<span>' +
          '<h3>' + escapeHtml(movie.title) + '</h3>' +
          '<p>' + escapeHtml(movie.summary) + '</p>' +
          '<span class="detail-meta">' +
          '<span>' + escapeHtml(movie.year) + '</span>' +
          '<span>' + escapeHtml(movie.region) + '</span>' +
          '<span>' + escapeHtml(movie.category) + '</span>' +
          '</span>' +
          '</span>' +
          '</a>';
      }).join('');

      if (empty) {
        empty.style.display = list.length ? 'none' : 'block';
      }
    }

    input.addEventListener('input', render);
    render();
  });
})();
