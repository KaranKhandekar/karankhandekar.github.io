document.addEventListener('DOMContentLoaded', function () {

  // ─── Lucide Icons ───────────────────────────────────────────────
  lucide.createIcons({ attrs: { 'stroke-width': 1.25 } });


  // ─── Categories Slider ──────────────────────────────────────────
  const track = document.getElementById('scrollTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const CARD_WIDTH = 220 + 16;
  let categoryIndex = 0;

  function getVisibleCount() {
    const wrapper = document.getElementById('scrollWrapper');
    return wrapper ? Math.floor(wrapper.offsetWidth / CARD_WIDTH) : 0;
  }

  function getTotalCards() {
    return track ? track.querySelectorAll('.category-card').length : 0;
  }

  function slideCategories(direction) {
    if (!track) return;
    const maxIndex = getTotalCards() - getVisibleCount();
    categoryIndex = Math.max(0, Math.min(categoryIndex + direction, maxIndex));
    track.style.transform = `translateX(-${categoryIndex * CARD_WIDTH}px)`;
    updateCategoryButtons();
  }

  function updateCategoryButtons() {
    if (!prevBtn || !nextBtn) return;
    prevBtn.disabled = categoryIndex === 0;
    nextBtn.disabled = categoryIndex >= getTotalCards() - getVisibleCount();
  }

  if (prevBtn) prevBtn.addEventListener('click', () => slideCategories(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => slideCategories(1));

  window.addEventListener('resize', () => { slideCategories(0); updateCategoryButtons(); });
  updateCategoryButtons();


  // ─── Hero Video ─────────────────────────────────────────────────
  const heroVideo = document.getElementById('hero-video');
  const heroBackupImg = document.getElementById('hero-backup-img');
  const heroVideoControls = document.getElementById('hero-video-controls');
  const playPauseBtn = document.getElementById('play-pause-btn');
  const muteUnmuteBtn = document.getElementById('mute-unmute-btn');

  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.addEventListener('canplaythrough', () => {
      heroVideo.classList.add('ready');
      if (heroBackupImg) heroBackupImg.classList.add('fade-out');
      if (heroVideoControls) heroVideoControls.classList.add('visible');
      heroVideo.play().catch(console.error);
    });

    if (playPauseBtn) {
      playPauseBtn.addEventListener('click', () => {
        if (heroVideo.paused) {
          heroVideo.play();
          playPauseBtn.innerHTML = '<i data-lucide="pause"></i>';
        } else {
          heroVideo.pause();
          playPauseBtn.innerHTML = '<i data-lucide="play"></i>';
        }
        lucide.createIcons();
      });
    }

    if (muteUnmuteBtn) {
      muteUnmuteBtn.addEventListener('click', () => {
        heroVideo.muted = !heroVideo.muted;
        muteUnmuteBtn.innerHTML = heroVideo.muted
          ? '<i data-lucide="volume-x"></i>'
          : '<i data-lucide="volume-2"></i>';
        lucide.createIcons();
      });
    }
  }


  // ─── Recommended Designers Slider ───────────────────────────────
  (function initRecommendedSlider() {
    const sliderEl = document.getElementById('recommended-slider');
    if (!sliderEl) return;

    const designerNameEl = document.getElementById('recommended-designer-name');
    const dotsEl = document.getElementById('recommended-dots');

    const farLeftCard  = sliderEl.querySelector('.recommended-card--far-left');
    const leftCard     = sliderEl.querySelector('.recommended-card--left');
    const activeCard   = sliderEl.querySelector('.recommended-card--active');
    const rightCard    = sliderEl.querySelector('.recommended-card--right');
    const farRightCard = sliderEl.querySelector('.recommended-card--far-right');

    const slides = [
      { name: 'Ulla Johnson', img: 'https://cdn.saksfifthavenue.com/is/p13n/saks/de1c048b-1475-4a4c-b08c-59b154d66a88?wid=768&hei=960&fmt=webp' },
      { name: 'Designer 2',   img: 'https://cdn.saksfifthavenue.com/is/p13n/saks/da67b711-da48-4706-b175-e3a22978c9a7?wid=768&hei=960&fmt=webp' },
      { name: 'Designer 3',   img: 'https://cdn.saksfifthavenue.com/is/p13n/saks/ac00c421-5661-4a0c-bff0-1eeb9ca3c29a?wid=768&hei=960&fmt=webp' },
      { name: 'Designer 4',   img: 'https://cdn.saksfifthavenue.com/is/p13n/saks/28f8b570-7706-4ba9-bb2e-078e89066114?wid=768&hei=960&fmt=webp' },
      { name: 'Designer 5',   img: 'https://cdn.saksfifthavenue.com/is/p13n/saks/cc7a4122-cc44-470a-9981-b97efcf9ff04?wid=768&hei=960&fmt=webp' },
    ];

    let currentIndex = 0;
    let animating = false;
    const animDurationMs = 520;

    function setSlotImages() {
      const n = slides.length;
      const farLeftIndex  = (currentIndex - 2 + n) % n;
      const leftIndex     = (currentIndex - 1 + n) % n;
      const rightIndex    = (currentIndex + 1) % n;
      const farRightIndex = (currentIndex + 2) % n;

      farLeftCard.querySelector('img.recommended-img').src  = slides[farLeftIndex].img;
      leftCard.querySelector('img.recommended-img').src     = slides[leftIndex].img;
      activeCard.querySelector('img.recommended-img').src   = slides[currentIndex].img;
      rightCard.querySelector('img.recommended-img').src    = slides[rightIndex].img;
      farRightCard.querySelector('img.recommended-img').src = slides[farRightIndex].img;

      designerNameEl.textContent = slides[currentIndex].name;
    }

    function renderDots() {
      if (!dotsEl) return;
      dotsEl.innerHTML = '';
      slides.forEach((s, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'recommended-dot' + (idx === currentIndex ? ' active' : '');
        btn.dataset.targetIndex = String(idx);
        btn.addEventListener('click', () => goToIndex(Number(btn.dataset.targetIndex)));
        dotsEl.appendChild(btn);
      });
    }

    async function goToIndex(targetIndex) {
      if (animating || targetIndex === currentIndex) return;
      animating = true;
      currentIndex = targetIndex;
      setSlotImages();
      renderDots();
      animating = false;
    }

    setSlotImages();
    renderDots();
  })();


  // ─── Instagram Video Controls ────────────────────────────────────
  (function initInstagramVideoControls() {
    const cards = document.querySelectorAll('.instagram-strip--centered .ig-card');
    cards.forEach(card => {
      const video = card.querySelector('video');
      const playBtn = card.querySelector('.ig-play-toggle');
      const muteBtn = card.querySelector('.ig-mute-toggle');
      if (!video || !playBtn || !muteBtn) return;

      playBtn.addEventListener('click', () => {
        if (video.paused) video.play(); else video.pause();
        lucide.createIcons();
      });
      muteBtn.addEventListener('click', () => {
        video.muted = !video.muted;
        lucide.createIcons();
      });
    });
  })();


  // ─── Search Overlay ──────────────────────────────────────────────
  const searchOverlay = document.getElementById('search-overlay');
  const closeSearch   = document.getElementById('close-search');

  if (closeSearch && searchOverlay) {
    closeSearch.addEventListener('click', () => {
      searchOverlay.classList.remove('active');
    });
  }

});


// ─── NEW ARRIVALS: PERFECT 6-CARD SCROLL ────────────────────────
(function initArrivalsSlider() {
  const track = document.getElementById('arrivalsTrack');
  const prevBtn = document.getElementById('arrivalsPrev');
  const nextBtn = document.getElementById('arrivalsNext');
  
  if (!track || !prevBtn || !nextBtn) return;

  let index = 0;

  function slide(dir) {
    const cards = track.querySelectorAll('.arrivals-card');
    if (cards.length === 0) return;

    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = 12; // Matches your new tighter CSS gap
    const scrollAmount = cardWidth + gap;
    
    // Exactly 6 cards are visible at a time
    const visibleCount = 6;
    const maxIndex = Math.max(0, cards.length - visibleCount);

    index = Math.max(0, Math.min(index + dir, maxIndex));
    
    // Apply the transform
    track.style.transform = `translateX(-${index * scrollAmount}px)`;
    
    // Update button visual feedback (Image 1 style)
    prevBtn.style.opacity = index === 0 ? "0.2" : "1";
    prevBtn.disabled = index === 0;
    
    nextBtn.style.opacity = index >= maxIndex ? "0.2" : "1";
    nextBtn.disabled = index >= maxIndex;
  }

  prevBtn.addEventListener('click', () => slide(-1));
  nextBtn.addEventListener('click', () => slide(1));
  
  // Recalculate on window resize for edge-to-edge precision
  window.addEventListener('resize', () => slide(0));

  // Initialize
  slide(0);
})();

(function initCategoriesSlider() {
  const track = document.getElementById('categoriesTrack');
  const prevBtn = document.getElementById('categoriesPrev');
  const nextBtn = document.getElementById('categoriesNext');
  
  if (!track || !prevBtn || !nextBtn) return;

  let index = 0;

  function slide(dir) {
    const cards = track.querySelectorAll('.category-explore-card');
    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = 16;
    const scrollAmount = cardWidth + gap;
    
    // Total items minus the 6 that are visible
    const maxIndex = Math.max(0, cards.length - 6);

    index = Math.max(0, Math.min(index + dir, maxIndex));
    track.style.transform = `translateX(-${index * scrollAmount}px)`;
    
    // Update arrow visibility/opacity
    prevBtn.style.opacity = index === 0 ? "0.2" : "1";
    nextBtn.style.opacity = index >= maxIndex ? "0.2" : "1";
  }

  prevBtn.addEventListener('click', () => slide(-1));
  nextBtn.addEventListener('click', () => slide(1));
  window.addEventListener('resize', () => slide(0));
  
  // Initial State
  slide(0);
})();