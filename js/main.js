/* =========================================================================
   Beulah Divya Kannan — Portfolio interactions
   ========================================================================= */
(() => {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(hover: none)").matches;
  const $  = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

  /* ---------------------------------------------------------------------
     Year stamp
  --------------------------------------------------------------------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------------------
     Rotating hero headline
  --------------------------------------------------------------------- */
  const headline = $("#headline");
  const HEADLINES = window.__HEADLINES__ || [];
  if (headline && HEADLINES.length > 1 && !prefersReduced) {
    let hi = 0;
    setInterval(() => {
      headline.classList.add("swapping");
      setTimeout(() => {
        hi = (hi + 1) % HEADLINES.length;
        headline.innerHTML = HEADLINES[hi];
        headline.classList.remove("swapping");
      }, 450);
    }, 3800);
  }

  /* ---------------------------------------------------------------------
     Scroll progress bar
  --------------------------------------------------------------------- */
  const progress = $("#progress");
  const onScrollProgress = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    if (progress) progress.style.width = pct + "%";
  };

  /* ---------------------------------------------------------------------
     Nav: blur-on-scroll + active section highlight + mobile toggle
  --------------------------------------------------------------------- */
  const nav = $("#nav");
  const onScrollNav = () => {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 24);
  };

  const navLinks = $$(".nav-link");
  const sections = navLinks
    .map((l) => document.getElementById(l.getAttribute("href").slice(1)))
    .filter(Boolean);

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const id = e.target.id;
          navLinks.forEach((l) =>
            l.classList.toggle("active", l.getAttribute("href") === "#" + id)
          );
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => spy.observe(s));

  // Mobile menu
  const burger = $("#burger");
  const mobileMenu = $("#mobile-menu");
  if (burger && mobileMenu) {
    burger.addEventListener("click", () => {
      const open = mobileMenu.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
      burger.classList.toggle("is-open", open);
    });
    $$("a", mobileMenu).forEach((a) =>
      a.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
        burger.classList.remove("is-open");
      })
    );
  }

  /* ---------------------------------------------------------------------
     Scroll reveal
  --------------------------------------------------------------------- */
  const revealEls = $$(".reveal, .accent-underline");
  if (prefersReduced) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const ro = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => ro.observe(el));
  }

  /* ---------------------------------------------------------------------
     Animated metric counters
  --------------------------------------------------------------------- */
  const fmt = (v, decimals) =>
    decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString();

  const runCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = (el.dataset.count.split(".")[1] || "").length;
    const dur = 1500;
    const start = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      el.textContent = fmt(target * ease(t), decimals);
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = fmt(target, decimals);
    };
    requestAnimationFrame(tick);
  };

  const counters = $$("[data-count]");
  if (prefersReduced) {
    counters.forEach((el) => {
      const d = (el.dataset.count.split(".")[1] || "").length;
      el.textContent = fmt(parseFloat(el.dataset.count), d);
    });
  } else {
    const co = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            runCount(e.target);
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => co.observe(el));
  }

  /* ---------------------------------------------------------------------
     Cursor spotlight on background
  --------------------------------------------------------------------- */
  const spotlight = $("#spotlight");
  if (spotlight && !isTouch && !prefersReduced) {
    let raf = null;
    window.addEventListener("pointermove", (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        spotlight.style.setProperty("--mx", e.clientX + "px");
        spotlight.style.setProperty("--my", e.clientY + "px");
        raf = null;
      });
    });
  }

  /* ---------------------------------------------------------------------
     Magnetic buttons
  --------------------------------------------------------------------- */
  if (!isTouch && !prefersReduced) {
    $$("[data-magnetic]").forEach((el) => {
      const strength = parseFloat(el.dataset.magnetic) || 0.3;
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
      el.addEventListener("pointerleave", () => {
        el.style.transform = "translate(0,0)";
      });
    });
  }

  /* ---------------------------------------------------------------------
     Case cards: hover glow tracking
  --------------------------------------------------------------------- */
  if (!isTouch) {
    $$(".case-card").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--cx", ((e.clientX - r.left) / r.width) * 100 + "%");
        card.style.setProperty("--cy", ((e.clientY - r.top) / r.height) * 100 + "%");
      });
    });
  }

  /* ---------------------------------------------------------------------
     Gallery filter
  --------------------------------------------------------------------- */
  const tabs = $$(".tab");
  const cards = $$(".case-card");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const f = tab.dataset.filter;
      cards.forEach((c) => {
        const match = f === "all" || (c.dataset.tags || "").includes(f);
        c.classList.toggle("is-hidden", !match);
      });
    });
  });

  /* ---------------------------------------------------------------------
     Case modal
  --------------------------------------------------------------------- */
  const modal = $("#modal");
  const modalPanel = $("#modal-panel");
  let lastFocused = null;

  const CASES = window.__CASES__ || {};

  const openModal = (key) => {
    const data = CASES[key];
    if (!data || !modal || !modalPanel) return;
    lastFocused = document.activeElement;

    modalPanel.innerHTML = `
      <div class="console-bar">
        <span class="console-dot" style="background:#ff5f57"></span>
        <span class="console-dot" style="background:#febc2e"></span>
        <span class="console-dot" style="background:#28c840"></span>
        <span class="font-mono text-[12px] tracking-wide ml-3" style="color:var(--muted)">${data.org}</span>
        <button id="modal-close" aria-label="Close" class="ml-auto text-[var(--muted)] hover:text-[var(--lime)] transition text-xl leading-none">&times;</button>
      </div>
      <div class="p-6 sm:p-8">
        <p class="eyebrow mb-3">${data.org} · ${data.period}</p>
        <h3 class="text-2xl sm:text-3xl font-bold tracking-tight mb-1">${data.title}</h3>
        <p class="font-mono text-sm mb-6" style="color:var(--cyan)">${data.role}</p>

        ${
          data.summary
            ? `<p class="text-[15px] sm:text-base leading-relaxed mb-7 pl-4 border-l-2" style="border-color:var(--lime); color:var(--text)">${data.summary}</p>`
            : ""
        }

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
          ${data.metrics
            .map(
              (m) => `
            <div class="panel p-4 text-center">
              <div class="metric"><span class="num text-2xl sm:text-3xl">${m.v}</span></div>
              <p class="font-mono text-[10px] mt-2 leading-tight" style="color:var(--muted)">${m.l}</p>
            </div>`
            )
            .join("")}
        </div>

        <ul class="space-y-3 mb-7">
          ${data.points
            .map(
              (p) => `
            <li class="flex gap-3 text-[15px] leading-relaxed" style="color:var(--text)">
              <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style="background:var(--lime)"></span>
              <span>${p}</span>
            </li>`
            )
            .join("")}
        </ul>

        <div class="flex flex-wrap gap-2">
          ${data.stack.map((s) => `<span class="chip">${s}</span>`).join("")}
        </div>

        ${
          data.link
            ? `<a href="${data.link}" target="_blank" rel="noopener" class="btn btn-ghost mt-7 text-[13px]">
                 View repository
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7m0 0H8m9 0v9"/></svg>
               </a>`
            : ""
        }
      </div>`;

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    const closeBtn = $("#modal-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", closeModal);
      closeBtn.focus();
    }
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  };

  $$(".case-card").forEach((card) => {
    const open = () => openModal(card.dataset.case);
    card.addEventListener("click", open);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    });
  });

  if (modal) {
    $(".modal-backdrop", modal)?.addEventListener("click", closeModal);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
    });
  }

  /* ---------------------------------------------------------------------
     Contact form -> mailto
  --------------------------------------------------------------------- */
  const form = $("#contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = $("#cf-name").value.trim();
      const email = $("#cf-email").value.trim();
      const message = $("#cf-message").value.trim();
      const subject = encodeURIComponent(`Portfolio inquiry — ${name || "Hello"}`);
      const body = encodeURIComponent(
        `${message}\n\n— ${name}\n${email}`
      );
      window.location.href = `mailto:beulahdivya11@gmail.com?subject=${subject}&body=${body}`;

      const status = $("#cf-status");
      if (status) {
        status.textContent = "Opening your email client…";
        setTimeout(() => (status.textContent = ""), 5000);
      }
    });
  }

  /* ---------------------------------------------------------------------
     Single scroll listener (rAF-throttled)
  --------------------------------------------------------------------- */
  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        onScrollProgress();
        onScrollNav();
        ticking = false;
      });
    },
    { passive: true }
  );
  onScrollProgress();
  onScrollNav();
})();
