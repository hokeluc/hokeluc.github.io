(function () {
  var canvas = document.createElement('canvas');
  canvas.id = 'wave-bg';
  document.body.insertBefore(canvas, document.body.firstChild);
  var ctx = canvas.getContext('2d');

  var chars = ['~', '≈', '·', '-', '¨'];
  var cellW = 11;
  var cellH = 13;
  var maxDpr = 1.5;
  var fps = 14;
  var frameInterval = 1000 / fps;
  var reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  var cols = 0;
  var rows = 0;
  var t = 0;
  var timerId = null;
  var lastFrameTime = 0;

  var colors = { bg: '#000', accent: '#000', muted: '#000' };

  function readColors() {
    var style = getComputedStyle(document.documentElement);
    colors.bg = style.getPropertyValue('--bg').trim() || colors.bg;
    colors.accent = style.getPropertyValue('--accent').trim() || colors.accent;
    colors.muted = style.getPropertyValue('--muted').trim() || colors.muted;
  }

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    var w = window.innerWidth;
    var h = window.innerHeight;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(w / cellW) + 1;
    rows = Math.ceil(h / cellH) + 1;
    draw();
  }

  var freqY = 0.22;
  var ampX = cellW * 0.9;
  var colPhaseShift = 0.3;

  function draw() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);
    ctx.font = '13px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (var x = 0; x < cols; x++) {
      var baseX = x * cellW;

      for (var y = 0; y < rows; y++) {
        var wave = Math.sin(y * freqY + t + x * colPhaseShift);
        var xOffset = wave * ampX;

        var charIndex = Math.abs(Math.round(wave * 2 + y * 0.5)) % chars.length;
        var glyph = chars[charIndex];

        var brightness = (wave + 1) / 2; // 0 (trough) .. 1 (crest)
        var color = brightness > 0.7 ? colors.accent : colors.muted;
        var opacity = 0.05 + brightness * 0.1;

        ctx.fillStyle = color;
        ctx.globalAlpha = opacity;
        ctx.fillText(glyph, baseX + xOffset, y * cellH);
      }
    }
    ctx.globalAlpha = 1;
  }

  function tick(now) {
    if (!lastFrameTime || now - lastFrameTime >= frameInterval) {
      lastFrameTime = now;
      t += 0.04;
      draw();
    }
    timerId = requestAnimationFrame(tick);
  }

  function start() {
    if (timerId !== null) return;
    if (reduceMotionQuery.matches) {
      draw();
      return;
    }
    lastFrameTime = 0;
    timerId = requestAnimationFrame(tick);
  }

  function stop() {
    if (timerId !== null) {
      cancelAnimationFrame(timerId);
      timerId = null;
    }
  }

  var resizeTimer = null;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      stop();
    } else {
      start();
    }
  });

  reduceMotionQuery.addEventListener('change', function () {
    stop();
    draw();
    if (!reduceMotionQuery.matches) start();
  });

  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
      readColors();
      draw();
    });
  }

  window.addEventListener('resize', onResize);

  readColors();
  resize();
  start();
})();
