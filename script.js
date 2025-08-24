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
    } else {
      s.style.transform = 'translateX(100%)';
      s.style.opacity = '0';
      s.setAttribute('aria-hidden', 'true');
    }
  });

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
});