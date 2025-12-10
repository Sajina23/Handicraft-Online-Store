/* ==================== GALLERY LIGHTBOX ==================== */
document.addEventListener('DOMContentLoaded', function() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxTitle = document.getElementById('lightbox-title');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');
  const galleryThumbs = document.querySelectorAll('.gallery-thumb');

  let currentIndex = 0;

  // Open lightbox
  function openLightbox(index) {
    currentIndex = index;
    const thumb = galleryThumbs[currentIndex];
    const fullImage = thumb.dataset.full || thumb.src;
    const caption = thumb.closest('figure').querySelector('figcaption');

    lightboxImage.src = fullImage;
    lightboxImage.alt = thumb.alt;
    lightboxTitle.textContent = caption ? caption.textContent : thumb.alt;
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Announce to screen readers
    const modal = lightbox.querySelector('[role="dialog"]');
    if (modal) {
      modal.focus();
    }
  }

  // Close lightbox
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  // Navigate to previous image
  function showPrevious() {
    currentIndex = (currentIndex - 1 + galleryThumbs.length) % galleryThumbs.length;
    openLightbox(currentIndex);
  }

  // Navigate to next image
  function showNext() {
    currentIndex = (currentIndex + 1) % galleryThumbs.length;
    openLightbox(currentIndex);
  }

  // Event listeners
  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', showPrevious);
  nextBtn.addEventListener('click', showNext);

  // Click on thumbnail to open
  galleryThumbs.forEach((thumb, index) => {
    thumb.addEventListener('click', () => {
      openLightbox(index);
    });

    // Keyboard support for thumbnails
    thumb.closest('figure').style.cursor = 'pointer';
    thumb.closest('figure').addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(index);
      }
    });
    thumb.closest('figure').setAttribute('tabindex', '0');
  });

  // Close on background click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    switch(e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        showPrevious();
        break;
      case 'ArrowRight':
        e.preventDefault();
        showNext();
        break;
    }
  });
});
