import { H as Hls } from './hls-vendor.js';

(function () {
  var shell = document.querySelector('[data-player]');

  if (!shell) {
    return;
  }

  var video = shell.querySelector('video');
  var playButton = shell.querySelector('[data-play-button]');
  var message = shell.querySelector('[data-player-message]');
  var stream = video ? video.getAttribute('data-stream') : '';
  var initialized = false;
  var hls = null;

  function showMessage(text) {
    if (!message) {
      return;
    }

    message.textContent = text;
    message.classList.add('is-visible');
  }

  function initialize() {
    if (initialized || !video || !stream) {
      return;
    }

    initialized = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
      return;
    }

    if (Hls && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });

      hls.loadSource(stream);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, function (_, data) {
        if (!data || !data.fatal) {
          return;
        }

        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          showMessage('网络连接异常，正在重新加载');
          hls.startLoad();
          return;
        }

        if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          showMessage('播放状态异常，正在恢复');
          hls.recoverMediaError();
          return;
        }

        showMessage('当前浏览器暂时无法播放该视频');
      });
      return;
    }

    showMessage('当前浏览器不支持该视频格式');
  }

  function startPlayback() {
    initialize();

    if (!video) {
      return;
    }

    video.controls = true;

    if (playButton) {
      playButton.classList.add('is-hidden');
    }

    var promise = video.play();

    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {
        if (playButton) {
          playButton.classList.remove('is-hidden');
        }
      });
    }
  }

  if (playButton) {
    playButton.addEventListener('click', startPlayback);
  }

  if (video) {
    video.addEventListener('click', function () {
      if (video.paused) {
        startPlayback();
      }
    });

    video.addEventListener('play', function () {
      if (playButton) {
        playButton.classList.add('is-hidden');
      }
    });

    video.addEventListener('pause', function () {
      if (video.currentTime === 0 && playButton) {
        playButton.classList.remove('is-hidden');
      }
    });
  }

  window.addEventListener('pagehide', function () {
    if (hls) {
      hls.destroy();
      hls = null;
    }
  });
})();
