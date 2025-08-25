// script.js atualizado - Transições mais suaves
document.addEventListener('DOMContentLoaded', () => {
  const slidesContainer = document.getElementById('slides');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsWrap = document.getElementById('dots');
  const progressBar = document.getElementById('progressBar');
  const TRANS_MS = 800; // Aumentei o tempo para transição mais suave

  let current = 0;
  let isAnimating = false;
  let touchStartX = 0;
  let touchStartY = 0;
  let touchMoved = false;
  const THRESHOLD = 40;

  // Build dots navigation
  const slides = Array.from(document.querySelectorAll('.slide'));
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
    } else {
      s.style.transform = 'translateX(100%)';
      s.style.opacity = '0';
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
    
    // Apply staggered animations with delays mais suaves
    textElements.forEach((el, i) => {
      el.style.animation = `fadeInUp 0.8s ease-out ${i * 0.08}s both`;
    });
    
    imageElements.forEach((el, i) => {
      el.style.animation = `fadeInUp 0.8s ease-out ${i * 0.12 + 0.15}s both`;
    });
    
    cards.forEach((el, i) => {
      el.style.animation = `fadeInUp 0.7s ease-out ${i * 0.08 + 0.25}s both`;
    });
    
    notes.forEach((el, i) => {
      el.style.animation = `fadeInUp 0.7s ease-out ${i * 0.08 + 0.3}s both`;
    });
    
    keyPoints.forEach((el, i) => {
      el.style.animation = `fadeInUp 0.7s ease-out ${i * 0.08 + 0.35}s both`;
    });
    
    // Add special animations to specific elements
    const icons = slide.querySelectorAll('.card-icon, .key-point i');
    icons.forEach(icon => {
      icon.style.animation = 'pulse 2.5s infinite ease-in-out';
    });
    
    // Add bounce animation to final message
    const finalMessage = slide.querySelector('.final-message');
    if (finalMessage) {
      finalMessage.style.animation = 'bounce 3.5s infinite ease-in-out';
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

  // Navigate to specific slide - TRANSIÇÃO MAIS SUAVE
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
    
    // Prepare next slide
    nextSlide.style.transform = `translateX(${direction * 100}%)`;
    nextSlide.style.opacity = '0';
    nextSlide.classList.add('active');
    
    // Forçar reflow
    void nextSlide.offsetWidth;
    
    // Animar ambos os slides simultaneamente para transição mais suave
    currentSlide.style.transform = `translateX(${-direction * 100}%)`;
    currentSlide.style.opacity = '0.5';
    
    nextSlide.style.transform = 'translateX(0)';
    nextSlide.style.opacity = '1';
    
    // Atualizar atributos de acessibilidade
    currentSlide.setAttribute('aria-hidden', 'true');
    nextSlide.setAttribute('aria-hidden', 'false');
    
    // Animate content in the new slide após um pequeno delay
    setTimeout(() => {
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
    }, TRANS_MS / 2);
    
    // Finalizar transição
    setTimeout(() => {
      currentSlide.classList.remove('active');
      isAnimating = false;
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

  // Touch swipe support melhorado
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
      
      const diffX = touchX - touchStartX;
      const diffY = touchY - touchStartY;
      
      // Check if it's primarily a horizontal swipe
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > THRESHOLD) {
        touchMoved = true;
        
        if (diffX < 0) {
          goTo(current + 1); // Swipe left - next
        } else {
          goTo(current - 1); // Swipe right - previous
        }
      }
    }
  }, {passive: true});

  document.addEventListener('touchend', (e) => {
    if (!touchMoved) return;
    touchMoved = false;
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
  }, 300); // Aumentei o delay inicial
  
  // Auto-rotate slides (opcional)
  let autoRotateInterval = setInterval(() => {
    if (!isAnimating && !touchMoved) {
      goTo(current + 1);
    }
  }, 10000); // Aumentei o intervalo
  
  // Pause auto-rotation when user interacts
  const stopAutoRotate = () => {
    clearInterval(autoRotateInterval);
  };
  
  document.addEventListener('keydown', stopAutoRotate);
  document.addEventListener('click', stopAutoRotate);
  document.addEventListener('touchstart', stopAutoRotate);

  // Add CSS animations dynamically com easing melhorado
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes pulse {
      0% {
        transform: scale(1);
        opacity: 0.8;
      }
      50% {
        transform: scale(1.08);
        opacity: 1;
      }
      100% {
        transform: scale(1);
        opacity: 0.8;
      }
    }
    
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-15px);
      }
      60% {
        transform: translateY(-7px);
      }
    }
    
    /* Transição mais suave para slides */
    .slide {
      transition: transform ${TRANS_MS}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), 
                 opacity ${TRANS_MS}ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
  `;
  document.head.appendChild(style);
});