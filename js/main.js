/* =====================================================
   LOGIA ALIOTH NO. 44 — JavaScript Principal
   - Navbar scroll
   - Menú hamburguesa
   - Scroll suave
   - Animaciones al scroll (IntersectionObserver)
   - Lightbox de galería
   - Formulario de contacto
   ===================================================== */

(function () {
  'use strict';

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
  handleNavbarScroll(); // Ejecutar al cargar

  /* ──────────────────────────────────────────────────
     NAVBAR — Enlace activo al hacer scroll
  ─────────────────────────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    const scrollY = window.scrollY + 120; // Offset para el navbar fijo

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
     MENÚ HAMBURGUESA
  ─────────────────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinksMenu = document.getElementById('nav-links');

  function toggleMenu(forceClose = false) {
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
      document.body.style.overflow = 'hidden'; // Previene scroll del body cuando el menú está abierto
    }
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => toggleMenu());
  }

  // Cerrar menú al hacer clic en un enlace
  navLinksMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => toggleMenu(true));
  });

  // Cerrar menú al hacer clic fuera (en overlay)
  document.addEventListener('click', (e) => {
    if (
      navLinksMenu.classList.contains('open') &&
      !navLinksMenu.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      toggleMenu(true);
    }
  });

  // Cerrar menú con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinksMenu.classList.contains('open')) {
      toggleMenu(true);
    }
  });

  /* ──────────────────────────────────────────────────
     SCROLL SUAVE para enlaces de ancla
  ─────────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const navbarHeight = navbar ? navbar.offsetHeight : 0;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });

  /* ──────────────────────────────────────────────────
     ANIMACIONES AL SCROLL — IntersectionObserver
  ─────────────────────────────────────────────────── */
  const animateElements = document.querySelectorAll('.animate-on-scroll');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px', // Activa un poco antes de que salga del viewport
    threshold: 0.12
  };

  const intersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        intersectionObserver.unobserve(entry.target); // Solo animar una vez
      }
    });
  }, observerOptions);

  animateElements.forEach(el => {
    // Respetar preferencias de movimiento reducido
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('visible'); // Mostrar directamente sin animación
    } else {
      intersectionObserver.observe(el);
    }
  });

  /* ──────────────────────────────────────────────────
     LIGHTBOX DE GALERÍA
  ─────────────────────────────────────────────────── */
  const lightbox = document.getElementById('lightbox');
  const lightboxOverlay = document.getElementById('lightbox-overlay');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const lightboxLabel = document.getElementById('lightbox-label');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const galleryTriggers = document.querySelectorAll('.lightbox-trigger');

  let currentIndex = 0;
  const totalImages = galleryTriggers.length;

  // Datos de las fotos (placeholder — reemplazar con URLs reales)
  const galleryData = Array.from(galleryTriggers).map((trigger, idx) => ({
    index: idx,
    label: trigger.querySelector('.gallery-label')
      ? trigger.querySelector('.gallery-label').textContent
      : `Foto ${idx + 1}`,
    // src: 'img/foto-' + (idx + 1) + '.jpg' // URL real cuando estén las imágenes
  }));

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
    // Devolver foco al elemento que abrió el lightbox
    if (galleryTriggers[currentIndex]) {
      galleryTriggers[currentIndex].focus();
    }
  }

  function updateLightboxContent(index) {
    const data = galleryData[index];
    if (lightboxLabel) lightboxLabel.textContent = data.label;
    if (lightboxCounter) lightboxCounter.textContent = `${index + 1} / ${totalImages}`;

    // Cuando se agreguen imágenes reales, descomentar esto:
    // const img = lightboxContent.querySelector('img') || document.createElement('img');
    // img.src = data.src;
    // img.alt = data.label;
    // lightboxContent.innerHTML = '';
    // lightboxContent.appendChild(img);
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + totalImages) % totalImages;
    updateLightboxContent(currentIndex);
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % totalImages;
    updateLightboxContent(currentIndex);
  }

  // Abrir lightbox al hacer clic en una imagen
  galleryTriggers.forEach((trigger, index) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(index);
    });
  });

  // Cerrar lightbox
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrev);
  if (lightboxNext) lightboxNext.addEventListener('click', showNext);

  // Navegación por teclado en lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    switch (e.key) {
      case 'Escape':    closeLightbox(); break;
      case 'ArrowLeft': showPrev(); break;
      case 'ArrowRight':showNext(); break;
    }
  });

  // Navegación táctil en lightbox (swipe)
  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) { // Umbral de 50px
      if (diff > 0) showNext();
      else showPrev();
    }
  }, { passive: true });

  /* ──────────────────────────────────────────────────
     FORMULARIO DE CONTACTO
  ─────────────────────────────────────────────────── */
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      // Validación básica
      const nombre = contactForm.nombre.value.trim();
      const correo = contactForm.correo.value.trim();
      const mensaje = contactForm.mensaje.value.trim();

      if (!nombre || !correo || !mensaje) {
        alert('Por favor completa los campos requeridos (Nombre, Correo y Mensaje).');
        return;
      }

      if (!isValidEmail(correo)) {
        alert('Por favor ingresa un correo electrónico válido.');
        return;
      }

      // Estado de carga
      submitBtn.textContent = 'Enviando...';
      submitBtn.disabled = true;

      try {
        /*
          Para activar el envío real con Formspree:
          1. Crea una cuenta en formspree.io
          2. Crea un nuevo formulario y copia tu ID
          3. Cambia el action del form: action="https://formspree.io/f/TU_ID"
          4. Reemplaza el bloque fetch de abajo con el envío nativo del form
             o mantén el fetch si quieres manejo AJAX

          Implementación AJAX con Formspree:
          const response = await fetch('https://formspree.io/f/TU_ID', {
            method: 'POST',
            body: new FormData(contactForm),
            headers: { 'Accept': 'application/json' }
          });
          if (!response.ok) throw new Error('Error al enviar');
        */

        // Simulación de envío (reemplazar con fetch real)
        await new Promise(resolve => setTimeout(resolve, 1200));

        // Éxito
        contactForm.reset();
        if (formSuccess) {
          formSuccess.classList.add('visible');
          setTimeout(() => formSuccess.classList.remove('visible'), 6000);
        }
      } catch (error) {
        alert('Hubo un error al enviar el mensaje. Por favor intenta nuevamente o contáctanos directamente.');
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* ──────────────────────────────────────────────────
     AÑO ACTUAL EN FOOTER
  ─────────────────────────────────────────────────── */
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ──────────────────────────────────────────────────
     FIN
  ─────────────────────────────────────────────────── */
  console.log('Logia Alioth No. 44 — Sitio web inicializado correctamente.');

})();
