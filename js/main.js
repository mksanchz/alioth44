/* =====================================================
   LOGIA ALIOTH NO. 44 — JavaScript Principal
   - Animacion de titulo letra por letra
   - Parallax de 3 capas en hero (desactivado en movil)
   - Navbar scroll + enlace activo
   - Menu hamburguesa
   - Intersection Observer para animaciones de entrada
   - Parallax sutil en elementos decorativos
   - Lightbox de galeria (JS puro)
   - Formulario de contacto
   ===================================================== */

(function () {
  'use strict';

  /* ──────────────────────────────────────────────────
     DETECCION DE MOVIL — para desactivar parallax
  ─────────────────────────────────────────────────── */
  const isMobile = window.matchMedia('(max-width: 900px)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ──────────────────────────────────────────────────
     ANIMACION DEL TITULO — Fade-in letra por letra
     con retraso escalonado
  ─────────────────────────────────────────────────── */
  const heroTitleLine1 = document.getElementById('hero-title-line1');
  const heroTitleLine2 = document.getElementById('hero-title-line2');
  const titleLine1Text = 'R\u2234 L\u2234 S\u2234';
  const titleLine2Text = 'Alioth';

  function animateLetters(container, text, baseDelay) {
    if (!container) return;
    const letterDelay = 0.08;
    text.split('').forEach((char, i) => {
      const span = document.createElement('span');
      span.className = 'letter';
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.animationDelay = `${baseDelay + (i * letterDelay)}s`;
      container.appendChild(span);
    });
  }

  animateLetters(heroTitleLine1, titleLine1Text, 0.8);
  animateLetters(heroTitleLine2, titleLine2Text, 0.8 + titleLine1Text.length * 0.08);

  /* ──────────────────────────────────────────────────
     PARALLAX — 3 capas en el hero a velocidades distintas
     Desactivado en movil para rendimiento
  ─────────────────────────────────────────────────── */
  if (!isMobile && !prefersReducedMotion) {
    const parallaxLayers = document.querySelectorAll('[data-parallax-speed]');

    function handleParallax() {
      const scrollY = window.scrollY;
      const heroHeight = document.querySelector('.hero').offsetHeight;

      // Solo aplicar parallax cuando el hero es visible
      if (scrollY > heroHeight) return;

      parallaxLayers.forEach(layer => {
        const speed = parseFloat(layer.dataset.parallaxSpeed);
        const yOffset = scrollY * speed;
        layer.style.transform = `translateY(${yOffset}px)`;
      });
    }

    window.addEventListener('scroll', handleParallax, { passive: true });
  }

  /* ──────────────────────────────────────────────────
     PARALLAX SUTIL en elementos decorativos (±20px)
     Columnas y lineas doradas
  ─────────────────────────────────────────────────── */
  if (!isMobile && !prefersReducedMotion) {
    const decorElements = document.querySelectorAll('.separator-triangle, .hero-column');

    function handleDecorParallax() {
      const scrollY = window.scrollY;

      decorElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const viewCenter = window.innerHeight / 2;
        const distance = (center - viewCenter) / viewCenter;
        // Limitar a ±20px
        const offset = Math.max(-20, Math.min(20, distance * 20));
        el.style.transform = `translateY(${offset}px)`;
      });
    }

    window.addEventListener('scroll', handleDecorParallax, { passive: true });
  }

  /* ──────────────────────────────────────────────────
     NAVBAR — Efecto al hacer scroll
  ─────────────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  /* ──────────────────────────────────────────────────
     NAVBAR — Enlace activo al hacer scroll
  ─────────────────────────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < bottom) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  /* ──────────────────────────────────────────────────
     MENU HAMBURGUESA
  ─────────────────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinksMenu = document.getElementById('nav-links');

  function toggleMenu(forceClose) {
    if (forceClose === undefined) forceClose = false;
    const isOpen = navLinksMenu.classList.contains('open');

    if (forceClose || isOpen) {
      navLinksMenu.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    } else {
      navLinksMenu.classList.add('open');
      hamburger.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  }

  if (hamburger) {
    hamburger.addEventListener('click', function () { toggleMenu(); });
  }

  // Cerrar menu al hacer clic en un enlace
  navLinksMenu.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () { toggleMenu(true); });
  });

  // Cerrar menu al clic fuera
  document.addEventListener('click', function (e) {
    if (
      navLinksMenu.classList.contains('open') &&
      !navLinksMenu.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      toggleMenu(true);
    }
  });

  // Cerrar menu con Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navLinksMenu.classList.contains('open')) {
      toggleMenu(true);
    }
  });

  /* ──────────────────────────────────────────────────
     SCROLL SUAVE para enlaces de ancla
  ─────────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      var navbarHeight = navbar ? navbar.offsetHeight : 0;
      var targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });

  /* ──────────────────────────────────────────────────
     INTERSECTION OBSERVER — Animaciones de entrada
     Cada seccion al entrar en viewport:
     fade-in + translateY hacia arriba
  ─────────────────────────────────────────────────── */
  var animateElements = document.querySelectorAll('.animate-on-scroll');

  var observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  };

  var intersectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        intersectionObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animateElements.forEach(function (el) {
    if (prefersReducedMotion) {
      el.classList.add('visible');
    } else {
      intersectionObserver.observe(el);
    }
  });

  /* Animacion escalonada para items de galeria en movil */
  if (isMobile && !prefersReducedMotion) {
    var galleryItems = document.querySelectorAll('.gallery-item');
    var galleryObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('gallery-visible');
          galleryObserver.unobserve(entry.target);
        }
      });
    }, { root: null, rootMargin: '0px', threshold: 0.15 });

    galleryItems.forEach(function (item) {
      item.classList.add('gallery-animate');
      galleryObserver.observe(item);
    });
  }

  /* ──────────────────────────────────────────────────
     LIGHTBOX DE GALERIA (JS puro)
  ─────────────────────────────────────────────────── */
  var lightbox = document.getElementById('lightbox');
  var lightboxOverlay = document.getElementById('lightbox-overlay');
  var lightboxClose = document.getElementById('lightbox-close');
  var lightboxPrev = document.getElementById('lightbox-prev');
  var lightboxNext = document.getElementById('lightbox-next');
  var lightboxImage = document.getElementById('lightbox-image');
  var lightboxCounter = document.getElementById('lightbox-counter');
  var galleryTriggers = document.querySelectorAll('.lightbox-trigger');

  var currentIndex = 0;
  var totalImages = galleryTriggers.length;

  // Obtener las URLs de las imagenes de la galeria
  var galleryData = Array.from(galleryTriggers).map(function (trigger, idx) {
    var img = trigger.querySelector('.gallery-img');
    return {
      index: idx,
      src: img ? img.src : '',
      alt: img ? img.alt : 'Foto ' + (idx + 1)
    };
  });

  function openLightbox(index) {
    currentIndex = index;
    updateLightboxContent(currentIndex);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    if (galleryTriggers[currentIndex]) {
      galleryTriggers[currentIndex].focus();
    }
  }

  function updateLightboxContent(index) {
    var data = galleryData[index];
    if (lightboxImage) {
      lightboxImage.src = data.src;
      lightboxImage.alt = data.alt;
    }
    if (lightboxCounter) lightboxCounter.textContent = (index + 1) + ' / ' + totalImages;
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + totalImages) % totalImages;
    updateLightboxContent(currentIndex);
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % totalImages;
    updateLightboxContent(currentIndex);
  }

  // Abrir lightbox al clic
  galleryTriggers.forEach(function (trigger, index) {
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      openLightbox(index);
    });
  });

  // Cerrar lightbox
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrev);
  if (lightboxNext) lightboxNext.addEventListener('click', showNext);

  // Navegacion por teclado
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  // Navegacion tactil (swipe)
  var touchStartX = 0;
  var touchEndX = 0;

  lightbox.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', function (e) {
    touchEndX = e.changedTouches[0].screenX;
    var diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) showNext();
      else showPrev();
    }
  }, { passive: true });

  /* ──────────────────────────────────────────────────
     FORMULARIO DE CONTACTO — Envia a Google Form
     IDs internos extraidos del FB_PUBLIC_LOAD_DATA_
  ─────────────────────────────────────────────────── */
  var contactForm = document.getElementById('contact-form');
  var formSuccess = document.getElementById('form-success');
  var GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSebZPWttJSSPAKBUe0xAfXqx8PZrOtUAVuYOLj-yoT46ItdeQ/formResponse';

  // IDs internos (inner response IDs) del Google Form
  var FIELD_MAP = {
    nombre:   'entry.1838050102',
    correo:   'entry.755104155',
    telefono: 'entry.1264020608',
    mensaje:  'entry.1811652472'
  };

  /* -- Validacion inline por campo -- */
  function showError(input, msg) {
    clearError(input);
    input.classList.add('form-input--error');
    var el = document.createElement('span');
    el.className = 'form-error';
    el.textContent = msg;
    input.parentNode.appendChild(el);
  }

  function clearError(input) {
    input.classList.remove('form-input--error');
    var prev = input.parentNode.querySelector('.form-error');
    if (prev) prev.remove();
  }

  function validateField(input) {
    var val = input.value.trim();
    var name = input.name;

    if ((name === 'nombre' || name === 'correo' || name === 'mensaje') && !val) {
      showError(input, 'Este campo es requerido.');
      return false;
    }

    if (name === 'nombre' && val.length < 3) {
      showError(input, 'Ingresa al menos 3 caracteres.');
      return false;
    }

    if (name === 'correo' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      showError(input, 'Ingresa un correo valido.');
      return false;
    }

    if (name === 'telefono' && val && !/^[\d\s\-+()]{7,15}$/.test(val)) {
      showError(input, 'Ingresa un telefono valido.');
      return false;
    }

    if (name === 'mensaje' && val.length < 10) {
      showError(input, 'El mensaje debe tener al menos 10 caracteres.');
      return false;
    }

    clearError(input);
    input.classList.add('form-input--valid');
    return true;
  }

  // Validacion en tiempo real al salir de cada campo
  if (contactForm) {
    var inputs = contactForm.querySelectorAll('.form-input');
    inputs.forEach(function (input) {
      input.addEventListener('blur', function () {
        if (input.value.trim()) validateField(input);
      });
      input.addEventListener('input', function () {
        if (input.classList.contains('form-input--error')) {
          validateField(input);
        }
      });
    });

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Validar todos los campos
      var allValid = true;
      inputs.forEach(function (input) {
        var valid = validateField(input);
        if (!valid) allValid = false;
      });

      if (!allValid) return;

      var submitBtn = document.getElementById('btn-submit');
      var submitText = submitBtn.querySelector('.btn-submit-text');
      var originalText = submitText.textContent;

      var nombre = contactForm.nombre.value.trim();
      var correo = contactForm.correo.value.trim();
      var telefono = contactForm.telefono.value.trim();
      var mensaje = contactForm.mensaje.value.trim();

      // Estado de carga
      submitText.textContent = 'Enviando...';
      submitBtn.disabled = true;

      // Enviar via iframe oculto (metodo mas confiable para Google Forms)
      var iframeName = 'gform_iframe_' + Date.now();
      var iframe = document.createElement('iframe');
      iframe.name = iframeName;
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      var hiddenForm = document.createElement('form');
      hiddenForm.method = 'POST';
      hiddenForm.action = GOOGLE_FORM_URL;
      hiddenForm.target = iframeName;
      hiddenForm.style.display = 'none';

      var fields = [
        { name: FIELD_MAP.nombre,   value: nombre },
        { name: FIELD_MAP.correo,   value: correo },
        { name: FIELD_MAP.telefono, value: telefono },
        { name: FIELD_MAP.mensaje,  value: mensaje }
      ];

      fields.forEach(function (f) {
        var input = document.createElement('input');
        input.type = 'hidden';
        input.name = f.name;
        input.value = f.value;
        hiddenForm.appendChild(input);
      });

      document.body.appendChild(hiddenForm);
      hiddenForm.submit();

      // Mostrar exito despues de un breve momento
      setTimeout(function () {
        document.body.removeChild(hiddenForm);
        document.body.removeChild(iframe);

        contactForm.reset();
        inputs.forEach(function (input) {
          input.classList.remove('form-input--valid');
          clearError(input);
        });

        if (formSuccess) {
          formSuccess.classList.add('visible');
          setTimeout(function () { formSuccess.classList.remove('visible'); }, 6000);
        }
        submitText.textContent = originalText;
        submitBtn.disabled = false;
      }, 2000);
    });
  }

  /* ──────────────────────────────────────────────────
     ANO ACTUAL EN FOOTER
  ─────────────────────────────────────────────────── */
  var yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ──────────────────────────────────────────────────
     FIN
  ─────────────────────────────────────────────────── */
  console.log('Logia Alioth No. 44 — Sitio web inicializado correctamente.');

})();
