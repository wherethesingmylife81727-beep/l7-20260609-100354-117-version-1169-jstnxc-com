(function () {
  var Hls = window.Hls;
  var players = document.querySelectorAll('[data-player]');

  players.forEach(function (player) {
    var video = player.querySelector('video');
    var cover = player.querySelector('.player-cover');
    var hlsInstance = null;

    function loadAndPlay() {
      if (!video) {
        return;
      }

      var stream = video.getAttribute('data-stream');

      if (!stream) {
        return;
      }

      if (!player.getAttribute('data-ready')) {
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = stream;
        } else if (Hls && Hls.isSupported()) {
          hlsInstance = new Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hlsInstance.loadSource(stream);
          hlsInstance.attachMedia(video);
        } else {
          video.src = stream;
        }

        player.setAttribute('data-ready', 'true');
      }

      if (cover) {
        cover.classList.add('is-hidden');
      }

      var playPromise = video.play();

      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {});
      }
    }

    if (cover) {
      cover.addEventListener('click', loadAndPlay);
    }

    player.addEventListener('click', function (event) {
      if (event.target === video && !player.getAttribute('data-ready')) {
        loadAndPlay();
      }
    });

    window.addEventListener('beforeunload', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  });
})();
