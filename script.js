// script.js
document.addEventListener('DOMContentLoaded', () => {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsWrap = document.getElementById('dots');
  const progressBar = document.getElementById('progressBar');
  const TRANS_MS = 600;

  let current = 0;
  let isAnimating = false;
  let touchStartX = 0;
  let touchStartY = 0;
  let touchMoved = false;
  const THRESHOLD = 40;

  // Build dots navigation
  slides.forEach((s, i) => {
    const d = document.createElement('button');
    d.className = 'dot';
    d.dataset.index = i;
    d.setAttribute('aria-label', `Ir para slide ${i+1}`);
    if (i === 0) d.classList.add('active');
    dotsWrap.appendChild(d);
  });
  const dots = Array.from(document.querySelectorAll('.dot'));

  // Initialize slides
  slides.forEach((s, i) => {
    if (i === 0) {
      s.classList.add('active');
      s.style.transform = 'translateX(0)';
      s.style.opacity = '1';
      s.setAttribute('aria-hidden', 'false');
      
      // Animate elements in the first slide
      setTimeout(() => {
        animateSlideContent(s);
      }, 300);
    } else {
      s.style.transform = 'translateX(100%)';
      s.style.opacity = '0';
      s.setAttribute('aria-hidden', 'true');
    }
  });

  // Animate slide content when it becomes active
  function animateSlideContent(slide) {
    // Reset animations
    const textElements = slide.querySelectorAll('.text > *');
    const imageElements = slide.querySelectorAll('.slide-image-container');
    
    textElements.forEach(el => {
      el.style.animation = 'none';
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
    });
    
    imageElements.forEach(el => {
      el.style.animation = 'none';
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
    });
    
    // Force reflow
    void slide.offsetWidth;
    
    // Animate text elements with staggered delay
    textElements.forEach((el, i) => {
      el.style.animation = `fadeInUp 0.8s ease-out ${i * 0.2}s both`;
    });
    
    // Animate image elements
    imageElements.forEach((el, i) => {
      el.style.animation = `fadeInUp 0.8s ease-out ${(textElements.length * 0.2) + (i * 0.2)}s both`;
    });
    
    // Special animations for info cards
    const infoCards = slide.querySelectorAll('.info-card');
    if (infoCards.length) {
      infoCards.forEach((card, i) => {
        card.style.animation = `fadeInUp 0.6s ease-out ${0.4 + (i * 0.2)}s both`;
      });
    }
    
    // Special animations for note boxes
    const noteBoxes = slide.querySelectorAll('.note-box');
    if (noteBoxes.length) {
      noteBoxes.forEach((box, i) => {
        box.style.animation = `fadeInUp 0.6s ease-out ${0.6 + (i * 0.2)}s both`;
      });
    }
    
    // Add animation to images
    const images = slide.querySelectorAll('.slide-image');
    images.forEach(img => {
      // Reset any previous animation
      img.style.animation = 'none';
      
      // Add subtle floating animation
      img.style.animation = 'float 6s ease-in-out infinite';
      
      // Add hover effect with JavaScript for better compatibility
      img.addEventListener('mouseenter', () => {
        img.style.transform = 'scale(1.05)';
        img.style.filter = 'brightness(1.05) contrast(1.05)';
      });
      
      img.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1)';
        img.style.filter = 'brightness(0.95) contrast(0.95)';
      });
    });
  }

  // Update progress bar
  function updateProgress(idx) {
    const progress = ((idx + 1) / slides.length) * 100;
    progressBar.style.width = `${progress}%`;
  }

  // Update dots navigation
  function updateDots(idx) {
    dots.forEach(d => d.classList.toggle('active', Number(d.dataset.index) === idx));
  }

  // Navigate to specific slide
  function goTo(nextIdx) {
    if (isAnimating || nextIdx === current) return;
    if (nextIdx < 0) nextIdx = slides.length - 1;
    if (nextIdx >= slides.length) nextIdx = 0;

    isAnimating = true;
    const from = slides[current];
    const to = slides[nextIdx];
    const direction = (nextIdx > current || (current === slides.length - 1 && nextIdx === 0)) ? 'next' : 'prev';

    // Prepare incoming slide
    to.style.transition = 'none';
    to.style.opacity = '1';
    to.style.transform = direction === 'next' ? 'translateX(100%)' : 'translateX(-100%)';
    to.classList.add('preparing');
    to.style.zIndex = 3;

    // Force reflow
    void to.offsetWidth;

    // Animate both slides
    from.style.transition = `transform ${TRANS_MS}ms ease, opacity ${TRANS_MS}ms ease`;
    to.style.transition = `transform ${TRANS_MS}ms ease, opacity ${TRANS_MS}ms ease`;

    from.style.transform = direction === 'next' ? 'translateX(-100%)' : 'translateX(100%)';
    from.style.opacity = '0';

    to.style.transform = 'translateX(0)';
    to.style.opacity = '1';

    let finished = false;
    function done() {
      if (finished) return;
      finished = true;

      from.classList.remove('active');
      from.style.transition = '';
      from.style.transform = '';
      from.style.opacity = '';
      from.style.zIndex = '';
      from.setAttribute('aria-hidden', 'true');

      to.classList.add('active');
      to.classList.remove('preparing');
      to.style.transition = '';
      to.style.transform = '';
      to.style.opacity = '';
      to.style.zIndex = '';
      to.setAttribute('aria-hidden', 'false');
      
      // Animate content of the new active slide
      animateSlideContent(to);

      current = nextIdx;
      updateDots(current);
      updateProgress(current);
      isAnimating = false;
    }

    to.addEventListener('transitionend', done, { once: true });
    setTimeout(done, TRANS_MS + 90);
  }

  // Navigation controls
  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));
  dots.forEach(d => d.addEventListener('click', (e) => goTo(Number(e.currentTarget.dataset.index))));

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(current - 1); }
    if (e.key === 'Home') { e.preventDefault(); goTo(0); }
    if (e.key === 'End') { e.preventDefault(); goTo(slides.length - 1); }
  });

  // Touch swipe support
  document.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchMoved = false;
  }, {passive: true});
  
  document.addEventListener('touchmove', (e) => { 
    if (!touchMoved && e.touches.length === 1) {
      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;
      
      if (Math.abs(touchX - touchStartX) > 5 || Math.abs(touchY - touchStartY) > 5) {
        touchMoved = true;
      }
    }
  }, {passive: true});
  
  document.addEventListener('touchend', (e) => {
    if (!touchMoved) return;
    const touchEndX = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : touchStartX;
    const touchEndY = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientY : touchStartY;
    
    const dx = touchEndX - touchStartX;
    const dy = Math.abs(touchEndY - touchStartY);
    
    if (Math.abs(dx) > THRESHOLD && Math.abs(dx) > dy) {
      if (dx < 0) goTo(current + 1);
      else goTo(current - 1);
    }
  }, {passive: true});

  // Initialize progress bar
  updateProgress(current);
  
  // Add CSS animations dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0) translateX(0); }
      25% { transform: translateY(-8px) translateX(5px); }
      50% { transform: translateY(4px) translateX(10px); }
      75% { transform: translateY(8px) translateX(-5px); }
    }
  `;
  document.head.appendChild(style);
});