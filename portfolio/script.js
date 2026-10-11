
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  var hasGSAP = typeof gsap !== 'undefined';
  var hasScrollTo = typeof ScrollToPlugin !== 'undefined';

  if (hasGSAP && typeof ScrollTrigger !== 'undefined') {
    try { gsap.registerPlugin(ScrollTrigger); } catch (e) {}
    if (hasScrollTo) { try { gsap.registerPlugin(ScrollToPlugin); } catch (e) { hasScrollTo = false; } }
  }

  /* ---------- AOS (guarded) ---------- */
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 900, once: true, offset: 80, disable: reduceMotion });
  }

  /* ---------- Smooth scroll ---------- */
  function safeScrollTo(target, opts) {
    opts = opts || {};
    var duration = opts.duration || 0.9;
    var offsetY = opts.offsetY || 0;

    if (hasGSAP && hasScrollTo && !reduceMotion) {
      try {
        if (typeof target === 'number') {
          gsap.to(window, { duration: duration, scrollTo: target, ease: 'power2.inOut' });
        } else if (target instanceof Element) {
          gsap.to(window, { duration: duration, scrollTo: { y: target, offsetY: offsetY }, ease: 'power2.inOut' });
        }
        return;
      } catch (e) { /* fall through */ }
    }

    var top = 0;
    if (typeof target === 'number') top = target;
    else if (target instanceof Element) top = target.getBoundingClientRect().top + window.pageYOffset - offsetY;
    window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  /* ---------- Typing effect ---------- */
  var typingEl = document.getElementById('typing-text');
  var roles = ['Front-End Developer', 'Full-Stack Developer', 'React Specialist', 'Vue.js Enthusiast', 'UI/UX Minded', 'IT Student'];
  var roleIndex = 0, charIndex = 0, isDeleting = false;

  function typeEffect() {
    if (!typingEl) return;
    var current = roles[roleIndex];

    charIndex += isDeleting ? -1 : 1;
    typingEl.textContent = current.substring(0, charIndex);

    var delay = isDeleting ? 45 : 95;

    if (!isDeleting && charIndex === current.length) {
      isDeleting = true;
      delay = 1500;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 300;
    }
    setTimeout(typeEffect, delay);
  }

  if (typingEl) {
    if (reduceMotion) {
      typingEl.textContent = roles[0];
    } else {
      setTimeout(typeEffect, 800);
    }
  }

  /* ---------- particles.js (guarded + sized) ---------- */
  if (!reduceMotion && typeof particlesJS === 'function' && document.getElementById('particles-js')) {
    var pCount = window.innerWidth < 768 ? 45 : 110;
    particlesJS('particles-js', {
      particles: {
        number: { value: pCount, density: { enable: true, value_area: 1000 } },
        color: { value: ['#8b5cf6', '#06b6d4', '#f59e0b'] },
        shape: { type: ['circle', 'triangle'] },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 150, color: '#8b5cf6', opacity: 0.18, width: 1 },
        move: { enable: true, speed: 2.2, direction: 'none', random: true, straight: false, out_mode: 'out' }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: { enable: !isTouch, mode: ['grab', 'bubble'] },
          onclick: { enable: true, mode: 'push' },
          resize: true
        },
        modes: {
          grab: { distance: 180, line_linked: { opacity: 0.3 } },
          bubble: { distance: 180, size: 7, duration: 2 },
          push: { particles_nb: 3 }
        }
      },
      retina_detect: true
    });
  }

  /* ---------- Three.js background (guarded) ---------- */
  (function initThree() {
    var canvas = document.getElementById('three-bg');
    if (!canvas || typeof THREE === 'undefined' || reduceMotion) return;

    var scene, camera, renderer, mesh, rafId = null;
    var count = window.innerWidth < 768 ? 180 : 420;

    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
    } catch (e) {
      return; // no WebGL — bail silently
    }

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 5;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(window.innerWidth, window.innerHeight);

    var positions = new Float32Array(count * 3);
    for (var i = 0; i < count * 3; i++) positions[i] = (Math.random() - 0.5) * 12;

    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    var mat = new THREE.PointsMaterial({
      size: 0.025,
      color: new THREE.Color(0x8b5cf6),
      transparent: true,
      opacity: 0.75,
      depthWrite: false
    });

    mesh = new THREE.Points(geo, mat);
    scene.add(mesh);

    function animate() {
      rafId = requestAnimationFrame(animate);
      mesh.rotation.x += 0.0006;
      mesh.rotation.y += 0.0011;
      renderer.render(scene, camera);
    }
    animate();

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      } else if (!rafId) {
        animate();
      }
    });

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }, 150);
    });
  })();

  /* ---------- Custom cursor ---------- */
  if (!isTouch && !reduceMotion) {
    var dot = document.querySelector('.cursor-dot');
    var ring = document.querySelector('.cursor-ring');

    if (dot && ring && hasGSAP) {
      var ringX = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' });
      var ringY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' });

      window.addEventListener('mousemove', function (e) {
        gsap.set(dot, { x: e.clientX, y: e.clientY });
        ringX(e.clientX);
        ringY(e.clientY);
      }, { passive: true });

      document.addEventListener('mouseover', function (e) {
        if (e.target.closest('a, button, input, textarea, .framework-icon, .project-card')) {
          ring.classList.add('is-hover');
        }
      });
      document.addEventListener('mouseout', function (e) {
        if (e.target.closest('a, button, input, textarea, .framework-icon, .project-card')) {
          ring.classList.remove('is-hover');
        }
      });

      document.addEventListener('mouseleave', function () {
        gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
      });
      document.addEventListener('mouseenter', function () {
        gsap.to([dot, ring], { opacity: 1, duration: 0.2 });
      });
    }
  }

  /* ---------- Matrix rain (single interval) ---------- */
  (function matrix() {
    var container = document.querySelector('.matrix-rain');
    if (!container || reduceMotion || isTouch) return;

    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%#&_<>;:';
    var MAX_NODES = 45;
    var timer = null;

    function spawn() {
      if (container.childElementCount >= MAX_NODES) return;
      var el = document.createElement('span');
      el.className = 'matrix-char';
      el.textContent = chars.charAt(Math.floor(Math.random() * chars.length));
      el.style.left = Math.random() * 100 + 'vw';
      el.style.animationDuration = (Math.random() * 3 + 4) + 's';
      container.appendChild(el);
      el.addEventListener('animationend', function () { el.remove(); });
    }

    function start() { if (!timer) timer = setInterval(spawn, 180); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    start();
    document.addEventListener('visibilitychange', function () {
      document.hidden ? stop() : start();
    });
  })();

  /* ---------- Magnetic buttons (delegated) ---------- */
  if (hasGSAP && !isTouch && !reduceMotion) {
    document.addEventListener('mousemove', function (e) {
      var btn = e.target.closest('.magnetic-btn');
      if (!btn) return;
      var rect = btn.getBoundingClientRect();
      var x = e.clientX - rect.left - rect.width / 2;
      var y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, { duration: 0.3, x: x * 0.18, y: y * 0.18, ease: 'power2.out' });
    });

    document.addEventListener('mouseout', function (e) {
      var btn = e.target.closest('.magnetic-btn');
      if (!btn) return;
      gsap.to(btn, { duration: 0.35, x: 0, y: 0, ease: 'power2.out' });
    });
  }

  /* ---------- Projects (static Tailwind classes) ---------- */
  var PALETTE = {
    primary: {
      grad: 'from-primary-500 to-primary-700',
      text: 'text-primary-400 group-hover:text-primary-300',
      chip: 'bg-primary-500/10 border-primary-500/20 text-primary-400'
    },
    secondary: {
      grad: 'from-secondary-500 to-secondary-700',
      text: 'text-secondary-400 group-hover:text-secondary-300',
      chip: 'bg-secondary-500/10 border-secondary-500/20 text-secondary-400'
    },
    accent: {
      grad: 'from-amber-500 to-orange-600',
      text: 'text-amber-400 group-hover:text-amber-300',
      chip: 'bg-amber-500/10 border-amber-500/20 text-amber-400'
    }
  };

  var projects = [
    {
      title: 'Tourism Website',
      description: 'Discover Mabini, Batangas — a responsive tourism site showcasing local attractions with modern design and 3D touches.',
      tags: ['React', 'Three.js', 'GSAP', 'Tailwind'],
      link: 'https://tourism-website-mu-three.vercel.app/',
      color: 'primary'
    },
    {
      title: 'Ordering System',
      description: 'Interactive cookie ordering system with cart functionality, glassmorphism UI and real-time feedback animations.',
      tags: ['Vue.js', 'Vuex', 'Canvas', 'WebGL'],
      link: 'https://ordering-system-gray.vercel.app/',
      color: 'secondary'
    },
    {
      title: 'Furniture E-commerce',
      description: 'Modern furniture storefront with 3D product previews, smooth page transitions and a full checkout flow.',
      tags: ['Next.js', 'Three.js', 'Framer', 'Stripe'],
      link: 'https://e-commerce-zbvw.vercel.app/',
      color: 'accent'
    },
    {
      title: 'Portfolio 3D',
      description: 'Interactive 3D portfolio with WebGL animations, particle effects and an immersive scroll experience.',
      tags: ['Three.js', 'GSAP', 'WebGL', 'Shaders'],
      link: null, // not published yet
      color: 'primary'
    },
    {
      title: 'Real-time Dashboard',
      description: 'Analytics dashboard with live data visualisation, animated charts and interactive filtering.',
      tags: ['React', 'D3.js', 'WebSockets', 'Chart.js'],
      link: null,
      color: 'secondary'
    },
    {
      title: 'Browser 3D Game',
      description: 'Browser-based 3D game with a physics engine, character animation and multiplayer support.',
      tags: ['Three.js', 'Cannon.js', 'WebRTC', 'WebGL'],
      link: null,
      color: 'accent'
    }
  ];

  var gallery = document.getElementById('projectGallery');

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  if (gallery) {
    var frag = document.createDocumentFragment();

    projects.forEach(function (p, i) {
      var pal = PALETTE[p.color] || PALETTE.primary;
      var card = document.createElement('article');
      card.className = 'project-card glass rounded-3xl overflow-hidden hover-lift card-3d flex flex-col h-full animate-fade-in-up';
      card.style.animationDelay = (i * 0.1) + 's';

      var cta = p.link
        ? '<a href="' + escapeHtml(p.link) + '" target="_blank" rel="noopener noreferrer" ' +
          'class="inline-flex items-center gap-2 font-semibold btn-interactive ' + pal.text + '">' +
          '<span>View Project</span>' +
          '<i class="fas fa-arrow-right transition-transform group-hover:translate-x-2" aria-hidden="true"></i></a>'
        : '<span class="inline-flex items-center gap-2 font-semibold text-gray-500">' +
          '<i class="fas fa-clock" aria-hidden="true"></i><span>Coming soon</span></span>';

      var chips = p.tags.map(function (t) {
        return '<span class="px-3 py-1 rounded-full border text-sm ' + pal.chip + '">' + escapeHtml(t) + '</span>';
      }).join('');

      card.innerHTML =
        '<div class="card-3d-inner flex flex-col h-full">' +
          '<div class="relative h-40 bg-gradient-to-br ' + pal.grad + '">' +
            '<span class="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/30 backdrop-blur text-white text-xs font-semibold">' +
              escapeHtml(p.tags[0]) +
            '</span>' +
          '</div>' +
          '<div class="p-7 flex flex-col flex-1">' +
            '<h3 class="text-xl font-bold mb-3">' + escapeHtml(p.title) + '</h3>' +
            '<p class="text-gray-400 text-sm mb-5 flex-1">' + escapeHtml(p.description) + '</p>' +
            '<div class="flex flex-wrap gap-2 mb-5">' + chips + '</div>' +
            '<div class="group">' + cta + '</div>' +
          '</div>' +
        '</div>';

      frag.appendChild(card);
    });

    gallery.appendChild(frag);
  }

  /* ---------- Skill bars (IntersectionObserver) ---------- */
  (function skillBars() {
    var bars = document.querySelectorAll('.skill-progress');
    if (!bars.length) return;

    function fill(bar) {
      bar.style.width = bar.getAttribute('data-width') || '0%';
    }

    if (reduceMotion || !('IntersectionObserver' in window)) {
      bars.forEach(fill);
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var group = entry.target.querySelectorAll('.skill-progress');
        group.forEach(function (bar, i) {
          setTimeout(function () { fill(bar); }, i * 120);
        });
        io.unobserve(entry.target);
      });
    }, { threshold: 0.25 });

    document.querySelectorAll('.glass').forEach(function (card) {
      if (card.querySelector('.skill-progress')) io.observe(card);
    });
  })();

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.getElementById('mobileMenuButton');
  var mobileMenu = document.getElementById('mobileMenu');

  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('hidden');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
  }

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function () {
      var isNowHidden = mobileMenu.classList.toggle('hidden');
      menuBtn.setAttribute('aria-expanded', String(!isNowHidden));

      if (!isNowHidden && hasGSAP && !reduceMotion) {
        gsap.from(mobileMenu.querySelectorAll('a'), {
          duration: 0.3, y: 12, opacity: 0, stagger: 0.06, ease: 'power2.out'
        });
      }
    });
  }

  /* ---------- Back to top ---------- */
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      safeScrollTo(0, { duration: 0.8 });
    });
  }

  /* ---------- Scroll progress + back-to-top visibility (rAF throttled) ---------- */
  var progress = document.getElementById('scrollProgress');
  var ticking = false;

  function onScroll() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var pct = height > 0 ? (scrollTop / height) * 100 : 0;

    if (progress) progress.style.width = pct.toFixed(2) + '%';
    if (backToTop) backToTop.classList.toggle('is-visible', scrollTop > 400);

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(onScroll);
  }, { passive: true });

  onScroll();

  /* ---------- Confetti ---------- */
  function createConfetti() {
    if (reduceMotion || !hasGSAP) return;
    var colors = ['#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444', '#22c55e'];
    for (var i = 0; i < 30; i++) {
      var el = document.createElement('span');
      el.className = 'confetti';
      el.style.cssText =
        'position:fixed;top:-10px;width:8px;height:8px;border-radius:2px;pointer-events:none;z-index:9999;' +
        'left:' + (Math.random() * 100) + 'vw;' +
        'background:' + colors[Math.floor(Math.random() * colors.length)] + ';';
      document.body.appendChild(el);
      gsap.to(el, {
        y: window.innerHeight + 60,
        x: Math.random() * 160 - 80,
        rotation: Math.random() * 720,
        duration: Math.random() * 1.5 + 1.2,
        ease: 'power1.in',
        onComplete: (function (node) {
          return function () { node.remove(); };
        })(el)
      });
    }
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-confetti]')) createConfetti();
  });

  /* ---------- Anchor links: smooth scroll + close menu ---------- */
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;

    var href = link.getAttribute('href');
    if (!href || href === '#') return;

    var target = document.getElementById(href.slice(1));
    if (!target) return;

    e.preventDefault();
    safeScrollTo(target, { offsetY: 100, duration: 0.9 });
    closeMenu();

    if (history.replaceState) history.replaceState(null, '', href);
  });

  /* ---------- Contact form ---------- */
  var form = document.getElementById('contactForm');
  var formMessage = document.getElementById('formMessage');

  if (form && formMessage) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // TODO: replace with a real submission (Formspree / EmailJS / your API).
      formMessage.classList.remove('hidden');
      createConfetti();

      if (hasGSAP && !reduceMotion) {
        gsap.from(formMessage, { duration: 0.5, scale: 0.9, opacity: 0, ease: 'back.out(1.7)' });
      }

      form.reset();

      setTimeout(function () {
        if (hasGSAP && !reduceMotion) {
          gsap.to(formMessage, {
            duration: 0.4, opacity: 0,
            onComplete: function () {
              formMessage.classList.add('hidden');
              formMessage.style.opacity = '';
            }
          });
        } else {
          formMessage.classList.add('hidden');
        }
      }, 5000);
    });
  }

  /* ---------- Keyboard shortcuts ---------- */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();

    if ((e.ctrlKey || e.metaKey) && e.key === 'Home') {
      e.preventDefault();
      safeScrollTo(0, { duration: 0.6 });
    }
  });

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- External link safety ---------- */
  document.querySelectorAll('a[target="_blank"]').forEach(function (a) {
    if (!a.hasAttribute('rel')) a.setAttribute('rel', 'noopener noreferrer');
  });

})();