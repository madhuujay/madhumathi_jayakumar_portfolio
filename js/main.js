/* =====================================================================
   Madhumathi Jayakumar — Portfolio interactions
   - Theme toggle (persisted)
   - Sticky nav shadow + mobile menu
   - Scroll reveal
   - Case-study rail active-link tracking (scrollspy)
   - Footer year
   ===================================================================== */
(function () {
  "use strict";

  /* ---------- Theme ---------- */
  var root = document.documentElement;
  var STORE_KEY = "mj-theme";

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem(STORE_KEY, theme); } catch (e) {}
  }

  (function initTheme() {
    var saved;
    try { saved = localStorage.getItem(STORE_KEY); } catch (e) {}
    if (saved === "light" || saved === "dark") {
      applyTheme(saved);
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      applyTheme("dark");
    } else {
      applyTheme("light");
    }
  })();

  var toggle = document.getElementById("themeToggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
    });
  }

  /* ---------- Nav: scroll shadow ---------- */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Nav: mobile menu ---------- */
  var burger = document.getElementById("burger");
  var navLinks = document.getElementById("navLinks");
  if (burger && nav) {
    burger.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }
  if (navLinks) {
    navLinks.addEventListener("click", function (e) {
      if (e.target.tagName === "A") nav.classList.remove("is-open");
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- Case-study rail scrollspy ---------- */
  var railLinks = document.querySelectorAll(".cs-rail a[href^='#']");
  var steps = document.querySelectorAll(".cs-step[id]");
  if (railLinks.length && steps.length && "IntersectionObserver" in window) {
    var linkFor = {};
    railLinks.forEach(function (a) {
      linkFor[a.getAttribute("href").slice(1)] = a;
    });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          railLinks.forEach(function (a) { a.classList.remove("is-active"); });
          var active = linkFor[entry.target.id];
          if (active) active.classList.add("is-active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    steps.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Contact form → mailto compose ---------- */
  var cform = document.getElementById("cform");
  if (cform) {
    cform.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = (document.getElementById("cf-name").value || "").trim();
      var email = (document.getElementById("cf-email").value || "").trim();
      var msg = (document.getElementById("cf-msg").value || "").trim();
      var subject = "Portfolio enquiry from " + (name || "someone");
      var body = msg + "\n\n— " + name + (email ? " (" + email + ")" : "");
      window.location.href =
        "mailto:madhumathija@gmail.com?subject=" +
        encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
