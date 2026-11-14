/* 前端交互：主题切换 + 首页即时搜索 */
(function () {
  'use strict';

  // ---- 主题切换 ----
  var root = document.documentElement;
  var toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.dataset.theme === 'light' ? 'dark' : 'light';
      root.dataset.theme = next;
      try {
        localStorage.setItem('theme', next);
      } catch (e) {}
    });
  }

  // ---- 首页搜索：本地过滤文章卡片 ----
  var input = document.getElementById('search');
  var grid = document.getElementById('post-grid');
  var empty = document.getElementById('empty');
  if (!input || !grid) return;

  var cards = Array.prototype.slice.call(grid.querySelectorAll('.card'));

  function apply() {
    var q = input.value.trim().toLowerCase();
    var shown = 0;
    cards.forEach(function (card) {
      var hay = card.dataset.search || '';
      var hit = !q || hay.indexOf(q) !== -1;
      card.hidden = !hit;
      if (hit) shown++;
    });
    if (empty) empty.hidden = shown !== 0;
  }

  input.addEventListener('input', apply);

  // 键盘按 "/" 快速聚焦搜索框
  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && document.activeElement !== input) {
      e.preventDefault();
      input.focus();
    }
  });

  apply();
})();
