/* =========================================================
   Level Up K with MiAe Ssem — app.js
   ---------------------------------------------------------
   ★ KDP 음원 비밀번호는 아래 CONFIG.audioPassword 에서 바꿉니다.
   ★ 음원 파일은 audio 폴더에 넣고, CONFIG.tracks 에 파일 이름을 적습니다.
   ========================================================= */
(function () {
  "use strict";

  var CONFIG = {
    audioPassword: "sebome2027",
    /* 결제: Stripe/STORES 결제 링크와 QR 이미지 (GUIDE_KO.md 8장 참고) */
    checkoutUrl: "",   /* 예: "https://buy.stripe.com/xxxx" 또는 STORES 상품 URL */
    checkoutQr: "",    /* 예: "assets/payment-qr.png" */
    tracks: [
      {
        src: "audio/sample.wav",
        sample: true,
        title: {
          ja: "サンプル音声（プレーヤーの動作確認用）",
          en: "Sample audio (to test the player)",
          ko: "샘플 음원 (재생 확인용)"
        }
      },
      { src: "audio/lesson01.mp3", title: { ja: "第1課", en: "Lesson 1", ko: "제1과" } },
      { src: "audio/lesson02.mp3", title: { ja: "第2課", en: "Lesson 2", ko: "제2과" } },
      { src: "audio/lesson03.mp3", title: { ja: "第3課", en: "Lesson 3", ko: "제3과" } }
    ]
  };

  var LANG_KEY = "levelupk_lang";
  var SPLASH_KEY = "levelupk_splash_seen";
  var AUDIO_KEY = "levelupk_audio_ok";
  var VIEWS = ["home", "books", "audio", "sebome", "online", "profile"];

  var lang = "ja";
  var currentTrack = -1;

  /* ---------- helpers ---------- */
  function t(key) {
    var dict = (window.I18N && window.I18N[lang]) || {};
    return key.split(".").reduce(function (obj, part) {
      return obj && obj[part] !== undefined ? obj[part] : undefined;
    }, dict);
  }

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function safeGet(store, key) {
    try { return store.getItem(key); } catch (e) { return null; }
  }
  function safeSet(store, key, value) {
    try { store.setItem(key, value); } catch (e) {}
  }

  /* ---------- language ---------- */
  function normalizeLang(value) {
    if (value === "en" || value === "ko" || value === "ja") return value;
    return "ja";
  }

  function applyLang(next, opts) {
    lang = normalizeLang(next);
    var dict = window.I18N[lang];
    if (!dict) return;

    document.documentElement.lang = lang;

    $$("[data-i18n]").forEach(function (el) {
      var value = t(el.getAttribute("data-i18n"));
      if (typeof value === "string") el.textContent = value;
    });

    $$("[data-i18n-placeholder]").forEach(function (el) {
      var value = t(el.getAttribute("data-i18n-placeholder"));
      if (typeof value === "string") el.setAttribute("placeholder", value);
    });

    $$("[data-i18n-alt]").forEach(function (el) {
      var value = t(el.getAttribute("data-i18n-alt"));
      if (typeof value === "string") el.setAttribute("alt", value);
    });

    if (dict.meta) {
      document.title = dict.meta.title;
      var desc = $('meta[name="description"]');
      if (desc) desc.setAttribute("content", dict.meta.desc);
    }

    $$(".lang__btn").forEach(function (btn) {
      var active = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });

    updateTrackLabels();

    if (!opts || !opts.silent) safeSet(window.localStorage, LANG_KEY, lang);
  }

  /* ---------- routing ---------- */
  function currentView() {
    var hash = (location.hash || "").replace("#", "");
    return VIEWS.indexOf(hash) !== -1 ? hash : "home";
  }

  var initialRoute = true;

  function showView(id, focusHeading) {
    var target = VIEWS.indexOf(id) !== -1 ? id : "home";
    $$(".view").forEach(function (view) {
      view.classList.toggle("is-active", view.getAttribute("data-view") === target);
    });

    if (!initialRoute) {
      window.scrollTo({ top: 0, behavior: "auto" });
    }

    if (focusHeading) {
      var heading = $('#' + target + ' h2[tabindex="-1"], #' + target + ' h1');
      if (heading) {
        try { heading.focus({ preventScroll: true }); } catch (e) { heading.focus(); }
      }
    }
    initialRoute = false;
  }

  function route(focusHeading) {
    showView(currentView(), focusHeading);
  }

  /* ---------- splash ---------- */
  function initSplash() {
    var splash = $("#splash");
    if (!splash) return;

    var skipped = document.documentElement.classList.contains("splash-skip");
    if (skipped) {
      finishImmediately(splash);
      return;
    }

    document.body.classList.add("splash-lock");
    var done = false;
    var timer = window.setTimeout(dismiss, 1800);

    function dismiss() {
      if (done) return;
      done = true;
      window.clearTimeout(timer);
      safeSet(window.sessionStorage, SPLASH_KEY, "1");
      splash.classList.add("is-leaving");
      document.body.classList.remove("splash-lock");
      window.setTimeout(function () {
        splash.setAttribute("hidden", "");
      }, 650);
      document.removeEventListener("keydown", onKey);
      splash.removeEventListener("click", onClick);
    }

    function onClick(event) {
      if (event.target && event.target.closest && event.target.closest(".splash__skip")) return;
      dismiss();
    }

    function onKey(event) {
      if (event.key === "Enter" || event.key === " " || event.key === "Escape") {
        event.preventDefault();
        dismiss();
      }
    }

    splash.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    var skipBtn = $("#splash-skip");
    if (skipBtn) skipBtn.addEventListener("click", dismiss);
  }

  function finishImmediately(splash) {
    splash.setAttribute("hidden", "");
    document.body.classList.remove("splash-lock");
  }

  /* ---------- audio gate + player ---------- */
  var player = { audio: null, rows: [] };

  function unlockAudio(animate) {
    var gate = $("#audio-gate");
    var hint = $(".hint");
    var panel = $("#audio-player");
    if (!panel) return;

    if (gate) gate.setAttribute("hidden", "");
    if (hint) hint.setAttribute("hidden", "");
    panel.removeAttribute("hidden");
    safeSet(window.sessionStorage, AUDIO_KEY, "1");

    if (!player.rows.length) buildTracks();

    if (animate) {
      var heading = panel.querySelector("h3");
      if (heading) {
        heading.setAttribute("tabindex", "-1");
        try { heading.focus({ preventScroll: true }); } catch (e) { heading.focus(); }
      }
    }
  }

  function buildTracks() {
    var list = $("#track-list");
    if (!list) return;
    list.innerHTML = "";
    player.rows = [];

    CONFIG.tracks.forEach(function (track, index) {
      var li = document.createElement("li");
      li.className = "track";
      li.dataset.index = String(index);

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "track__play";
      btn.setAttribute("aria-label", t("audio.playLabel"));
      btn.innerHTML = iconPlay();

      var main = document.createElement("div");
      main.className = "track__main";

      var title = document.createElement("p");
      title.className = "track__title";
      var titleText = document.createElement("span");
      titleText.className = "track__name";
      title.appendChild(titleText);
      if (track.sample) {
        var badge = document.createElement("span");
        badge.className = "badge";
        badge.dataset.role = "sample-badge";
        title.appendChild(badge);
      }

      var bar = document.createElement("div");
      bar.className = "track__bar";
      var fill = document.createElement("span");
      bar.appendChild(fill);

      main.appendChild(title);
      main.appendChild(bar);

      var meta = document.createElement("div");
      meta.className = "track__meta";
      var time = document.createElement("span");
      time.className = "track__time";
      time.textContent = "0:00";
      var state = document.createElement("span");
      state.className = "track__state";
      meta.appendChild(time);
      meta.appendChild(state);

      li.appendChild(btn);
      li.appendChild(main);
      li.appendChild(meta);
      list.appendChild(li);

      btn.addEventListener("click", function () { toggleTrack(index); });
      player.rows.push({ li: li, btn: btn, name: titleText, badge: badge || null, fill: fill, time: time, state: state });
    });

    updateTrackLabels();
  }

  function updateTrackLabels() {
    if (!player.rows.length) return;
    CONFIG.tracks.forEach(function (track, index) {
      var row = player.rows[index];
      if (!row) return;
      row.name.textContent = track.title[lang] || track.title.ja;
      if (row.badge) row.badge.textContent = t("audio.sample") || "Sample";
      if (row.li.dataset.state === "error") row.state.textContent = t("audio.ready") || "Coming soon";
      row.btn.setAttribute("aria-label", t("audio.playLabel") || "Play");
    });
  }

  function ensureAudio() {
    if (player.audio) return player.audio;
    var audio = new Audio();
    audio.preload = "none";
    audio.addEventListener("timeupdate", function () {
      var row = player.rows[currentTrack];
      if (!row || !audio.duration || !isFinite(audio.duration)) return;
      var ratio = audio.currentTime / audio.duration;
      row.fill.style.width = Math.min(100, Math.max(0, ratio * 100)) + "%";
      row.time.textContent = formatTime(audio.currentTime) + " / " + formatTime(audio.duration);
    });
    audio.addEventListener("ended", function () {
      var row = player.rows[currentTrack];
      if (row) {
        row.btn.innerHTML = iconPlay();
        row.btn.setAttribute("aria-label", t("audio.playLabel") || "Play");
        row.li.classList.remove("is-playing");
        row.fill.style.width = "0%";
        row.time.textContent = "0:00";
      }
      audio.pause();
    });
    audio.addEventListener("error", function () {
      var row = player.rows[currentTrack];
      if (!row) return;
      markError(row);
      row.li.classList.remove("is-playing");
      row.btn.innerHTML = iconPlay();
      try { player.audio.pause(); } catch (e) {}
    });
    player.audio = audio;
    return audio;
  }

  function markError(row) {
    row.li.dataset.state = "error";
    row.state.textContent = t("audio.ready") || "Coming soon";
    row.btn.setAttribute("aria-disabled", "true");
  }

  function toggleTrack(index) {
    var row = player.rows[index];
    var track = CONFIG.tracks[index];
    if (!row || !track) return;
    if (row.li.dataset.state === "error") return;

    var audio = ensureAudio();

    if (currentTrack === index && !audio.paused) {
      audio.pause();
      row.btn.innerHTML = iconPlay();
      row.btn.setAttribute("aria-label", t("audio.playLabel") || "Play");
      row.li.classList.remove("is-playing");
      return;
    }

    if (currentTrack !== index) {
      var prev = player.rows[currentTrack];
      if (prev) {
        prev.btn.innerHTML = iconPlay();
        prev.li.classList.remove("is-playing");
        prev.fill.style.width = "0%";
        prev.time.textContent = "0:00";
      }
      currentTrack = index;
      audio.src = track.src;
    }

    var playPromise = audio.play();
    row.btn.innerHTML = iconPause();
    row.btn.setAttribute("aria-label", t("audio.pauseLabel") || "Pause");
    row.li.classList.add("is-playing");

    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {
        if (row.li.dataset.state !== "error") {
          row.li.classList.remove("is-playing");
          row.btn.innerHTML = iconPlay();
        }
      });
    }
  }

  function formatTime(sec) {
    if (!isFinite(sec) || sec < 0) sec = 0;
    var m = Math.floor(sec / 60);
    var s = Math.floor(sec % 60);
    return m + ":" + (s < 10 ? "0" + s : s);
  }

  function iconPlay() {
    return '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M8 5.2v13.6c0 .8.9 1.3 1.6.9l10.2-6.8c.6-.4.6-1.3 0-1.7L9.6 4.3C8.9 3.9 8 4.4 8 5.2z"/></svg>';
  }
  function iconPause() {
    return '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><rect x="6.5" y="5" width="4" height="14" rx="1.2"/><rect x="13.5" y="5" width="4" height="14" rx="1.2"/></svg>';
  }

  function initAudio() {
    var form = $("#audio-gate");
    if (!form) return;

    var input = $("#audio-pass");
    var error = $("#audio-error");

    if (safeGet(window.sessionStorage, AUDIO_KEY) === "1") {
      unlockAudio(false);
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var value = (input.value || "").trim();
      var ok = value === CONFIG.audioPassword || value.toLowerCase() === CONFIG.audioPassword.toLowerCase();

      if (ok) {
        if (error) error.setAttribute("hidden", "");
        input.classList.remove("is-error");
        input.value = "";
        unlockAudio(true);
        return;
      }

      if (error) error.removeAttribute("hidden");
      input.classList.add("is-error");
      try { input.focus({ preventScroll: true }); } catch (e) { input.focus(); }
      window.setTimeout(function () { input.classList.remove("is-error"); }, 900);
    });
  }

  /* ---------- checkout ---------- */
  function initCheckout() {
    var link = $("#checkout-link");
    var box = document.querySelector("[data-qr-box]");

    if (box && CONFIG.checkoutQr) {
      var img = document.createElement("img");
      img.src = CONFIG.checkoutQr;
      img.alt = "";
      box.innerHTML = "";
      box.appendChild(img);
      box.classList.add("has-img");
    }

    if (!link) return;
    if (CONFIG.checkoutUrl) {
      link.setAttribute("href", CONFIG.checkoutUrl);
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener");
    } else {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        var note = link.parentNode.querySelector(".small");
        if (note) {
          note.classList.add("is-on");
          window.setTimeout(function () { note.classList.remove("is-on"); }, 2200);
        }
      });
    }
  }

  /* ---------- boot ---------- */
  function boot() {
    var saved = safeGet(window.localStorage, LANG_KEY);
    applyLang(saved || "ja", { silent: true });

    $$(".lang__btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyLang(btn.getAttribute("data-lang"));
      });
    });

    var page = null;
    try { page = new URLSearchParams(location.search).get("page"); } catch (e) {}
    if (page === "audio" && location.hash !== "#audio") {
      try { history.replaceState(null, "", location.pathname + "#audio"); } catch (e) { location.hash = "audio"; }
    }

    window.addEventListener("hashchange", function () { route(true); });
    route(false);

    initSplash();
    initAudio();
    initCheckout();

    var brand = $(".brand");
    if (brand) {
      brand.addEventListener("click", function () {
        if (currentView() !== "home") return;
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
