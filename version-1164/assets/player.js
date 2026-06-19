(function() {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function() {
    var shell = document.querySelector('.player-shell');

    if (!shell) {
      return;
    }

    var video = shell.querySelector('video');
    var layer = shell.querySelector('.play-layer');
    var src = shell.getAttribute('data-video-url');
    var hls = null;

    if (!video || !src) {
      return;
    }

    function bind() {
      if (video.getAttribute('data-ready') === '1') {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(src);
        hls.attachMedia(video);
      } else {
        video.src = src;
      }

      video.setAttribute('data-ready', '1');
    }

    function play() {
      bind();

      if (layer) {
        layer.classList.add('is-hidden');
      }

      var result = video.play();

      if (result && typeof result.catch === 'function') {
        result.catch(function() {});
      }
    }

    if (layer) {
      layer.addEventListener('click', play);
    }

    video.addEventListener('click', function() {
      if (video.paused) {
        play();
      }
    });

    video.addEventListener('play', function() {
      if (layer) {
        layer.classList.add('is-hidden');
      }
    });

    window.addEventListener('pagehide', function() {
      if (hls && typeof hls.destroy === 'function') {
        hls.destroy();
      }
    });
  });
})();
