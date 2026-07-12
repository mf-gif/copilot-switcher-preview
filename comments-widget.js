/**
 * SceneOS Platform · Inline Comments Widget
 *
 * Click on any element to leave a comment. Comment opens prefilled GitHub Issue
 * с page URL, element selector, text snippet, и position info.
 *
 * Inject via: <script src="https://sceneos-platform.github.io/sceneos-brand/comments-widget.js" defer></script>
 *
 * Repo: SceneOS-Platform/sceneos-platform
 */
(function () {
  'use strict';

  if (window.__sosCommentsLoaded) return;
  window.__sosCommentsLoaded = true;

  var REPO = 'SceneOS-Platform/sceneos-platform';
  var ISSUE_URL = 'https://github.com/' + REPO + '/issues/new';
  var IS_IFRAME = window.self !== window.top;

  // ───── CSS injection ─────
  var CSS = [
    '.sos-fab{position:fixed;bottom:24px;right:24px;width:52px;height:52px;border-radius:50%;',
    'background:linear-gradient(135deg,#3D7BFF,#6E5BFF);border:none;cursor:pointer;',
    'box-shadow:0 8px 28px rgba(77,125,255,.45);display:grid;place-items:center;',
    'z-index:2147483646;transition:transform .15s ease,background .2s ease;font:inherit}',
    '.sos-fab:hover{transform:scale(1.06)}',
    '.sos-fab.active{background:linear-gradient(135deg,#FBBF24,#FF9A3D)}',
    '.sos-fab svg{width:22px;height:22px;fill:#fff;pointer-events:none}',
    '.sos-fab[data-iframe="1"]{bottom:80px;width:44px;height:44px;opacity:.7}',
    '.sos-fab[data-iframe="1"]:hover{opacity:1}',
    '.sos-fab[data-iframe="1"] svg{width:18px;height:18px}',

    '.sos-toast{position:fixed;top:24px;left:50%;transform:translateX(-50%);',
    'background:rgba(14,14,19,.92);border:1px solid #212129;border-radius:999px;',
    'padding:8px 16px;color:#fff;font:500 13px/1.4 "General Sans","Onest",system-ui,sans-serif;',
    'box-shadow:0 8px 32px rgba(0,0,0,.5);z-index:2147483645;display:none;',
    'align-items:center;gap:10px;backdrop-filter:blur(8px);user-select:none;',
    'pointer-events:none}',
    '.sos-toast.show{display:inline-flex}',
    '.sos-toast .sos-dot{width:8px;height:8px;border-radius:50%;background:#FBBF24;',
    'box-shadow:0 0 12px rgba(251,191,36,.8);animation:sos-pulse 1.4s ease-in-out infinite}',
    '@keyframes sos-pulse{0%,100%{opacity:1}50%{opacity:.4}}',

    'body.sos-active,body.sos-active *{cursor:crosshair !important}',
    '.sos-hover{outline:2px dashed #FBBF24 !important;outline-offset:2px !important;background:rgba(251,191,36,.08) !important}',

    '.sos-bg{position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:2147483647;',
    'display:grid;place-items:center;backdrop-filter:blur(6px);',
    'font-family:"General Sans","Onest",system-ui,-apple-system,sans-serif;color:#fff}',
    '.sos-modal{background:#0e0e13;border:1px solid #212129;border-radius:16px;',
    'padding:24px;max-width:520px;width:92%;box-shadow:0 24px 80px rgba(0,0,0,.6)}',
    '.sos-modal h3{margin:0 0 16px;font-family:"Clash Display","Geologica",system-ui,sans-serif;',
    'font-size:20px;font-weight:600;letter-spacing:-.01em}',
    '.sos-target{background:rgba(255,255,255,.04);border:1px solid #212129;',
    'border-radius:10px;padding:12px 14px;font-family:ui-monospace,SFMono-Regular,monospace;',
    'font-size:12px;color:#C2C2CE;margin-bottom:16px;word-break:break-all;line-height:1.5}',
    '.sos-target strong{color:#fff;font-weight:600;font-family:inherit}',
    '.sos-modal textarea{width:100%;min-height:120px;padding:12px 14px;',
    'background:rgba(255,255,255,.04);border:1px solid #212129;border-radius:10px;',
    'color:#fff;font-family:inherit;font-size:14px;resize:vertical;box-sizing:border-box;',
    'outline:none;line-height:1.5}',
    '.sos-modal textarea:focus{border-color:#4D7DFF}',
    '.sos-modal textarea::placeholder{color:#82828F}',
    '.sos-hint{font-size:11px;color:#82828F;margin-top:8px}',
    '.sos-actions{display:flex;gap:8px;justify-content:flex-end;margin-top:18px}',
    '.sos-actions button{padding:10px 16px;border-radius:10px;cursor:pointer;',
    'font-family:inherit;font-size:14px;font-weight:500;border:none;transition:opacity .15s}',
    '.sos-cancel{background:transparent;color:#82828F;border:1px solid #212129 !important}',
    '.sos-cancel:hover{color:#fff;border-color:#82828F !important}',
    '.sos-submit{background:linear-gradient(135deg,#3D7BFF,#6E5BFF);color:#fff}',
    '.sos-submit:hover{opacity:.92}',
    '.sos-submit:disabled{opacity:.4;cursor:not-allowed}'
  ].join('');

  var style = document.createElement('style');
  style.id = 'sos-comments-style';
  style.textContent = CSS;
  document.head.appendChild(style);

  // ───── Selector builder ─────
  function getSelector(el) {
    if (!el || el === document.body) return 'body';
    if (el.id) return '#' + el.id;
    var parts = [];
    var cur = el;
    while (cur && cur !== document.body && parts.length < 4) {
      var name = cur.tagName ? cur.tagName.toLowerCase() : '';
      if (cur.className && typeof cur.className === 'string') {
        var cls = cur.className.split(/\s+/)
          .filter(function (c) { return c && c.indexOf('sos-') !== 0; })
          .slice(0, 2).join('.');
        if (cls) name += '.' + cls;
      }
      var parent = cur.parentNode;
      if (parent && parent.children && parent.children.length > 1) {
        var siblings = Array.prototype.filter.call(parent.children, function (s) {
          return s.tagName === cur.tagName;
        });
        if (siblings.length > 1) {
          var idx = siblings.indexOf(cur) + 1;
          name += ':nth-of-type(' + idx + ')';
        }
      }
      parts.unshift(name);
      cur = parent;
    }
    return parts.join(' > ');
  }

  function getTextSnippet(el) {
    var text = (el.textContent || '').replace(/\s+/g, ' ').trim();
    return text.slice(0, 140);
  }

  function pagePath() {
    var p = window.location.pathname;
    // Pull last 2-3 segments for context
    var parts = p.split('/').filter(Boolean);
    return parts.slice(-2).join('/') || 'index';
  }

  // ───── FAB ─────
  var fab = document.createElement('button');
  fab.className = 'sos-fab';
  fab.type = 'button';
  fab.title = 'Leave a comment on this page (click element, write, opens GitHub Issue)';
  fab.setAttribute('aria-label', 'Add comment');
  if (IS_IFRAME) fab.setAttribute('data-iframe', '1');
  fab.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>' +
    '</svg>';
  document.body.appendChild(fab);

  var active = false;
  var lastHover = null;

  // Persistent indicator
  var toast = document.createElement('div');
  toast.className = 'sos-toast';
  toast.innerHTML = '<span class="sos-dot"></span>Comment mode · click element · ESC or 💬 to exit';
  document.body.appendChild(toast);

  function setActive(on) {
    active = on;
    document.body.classList.toggle('sos-active', on);
    fab.classList.toggle('active', on);
    toast.classList.toggle('show', on);
    if (!on && lastHover) {
      lastHover.classList.remove('sos-hover');
      lastHover = null;
    }
  }

  fab.addEventListener('click', function (e) {
    e.stopPropagation();
    e.preventDefault();
    setActive(!active);
  });

  document.addEventListener('mouseover', function (e) {
    if (!active) return;
    var el = e.target;
    if (el === fab || (el.closest && el.closest('.sos-fab, .sos-bg'))) return;
    if (lastHover) lastHover.classList.remove('sos-hover');
    el.classList.add('sos-hover');
    lastHover = el;
  });

  document.addEventListener('click', function (e) {
    if (!active) return;
    var el = e.target;
    if (el === fab || (el.closest && el.closest('.sos-fab, .sos-bg'))) return;
    e.preventDefault();
    e.stopPropagation();
    // Keep mode active across multiple comments — user explicitly exits via FAB or ESC (когда modal закрыт)
    if (lastHover) { lastHover.classList.remove('sos-hover'); lastHover = null; }
    openModal(el);
  }, true);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && active) setActive(false);
  });

  // ───── Modal ─────
  function openModal(targetEl) {
    var selector = getSelector(targetEl);
    var snippet = getTextSnippet(targetEl);
    var rect = targetEl.getBoundingClientRect();
    var url = window.location.href;
    var path = pagePath();

    var bg = document.createElement('div');
    bg.className = 'sos-bg';
    var snippetRow = snippet
      ? '<div style="margin-top:6px"><strong>Text:</strong> &ldquo;' + escapeHtml(snippet) +
        (snippet.length >= 140 ? '&hellip;' : '') + '&rdquo;</div>'
      : '';
    bg.innerHTML =
      '<div class="sos-modal" role="dialog" aria-modal="true">' +
      '<h3>Comment on this element</h3>' +
      '<div class="sos-target">' +
      '<div><strong>Page:</strong> ' + escapeHtml(path) + '</div>' +
      '<div style="margin-top:6px"><strong>Element:</strong> ' + escapeHtml(selector) + '</div>' +
      snippetRow +
      '</div>' +
      '<textarea placeholder="Что не так / что поправить? Можно по-русски."></textarea>' +
      '<div class="sos-hint">⌘/Ctrl + Enter — submit · ESC — cancel</div>' +
      '<div class="sos-actions">' +
      '<button type="button" class="sos-cancel">Cancel</button>' +
      '<button type="button" class="sos-submit">Open GitHub Issue →</button>' +
      '</div>' +
      '</div>';
    document.body.appendChild(bg);

    var modal = bg.querySelector('.sos-modal');
    var textarea = bg.querySelector('textarea');
    setTimeout(function () { textarea.focus(); }, 50);

    function close() {
      bg.remove();
      document.removeEventListener('keydown', escHandler);
    }
    function escHandler(e) {
      if (e.key === 'Escape') close();
    }
    document.addEventListener('keydown', escHandler);

    bg.addEventListener('click', function (e) {
      if (e.target === bg) close();
    });
    modal.addEventListener('click', function (e) { e.stopPropagation(); });
    bg.querySelector('.sos-cancel').addEventListener('click', close);

    function submit() {
      var comment = textarea.value.trim();
      if (!comment) {
        textarea.focus();
        return;
      }
      var titlePreview = comment.slice(0, 60).replace(/\s+/g, ' ');
      var title = '[' + path + '] ' + titlePreview + (comment.length > 60 ? '…' : '');
      var body = [
        '**Page URL:** ' + url,
        '**Element selector:** `' + selector + '`',
        snippet ? '**Element text:** "' + snippet + (snippet.length >= 140 ? '…' : '') + '"' : '',
        '**Position:** ' + Math.round(rect.left) + ', ' + Math.round(rect.top) +
        ' (' + Math.round(rect.width) + '×' + Math.round(rect.height) + ')',
        '',
        '---',
        '',
        comment
      ].filter(Boolean).join('\n');

      var issueUrl = ISSUE_URL +
        '?title=' + encodeURIComponent(title) +
        '&body=' + encodeURIComponent(body) +
        '&labels=feedback';
      window.open(issueUrl, '_blank', 'noopener');
      close();
    }

    bg.querySelector('.sos-submit').addEventListener('click', submit);
    textarea.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') submit();
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
})();
