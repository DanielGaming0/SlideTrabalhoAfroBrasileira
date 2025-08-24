// script.js atualizado
document.addEventListener('DOMContentLoaded', () => {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsWrap = document.getElementById('dots');
  const progressBar = document.getElementById('progressBar');
  const TRANS_MS = 500;

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
    }
    
    // Add floating circles to each slide
    addFloatingCircles(s);
    
    // Add decorative corners to each slide
    addDecorativeCorners(s);
  });

  // Animate slide content when it becomes active
  function animateSlideContent(slide) {
    // Reset animations
    const textElements = slide.querySelectorAll('.text > *');
    const imageElements = slide.querySelectorAll('.slide-image-container');
    const cards = slide.querySelectorAll('.info-card, .importance-card');
    const notes = slide.querySelectorAll('.note-box');
    const keyPoints = slide.querySelectorAll('.key-point');
    
    // Remove any existing animations
    textElements.forEach(el => {
      el.style.animation = 'none';
    });
    imageElements.forEach(el => {
      el.style.animation = 'none';
    });
    cards.forEach(el => {
      el.style.animation = 'none';
    });
    notes.forEach(el => {
      el.style.animation = 'none';
    });
    keyPoints.forEach(el => {
      el.style.animation = 'none';
    });
    
    // Trigger reflow
    void slide.offsetWidth;
    
    // Apply staggered animations
    textElements.forEach((el, i) => {
      el.style.animation = `fadeInUp 0.6s ease-out ${i * 0.1}s both`;
    });
    
    imageElements.forEach((el, i) => {
      el.style.animation = `fadeInUp 0.6s ease-out ${i * 0.15 + 0.2}s both`;
    });
    
    cards.forEach((el, i) => {
      el.style.animation = `fadeInUp 0.5s ease-out ${i * 0.1 + 0.3}s both`;
    });
    
    notes.forEach((el, i) => {
      el.style.animation = `fadeInUp 0.5s ease-out ${i * 0.1 + 0.4}s both`;
    });
    
    keyPoints.forEach((el, i) => {
      el.style.animation = `fadeInUp 0.5s ease-out ${i * 0.1 + 0.5}s both`;
    });
    
    // Add special animations to specific elements
    const icons = slide.querySelectorAll('.card-icon, .key-point i');
    icons.forEach(icon => {
      icon.style.animation = 'pulse 2s infinite ease-in-out';
    });
    
    // Add bounce animation to final message
    const finalMessage = slide.querySelector('.final-message');
    if (finalMessage) {
      finalMessage.style.animation = 'bounce 3s infinite ease-in-out';
    }
  }

  // Add decorative corners to slides
  function addDecorativeCorners(slide) {
    // Remove existing corners if any
    const existingCorners = slide.querySelectorAll('.decorative-corner');
    existingCorners.forEach(corner => corner.remove());
    
    const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
    
    positions.forEach(pos => {
      const corner = document.createElement('div');
      corner.className = `decorative-corner decorative-corner--${pos}`;
      slide.appendChild(corner);
    });
  }

  // Add floating circles to slides
  function addFloatingCircles(slide) {
    // Skip title slide (already has particles)
    if (slide.classList.contains('slide--title')) return;
    
    const floatingCircles = document.createElement('div');
    floatingCircles.className = 'floating-circles';
    
    // Create 5 circles with different properties
    for (let i = 1; i <= 5; i++) {
      const circle = document.createElement('div');
      circle.className = 'circle';
      floatingCircles.appendChild(circle);
    }
    
    slide.appendChild(floatingCircles);
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
    
    // Update current and next slides
    const currentSlide = slides[current];
    const nextSlide = slides[nextIdx];
    
    // Set direction for animation
    const direction = nextIdx > current ? 1 : -1;
    
    // Animate out current slide
    currentSlide.style.transform = `translateX(${-direction * 100}%)`;
    currentSlide.style.opacity = '0';
    currentSlide.setAttribute('aria-hidden', 'true');
    
    // Prepare next slide
    nextSlide.style.transform = `translateX(${direction * 100}%)`;
    nextSlide.classList.add('active');
    
    // Animate in next slide
    setTimeout(() => {
      nextSlide.style.transform = 'translateX(0)';
      nextSlide.style.opacity = '1';
      nextSlide.setAttribute('aria-hidden', 'false');
      
      // Animate content in the new slide
      animateSlideContent(nextSlide);
      
      // Update current index and UI
      current = nextIdx;
      updateDots(current);
      updateProgress(current);
      
      // Add floating animation to elements
      const floatingElements = nextSlide.querySelectorAll('.info-card, .note-box, .importance-card');
      floatingElements.forEach(el => {
        el.classList.add('floating');
      });
      
      isAnimating = false;
    }, TRANS_MS);
    
    // Remove active class from current slide after transition
    setTimeout(() => {
      currentSlide.classList.remove('active');
    }, TRANS_MS);
  }

  // Navigation controls
  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));
  dots.forEach(d => d.addEventListener('click', (e) => goTo(Number(e.currentTarget.dataset.index))));

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      goTo(current + 1);
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goTo(current - 1);
    }
    if (e.key === 'Home') {
      e.preventDefault();
      goTo(0);
    }
    if (e.key === 'End') {
      e.preventDefault();
      goTo(slides.length - 1);
    }
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
      
      // Check if it's primarily a horizontal swipe
      if (Math.abs(touchX - touchStartX) > Math.abs(touchY - touchStartY) && 
          Math.abs(touchX - touchStartX) > THRESHOLD) {
        touchMoved = true;
        
        if (touchX < touchStartX) {
          goTo(current + 1); // Swipe left - next
        } else {
          goTo(current - 1); // Swipe right - previous
        }
      }
    }
  }, {passive: true});

  document.addEventListener('touchend', (e) => {
    if (!touchMoved) return;
    const touchEndX = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : touchStartX;
    const touchEndY = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientY : touchStartY;
    
    // Check if it's a valid swipe
    if (Math.abs(touchEndX - touchStartX) > THRESHOLD && 
        Math.abs(touchEndX - touchStartX) > Math.abs(touchEndY - touchStartY)) {
      if (touchEndX < touchStartX) {
        goTo(current + 1); // Swipe left - next
      } else {
        goTo(current - 1); // Swipe right - previous
      }
    }
  }, {passive: true});

  // Initialize progress bar
  updateProgress(current);
  
  // Animate content in the first slide
  setTimeout(() => {
    animateSlideContent(slides[current]);
    
    // Add floating animation to elements
    const floatingElements = document.querySelectorAll('.info-card, .note-box, .importance-card');
    floatingElements.forEach(el => {
      el.classList.add('floating');
    });
  }, 100);
  
  // Auto-rotate slides (optional - can be disabled)
  let autoRotateInterval = setInterval(() => {
    goTo(current + 1);
  }, 8000);
  
  // Pause auto-rotation when user interacts
  document.addEventListener('keydown', () => {
    clearInterval(autoRotateInterval);
  });
  
  document.addEventListener('click', () => {
    clearInterval(autoRotateInterval);
  });
  
  document.addEventListener('touchstart', () => {
    clearInterval(autoRotateInterval);
  });
});