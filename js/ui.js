/*
   UI.JS — Nav, Reveal, Modal (with size selector + star rating),
           Toast, Carousel, Review Form, Page Loader
*/

window.XNOTE = window.XNOTE || {};

XNOTE.ui = (function () {
  'use strict';

  /* ── Page Loader ──────────────────────────────────────── */
  function initLoader() {
    const loader = document.getElementById('page-loader');
    if (!loader) return;
    const hide = () => setTimeout(() => loader.classList.add('hidden'), 500);
    if (document.readyState === 'complete') hide();
    else window.addEventListener('load', hide);
  }

  /* ── Navigation ───────────────────────────────────────── */
  function initNav() {
    const nav    = document.getElementById('main-nav');
    const burger = nav?.querySelector('.nav__hamburger');
    const mobile = document.getElementById('mobile-menu');
    if (!nav) return;

    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    burger?.addEventListener('click', () => {
      const open = burger.classList.toggle('open');
      mobile?.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    mobile?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      burger?.classList.remove('open');
      mobile.classList.remove('open');
      document.body.style.overflow = '';
    }));

    const page = location.pathname.split('/').pop() || 'index.html';
    nav.querySelectorAll('[data-page]').forEach(l => l.classList.toggle('active', l.dataset.page === page));
    mobile?.querySelectorAll('[data-page]').forEach(l => l.classList.toggle('active', l.dataset.page === page));
  }

  /* ── Scroll Reveal ────────────────────────────────────── */
  function initReveal() {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const delay = parseInt(e.target.dataset.delay || 0);
        setTimeout(() => e.target.classList.add('is-visible'), delay);
        io.unobserve(e.target);
      });
    }, { threshold: 0.09 });

    document.querySelectorAll('.reveal:not(.is-visible)').forEach((el, i) => {
      if (!el.dataset.delay && el.closest('.products-grid, .wishlist-grid')) {
        el.dataset.delay = (i % 8) * 70;
      }
      io.observe(el);
    });
  }

  /* ── Toast ────────────────────────────────────────────── */
  let _toastTimer;
  function toast(msg) {
    let el = document.getElementById('xnote-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'xnote-toast';
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(() => el.classList.remove('show'), 2800);
  }

  /* ── Modal ────────────────────────────────────────────── */
  let _modalId   = null;
  let _modalSize = null;

  function openModal(productId) {
    const p = XNOTE.products.find(x => x.id === productId);
    if (!p) return;
    _modalId   = productId;
    _modalSize = XNOTE.getDefaultSize(p);

    const bd = document.getElementById('product-modal');
    if (!bd) return;

    // Image
    bd.querySelector('.modal__img').innerHTML =
      `<div style="position:relative;width:100%;height:100%;">${XNOTE.productImgHtml(p)}</div>`;

    // Text
    bd.querySelector('.modal__label').textContent = p.category;
    bd.querySelector('.modal__name').textContent  = p.name;
    bd.querySelector('.modal__desc').textContent  = p.description;

    // Size selector
    const sizeWrap = bd.querySelector('.modal__sizes');
    if (sizeWrap) {
      sizeWrap.innerHTML = p.sizes.map(s => `
        <button class="size-btn${s.label === _modalSize ? ' active' : ''}" data-size="${s.label}" data-price="${s.price}">
          ${s.label}
        </button>`).join('');
      sizeWrap.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          sizeWrap.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          _modalSize = btn.dataset.size;
          updateModalPrice();
        });
      });
    }

    updateModalPrice();

    // Notes
    bd.querySelector('.modal__notes-list').innerHTML =
      p.notes.map(n => `<span class="note-pill">${n}</span>`).join('');

    // Wish btn
    const wishBtn = bd.querySelector('[data-modal-wish]');
    if (wishBtn) wishBtn.classList.toggle('active', XNOTE.cart.isWished(productId));

    bd.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function updateModalPrice() {
    const p = XNOTE.products.find(x => x.id === _modalId);
    if (!p) return;
    const price = XNOTE.getPriceForSize(p, _modalSize);
    const el = document.querySelector('#product-modal .modal__price');
    if (el) el.textContent = '$' + price + ' / ' + _modalSize;
  }

  function closeModal() {
    document.getElementById('product-modal')?.classList.remove('open');
    document.body.style.overflow = '';
    _modalId = null;
  }

  function initModal() {
    const bd = document.getElementById('product-modal');
    if (!bd) return;
    bd.addEventListener('click', e => { if (e.target === bd) closeModal(); });
    bd.querySelector('.modal__close')?.addEventListener('click', closeModal);
    bd.querySelector('[data-modal-cart]')?.addEventListener('click', () => {
      if (_modalId) { XNOTE.cart.addToCart(_modalId, _modalSize); closeModal(); }
    });
    bd.querySelector('[data-modal-wish]')?.addEventListener('click', function() {
      if (_modalId) { const w = XNOTE.cart.toggleWish(_modalId); this.classList.toggle('active', w); }
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  }

  /* ── Review Modal ─────────────────────────────────────── */
  function initReviewModal() {
    const bd  = document.getElementById('review-modal');
    if (!bd) return;
    const closeBtn = bd.querySelector('.modal__close');
    closeBtn?.addEventListener('click', closeReviewModal);
    bd.addEventListener('click', e => { if (e.target === bd) closeReviewModal(); });

    // Star rating interaction
    const stars = bd.querySelectorAll('.star-input');
    let selectedStars = 5;
    stars.forEach(star => {
      star.addEventListener('click', () => {
        selectedStars = parseInt(star.dataset.val);
        stars.forEach(s => s.classList.toggle('active', parseInt(s.dataset.val) <= selectedStars));
      });
      star.addEventListener('mouseenter', () => {
        stars.forEach(s => s.classList.toggle('hover', parseInt(s.dataset.val) <= parseInt(star.dataset.val)));
      });
      star.addEventListener('mouseleave', () => stars.forEach(s => s.classList.remove('hover')));
    });
    // Set default 5 stars
    stars.forEach(s => s.classList.toggle('active', parseInt(s.dataset.val) <= 5));

    // Product select
    const prodSel = bd.querySelector('#review-product');
    if (prodSel) {
      prodSel.innerHTML = '<option value="">Select a fragrance</option>' +
        XNOTE.products.map(p => `<option value="${p.name}">${p.name}</option>`).join('');
    }

    // Submit
    bd.querySelector('#review-submit')?.addEventListener('click', () => {
      const name  = bd.querySelector('#review-name').value.trim();
      const prod  = bd.querySelector('#review-product').value;
      const quote = bd.querySelector('#review-quote').value.trim();
      if (!name || !prod || !quote) { toast('Please fill in all fields'); return; }
      XNOTE.submitReview(name, prod, selectedStars, quote);
      toast('Thank you for your review!');
      closeReviewModal();
      // Refresh testimonials if carousel present
      if (typeof window._refreshCarousel === 'function') window._refreshCarousel();
    });
  }

  function openReviewModal() {
    document.getElementById('review-modal')?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeReviewModal() {
    document.getElementById('review-modal')?.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ── Testimonials Carousel ────────────────────────────── */
  function buildCarousel(testimonials) {
    const track  = document.querySelector('.testimonials__track');
    const dotsEl = document.querySelector('.testimonials__dots');
    if (!track) return;

    track.innerHTML  = testimonials.map(t => buildTestimonialCard(t)).join('');
    if (dotsEl) dotsEl.innerHTML = testimonials.map((_, i) =>
      `<button class="testimonials__dot${i===0?' active':''}" aria-label="Slide ${i+1}"></button>`
    ).join('');
  }

  function initCarousel() {
    const wrap   = document.querySelector('.testimonials__track-wrap');
    const track  = document.querySelector('.testimonials__track');
    const btnPrev = document.querySelector('.testimonials__btn--prev');
    const btnNext = document.querySelector('.testimonials__btn--next');
    if (!track) return;

    let cur = 0, timer;

    function visible() {
      if (window.innerWidth < 600)  return 1;
      if (window.innerWidth < 960)  return 2;
      return 3;
    }
    function maxIdx() { return Math.max(0, track.children.length - visible()); }
    function goTo(n) {
      cur = Math.max(0, Math.min(n, maxIdx()));
      const w   = (track.querySelector('.testimonial-card')?.offsetWidth || 340) + 24;
      track.style.transform = `translateX(-${cur * w}px)`;
      document.querySelectorAll('.testimonials__dot').forEach((d, i) => d.classList.toggle('active', i === cur));
    }
    function next() { goTo(cur >= maxIdx() ? 0 : cur + 1); }
    function prev() { goTo(cur === 0 ? maxIdx() : cur - 1); }
    function startAuto() { clearInterval(timer); timer = setInterval(next, 5200); }

    btnNext?.addEventListener('click', () => { next(); startAuto(); });
    btnPrev?.addEventListener('click', () => { prev(); startAuto(); });
    document.querySelectorAll('.testimonials__dot').forEach((d, i) =>
      d.addEventListener('click', () => { goTo(i); startAuto(); })
    );

    // Drag
    let startX = 0;
    wrap?.addEventListener('mousedown', e => { startX = e.pageX; clearInterval(timer); e.preventDefault(); });
    document.addEventListener('mouseup', e => {
      if (!startX) return;
      const diff = startX - e.pageX; startX = 0;
      if (Math.abs(diff) > 55) diff > 0 ? next() : prev();
      startAuto();
    });
    wrap?.addEventListener('touchstart', e => { startX = e.touches[0].pageX; }, { passive: true });
    wrap?.addEventListener('touchend',   e => {
      const diff = startX - e.changedTouches[0].pageX;
      if (Math.abs(diff) > 45) diff > 0 ? next() : prev();
      startAuto();
    }, { passive: true });

    window.addEventListener('resize', () => goTo(cur), { passive: true });
    goTo(0);
    startAuto();

    // Expose refresh
    window._refreshCarousel = function() {
      buildCarousel(XNOTE.getAllTestimonials());
      initCarousel();
    };
  }

  /* ── Card builders ────────────────────────────────────── */
  function buildProductCard(product, delay) {
    const defaultPrice = XNOTE.getDefaultPrice(product);
    const isW = XNOTE.cart.isWished(product.id);
    return `
      <article class="product-card reveal" data-id="${product.id}"${delay !== undefined ? ` data-delay="${delay}"` : ''}>
        <div class="product-card__img-wrap">
          ${product.badge ? `<span class="badge product-card__badge">${product.badge}</span>` : ''}
          <button class="product-card__wish${isW?' active':''}"
            data-wish-btn="${product.id}"
            aria-label="Add to favourites"
            onclick="event.stopPropagation();
              const w=XNOTE.cart.toggleWish('${product.id}');
              this.classList.toggle('active',w);
              this.classList.add('pulse');
              setTimeout(()=>this.classList.remove('pulse'),400);">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
          <div style="position:relative;width:100%;height:100%;">${XNOTE.productImgHtml(product)}</div>
          <div class="product-card__overlay">
            <div class="product-card__overlay-actions">
              <button class="btn btn--primary" onclick="event.stopPropagation();XNOTE.ui.openModal('${product.id}')">Add to Cart</button>
              <button class="btn btn--outline" onclick="event.stopPropagation();XNOTE.ui.openModal('${product.id}')">Details</button>
            </div>
          </div>
        </div>
        <div class="product-card__info">
          <p class="product-card__category">${product.category}</p>
          <h3 class="product-card__name">${product.name}</h3>
          <p class="product-card__desc">${product.description}</p>
          <div class="product-card__footer">
            <div>
              <span class="product-card__price">From $${defaultPrice}</span>
              <span class="product-card__price-unit">${product.sizes.map(s=>s.label).join(' / ')}</span>
            </div>
            <button class="btn btn--outline" style="padding:.55rem 1rem;font-size:.6rem;"
              onclick="event.stopPropagation();XNOTE.ui.openModal('${product.id}')">Order</button>
          </div>
        </div>
      </article>`;
  }

  function buildTestimonialCard(t) {
    const stars = Array.from({length:5}, (_,i) =>
      `<span class="testimonial-card__star${i>=t.stars?' empty':''}">★</span>`).join('');
    return `
      <div class="testimonial-card">
        <div class="testimonial-card__stars">${stars}</div>
        <p class="testimonial-card__quote">${t.quote}</p>
        <div class="testimonial-card__author">
          <div class="testimonial-card__avatar">${t.avatar}</div>
          <div>
            <div class="testimonial-card__name">${t.name}</div>
            <div class="testimonial-card__product">${t.product}</div>
          </div>
        </div>
      </div>`;
  }

  /* ── Init ─────────────────────────────────────────────── */
  function init() {
    initLoader();
    initNav();
    initReveal();
    initModal();
    initReviewModal();
    XNOTE.cart.init();
    requestAnimationFrame(initCarousel);
  }

  return {
    init, toast,
    openModal, closeModal,
    openReviewModal, closeReviewModal,
    buildProductCard, buildTestimonialCard,
    buildCarousel, initCarousel, initReveal,
  };
})();

document.addEventListener('DOMContentLoaded', () => XNOTE.ui.init());
