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
    return Math.floor(document.getElementById('scrollWrapper').offsetWidth / CARD_WIDTH);
  }

  function getTotalCards() {
    return track.querySelectorAll('.category-card').length;
  }

  function slide(direction) {
    const maxIndex = getTotalCards() - getVisibleCount();
    categoryIndex = Math.max(0, Math.min(categoryIndex + direction, maxIndex));
    track.style.transform = `translateX(-${categoryIndex * CARD_WIDTH}px)`;
    updateButtons();
  }

  function updateButtons() {
    prevBtn.disabled = categoryIndex === 0;
    nextBtn.disabled = categoryIndex >= getTotalCards() - getVisibleCount();
  }

  if (prevBtn) prevBtn.addEventListener('click', () => slide(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => slide(1));

  const scrollWrapper = document.getElementById('scrollWrapper');
  if (scrollWrapper) {
    scrollWrapper.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (e.deltaY > 0 || e.deltaX > 0) slide(1);
      else slide(-1);
    }, { passive: false });
  }

  window.addEventListener('resize', () => { slide(0); updateButtons(); });
  updateButtons();


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
      farLeftCard.querySelector('img.recommended-img').alt  = slides[farLeftIndex].name;
      leftCard.querySelector('img.recommended-img').src     = slides[leftIndex].img;
      leftCard.querySelector('img.recommended-img').alt     = slides[leftIndex].name;
      activeCard.querySelector('img.recommended-img').src   = slides[currentIndex].img;
      activeCard.querySelector('img.recommended-img').alt   = slides[currentIndex].name;
      rightCard.querySelector('img.recommended-img').src    = slides[rightIndex].img;
      rightCard.querySelector('img.recommended-img').alt    = slides[rightIndex].name;
      farRightCard.querySelector('img.recommended-img').src = slides[farRightIndex].img;
      farRightCard.querySelector('img.recommended-img').alt = slides[farRightIndex].name;

      designerNameEl.textContent = slides[currentIndex].name;
    }

    function renderDots() {
      dotsEl.innerHTML = '';
      slides.forEach((s, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'recommended-dot' + (idx === currentIndex ? ' active' : '');
        btn.setAttribute('aria-label', `Go to slide ${idx + 1}`);
        btn.setAttribute('role', 'tab');
        btn.dataset.targetIndex = String(idx);
        btn.addEventListener('click', () => goToIndex(Number(btn.dataset.targetIndex)));
        dotsEl.appendChild(btn);
      });
    }

    function updateDotsActive() {
      Array.from(dotsEl.children).forEach(child => {
        child.classList.toggle('active', Number(child.dataset.targetIndex) === currentIndex);
      });
    }

    function stepToNext() {
      sliderEl.classList.remove('anim-prev');
      sliderEl.classList.add('anim-next');
      return new Promise(resolve => {
        setTimeout(() => {
          currentIndex = (currentIndex + 1) % slides.length;
          setSlotImages();
          updateDotsActive();
          sliderEl.classList.remove('anim-next');
          resolve();
        }, animDurationMs);
      });
    }

    function stepToPrev() {
      sliderEl.classList.remove('anim-next');
      sliderEl.classList.add('anim-prev');
      return new Promise(resolve => {
        setTimeout(() => {
          currentIndex = (currentIndex - 1 + slides.length) % slides.length;
          setSlotImages();
          updateDotsActive();
          sliderEl.classList.remove('anim-prev');
          resolve();
        }, animDurationMs);
      });
    }

    async function goToIndex(targetIndex) {
      if (animating || slides.length <= 1 || targetIndex === currentIndex) return;
      const n = slides.length;
      const distNext = (targetIndex - currentIndex + n) % n;
      const distPrev = (currentIndex - targetIndex + n) % n;
      animating = true;
      if (distNext <= distPrev) {
        for (let i = 0; i < distNext; i++) await stepToNext();
      } else {
        for (let i = 0; i < distPrev; i++) await stepToPrev();
      }
      animating = false;
    }

    setSlotImages();
    renderDots();
  })();


  // ─── Instagram Video Controls ────────────────────────────────────
  (function initInstagramVideoControls() {
    const cards = document.querySelectorAll('.instagram-strip--centered .ig-card');
    if (!cards.length) return;

    const items = [];

    function setPlayIcon(button, isPlaying) {
      button.innerHTML = isPlaying ? '<i data-lucide="pause"></i>' : '<i data-lucide="play"></i>';
    }

    cards.forEach(card => {
      const video   = card.querySelector('video');
      const playBtn = card.querySelector('.ig-play-toggle');
      const muteBtn = card.querySelector('.ig-mute-toggle');
      if (!video || !playBtn || !muteBtn) return;

      video.muted = true;
      video.currentTime = 0;
      setPlayIcon(playBtn, false);
      muteBtn.innerHTML = '<i data-lucide="volume-x"></i>';
      items.push({ video, playBtn, muteBtn });
    });

    if (!items.length) return;

    let currentIdx = 0;
    let autoAdvance = true;

    function syncPlayIcons() {
      items.forEach((item, idx) => setPlayIcon(item.playBtn, idx === currentIdx && !item.video.paused));
      lucide.createIcons();
    }

    function playOnly(index) {
      items.forEach((item, idx) => {
        if (idx === index) {
          item.video.play().catch(() => {});
        } else {
          item.video.pause();
          item.video.currentTime = 0;
        }
      });
      currentIdx = index;
      syncPlayIcons();
    }

    items.forEach((item, idx) => {
      item.video.addEventListener('ended', () => {
        if (idx === currentIdx && autoAdvance) playOnly((currentIdx + 1) % items.length);
      });

      item.playBtn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        if (idx !== currentIdx) { autoAdvance = true; playOnly(idx); return; }
        if (item.video.paused) { autoAdvance = true; item.video.play().catch(() => {}); }
        else { autoAdvance = false; item.video.pause(); }
        syncPlayIcons();
      });

      item.muteBtn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        item.video.muted = !item.video.muted;
        item.muteBtn.innerHTML = item.video.muted
          ? '<i data-lucide="volume-x"></i>'
          : '<i data-lucide="volume-2"></i>';
        lucide.createIcons();
      });
    });

    playOnly(0);
  })();


  // ─── Search Overlay ──────────────────────────────────────────────
  const searchOverlay = document.getElementById('search-overlay');
  const closeSearch   = document.getElementById('close-search');
  const searchInput   = document.getElementById('search-input');

  if (closeSearch && searchOverlay) {
    closeSearch.addEventListener('click', () => {
      searchOverlay.classList.remove('active');
    });
  }

});
