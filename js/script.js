// ============================================================
// Isabelle Lee — Portfolio interactions
// Nav solid-on-scroll, mobile menu, scroll reveal, lightbox
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('is-solid');
    } else {
      header.classList.remove('is-solid');
    }
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('is-open');
      navToggle.classList.toggle('is-open');
    });
    
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => navLinks.classList.remove('is-open'));
    });
  }

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // Lightbox — supports multiple independent groups (e.g. one per photography category)
  const groups = document.querySelectorAll('[data-lightbox-group]');
  if (groups.length) {
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = lightbox.querySelector('img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    let activeItems = [];
    let currentIndex = 0;

    const openLightbox = (items, index) => {
      activeItems = items;
      currentIndex = index;
      const item = activeItems[currentIndex];
      lightboxImg.src = item.dataset.full || item.querySelector('img').src;
      lightboxImg.alt = item.dataset.caption || '';
      lightboxCaption.textContent = item.dataset.caption || '';
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
    };

    const step = (delta) => {
      if (!activeItems.length) return;
      currentIndex = (currentIndex + delta + activeItems.length) % activeItems.length;
      openLightbox(activeItems, currentIndex);
    };

    groups.forEach((grid) => {
      const items = Array.from(grid.querySelectorAll('.grid-item'));
      items.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(items, index));
      });
    });

    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => step(-1));
    lightbox.querySelector('.lightbox-next').addEventListener('click', () => step(1));
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
  }
});
