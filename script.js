/**
 * tuesday-of-loyalty · script.js
 * Khaldoun A Akramah — Interactive Engine
 * Glow Cursor · Scroll Progress · Parallax · Reveal
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────
     1. GLOW CURSOR
  ───────────────────────────────────────── */
  const cursorGlow = document.getElementById('cursorGlow');
  let mouseX = -300, mouseY = -300;
  let cursorX = -300, cursorY = -300;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  document.addEventListener('mouseleave', () => {
    cursorGlow.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursorGlow.style.opacity = '1';
  });

  // Smooth cursor follow
  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.08;
    cursorY += (mouseY - cursorY) * 0.08;
    cursorGlow.style.left = cursorX + 'px';
    cursorGlow.style.top  = cursorY + 'px';
    requestAnimationFrame(animateCursor);
  }

  animateCursor();

  // Expand cursor on interactive elements
  const interactives = document.querySelectorAll('a, button, .scene-image-wrap');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorGlow.style.width  = '400px';
      cursorGlow.style.height = '400px';
      cursorGlow.style.background = 'radial-gradient(circle, rgba(201,165,87,0.18) 0%, transparent 70%)';
    });
    el.addEventListener('mouseleave', () => {
      cursorGlow.style.width  = '280px';
      cursorGlow.style.height = '280px';
      cursorGlow.style.background = 'radial-gradient(circle, rgba(201,165,87,0.12) 0%, transparent 70%)';
    });
  });

  /* ─────────────────────────────────────────
     2. SCROLL PROGRESS BAR
  ───────────────────────────────────────── */
  const scrollProgress = document.getElementById('scrollProgress');

  function updateScrollProgress() {
    const totalHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled     = window.scrollY;
    const progress     = totalHeight > 0 ? (scrolled / totalHeight) * 100 : 0;
    scrollProgress.style.height = progress + '%';
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  /* ─────────────────────────────────────────
     3. REVEAL ON SCROLL (IntersectionObserver)
  ───────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal-up');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay based on order within parent
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal-up'));
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = (idx * 0.1) + 's';
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ─────────────────────────────────────────
     4. PARALLAX IMAGES
  ───────────────────────────────────────── */
  const parallaxImgs = document.querySelectorAll('.parallax-img img');

  function updateParallax() {
    parallaxImgs.forEach(img => {
      const wrap    = img.closest('.scene-image-wrap');
      const panel   = wrap ? wrap.closest('.scene-image-panel') : null;
      if (!panel) return;
      const rect    = panel.getBoundingClientRect();
      const visible = rect.top < window.innerHeight && rect.bottom > 0;
      if (!visible) return;
      const ratio   = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      const offset  = (ratio - 0.5) * 60;
      img.style.transform = `translateY(${offset}px) scale(1.08)`;
    });
  }

  window.addEventListener('scroll', updateParallax, { passive: true });
  updateParallax();

  /* ─────────────────────────────────────────
     5. HERO YEARS COUNTER ANIMATION
  ───────────────────────────────────────── */
  const yearsEl = document.getElementById('yearsCount');
  let counted = false;

  function animateCounter(el, target, duration) {
    let start = 0;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      el.textContent = Math.floor(progress * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  }

  const heroObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !counted) {
      counted = true;
      setTimeout(() => animateCounter(yearsEl, 15, 2000), 800);
    }
  }, { threshold: 0.5 });

  if (yearsEl) heroObserver.observe(yearsEl.closest('.hero'));

  /* ─────────────────────────────────────────
     6. SCENE ACTIVE STATE (Spotlight Pulse)
  ───────────────────────────────────────── */
  const scenes = document.querySelectorAll('.scene');

  const sceneObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.setProperty('--scene-active', '1');
      } else {
        entry.target.style.setProperty('--scene-active', '0');
      }
    });
  }, { threshold: 0.3 });

  scenes.forEach(s => sceneObserver.observe(s));

  /* ─────────────────────────────────────────
     7. SMOOTH ANCHOR SCROLL
  ───────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ─────────────────────────────────────────
     8. SMOKE ANIMATION (Scene 3 placeholder)
  ───────────────────────────────────────── */
  const smokeLayers = document.querySelectorAll('.smoke-layer');
  smokeLayers.forEach((layer, i) => {
    layer.style.animationDelay = (i * 1.5) + 's';
  });

  /* ─────────────────────────────────────────
     9. KEYBOARD NAVIGATION
  ───────────────────────────────────────── */
  const allSections = [
    document.getElementById('hero'),
    ...document.querySelectorAll('.scene')
  ].filter(Boolean);

  let currentSection = 0;
  let isScrolling = false;

  document.addEventListener('keydown', (e) => {
    if (isScrolling) return;

    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      if (currentSection < allSections.length - 1) {
        currentSection++;
        scrollToSection(currentSection);
      }
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      if (currentSection > 0) {
        currentSection--;
        scrollToSection(currentSection);
      }
    }
  });

  function scrollToSection(idx) {
    if (!allSections[idx]) return;
    isScrolling = true;
    allSections[idx].scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => { isScrolling = false; }, 1000);
  }

  /* ─────────────────────────────────────────
     10. TITLE BAR DYNAMIC UPDATE
  ───────────────────────────────────────── */
  const sceneTitles = {
    hero:   'ثلاثاء الوفاء — ٦ أيلول ٢٠١١',
    scene1: 'الصمت الأخير — ثلاثاء الوفاء',
    scene2: 'حمص تخرج — ثلاثاء الوفاء',
    scene3: 'الرصاص — ثلاثاء الوفاء',
    scene4: 'درعا — ثلاثاء الوفاء',
    scene5: 'الشهداء — ثلاثاء الوفاء',
    scene6: 'سوريا تبني — ثلاثاء الوفاء',
  };

  const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        if (sceneTitles[id]) document.title = sceneTitles[id];
      }
    });
  }, { threshold: 0.5 });

  allSections.forEach(s => titleObserver.observe(s));

})();
