window.XNOTE = window.XNOTE || {};

XNOTE.ui = (function () {
  'use strict';

  /* Page Loader */
  function initLoader() {
    var loader = document.getElementById('page-loader');
    if (!loader) return;
    function hide() { setTimeout(function () { loader.classList.add('hidden'); }, 500); }
    if (document.readyState === 'complete') { hide(); }
    else { window.addEventListener('load', hide); }
  }

  /* Navigation */
  function initNav() {
    var nav    = document.getElementById('main-nav');
    var burger = nav && nav.querySelector('.nav__hamburger');
    var mobile = document.getElementById('mobile-menu');
    if (!nav) return;

    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    if (burger && mobile) {
      burger.addEventListener('click', function () {
        var open = burger.classList.toggle('open');
        mobile.classList.toggle('open', open);
        document.body.style.overflow = open ? 'hidden' : '';
      });
      mobile.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          burger.classList.remove('open');
          mobile.classList.remove('open');
          document.body.style.overflow = '';
        });
      });
    }

    var page = location.pathname.split('/').pop() || 'index.html';
    nav.querySelectorAll('[data-page]').forEach(function (l) { l.classList.toggle('active', l.dataset.page === page); });
    if (mobile) mobile.querySelectorAll('[data-page]').forEach(function (l) { l.classList.toggle('active', l.dataset.page === page); });
  }

  /* Scroll Reveal */
  function initReveal() {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var delay = parseInt(e.target.dataset.delay || 0);
        setTimeout(function () { e.target.classList.add('is-visible'); }, delay);
        io.unobserve(e.target);
      });
    }, { threshold: 0.09 });

    document.querySelectorAll('.reveal:not(.is-visible)').forEach(function (el, i) {
      if (!el.dataset.delay && el.closest('.products-grid, .wishlist-grid, .footer__grid')) {
        el.dataset.delay = String((i % 8) * 70);
      }
      io.observe(el);
    });
  }

  /* Toast */
  var _toastTimer;
  function toast(msg) {
    var el = document.getElementById('xnote-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'xnote-toast';
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(function () { el.classList.remove('show'); }, 2800);
  }

  /* Product Modal */
  var _modalId   = null;
  var _modalSize = null;

  function openModal(productId) {
    var p = XNOTE.products.find(function (x) { return x.id === productId; });
    if (!p) return;
    _modalId   = productId;
    _modalSize = XNOTE.getDefaultSize(p);

    var bd = document.getElementById('product-modal');
    if (!bd) return;

    bd.querySelector('.modal__img').innerHTML = XNOTE.productImgHtml(p);
    bd.querySelector('.modal__label').textContent = p.category;
    bd.querySelector('.modal__name').textContent  = p.name;
    bd.querySelector('.modal__desc').textContent  = p.description;

    /* Size buttons */
    var sizeWrap = bd.querySelector('.modal__sizes');
    if (sizeWrap) {
      sizeWrap.innerHTML = p.sizes.map(function (s) {
        return '<button class="size-btn' + (s.label === _modalSize ? ' active' : '') +
               '" data-size="' + s.label + '">' + s.label + '</button>';
      }).join('');
      sizeWrap.querySelectorAll('.size-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          sizeWrap.querySelectorAll('.size-btn').forEach(function (b) { b.classList.remove('active'); });
          btn.classList.add('active');
          _modalSize = btn.dataset.size;
          _updateModalPrice();
        });
      });
    }
    _updateModalPrice();

    bd.querySelector('.modal__notes-list').innerHTML =
      p.notes.map(function (n) { return '<span class="note-pill">' + n + '</span>'; }).join('');

    var wishBtn = bd.querySelector('[data-modal-wish]');
    if (wishBtn) wishBtn.classList.toggle('active', XNOTE.cart.isWished(productId));

    bd.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function _updateModalPrice() {
    var p = XNOTE.products.find(function (x) { return x.id === _modalId; });
    if (!p) return;
    var el = document.querySelector('#product-modal .modal__price');
    if (el) el.textContent = XNOTE.formatPrice(XNOTE.getPriceForSize(p, _modalSize)) + ' / ' + _modalSize;
  }

  function closeModal() {
    var bd = document.getElementById('product-modal');
    if (bd) bd.classList.remove('open');
    document.body.style.overflow = '';
    _modalId = null;
  }

  function initModal() {
    var bd = document.getElementById('product-modal');
    if (!bd) return;
    bd.addEventListener('click', function (e) { if (e.target === bd) closeModal(); });
    var closeBtn = bd.querySelector('.modal__close');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    var cartBtn = bd.querySelector('[data-modal-cart]');
    if (cartBtn) cartBtn.addEventListener('click', function () {
      if (_modalId) { XNOTE.cart.addToCart(_modalId, _modalSize); closeModal(); }
    });

    var wishBtn = bd.querySelector('[data-modal-wish]');
    if (wishBtn) wishBtn.addEventListener('click', function () {
      if (_modalId) {
        var w = XNOTE.cart.toggleWish(_modalId);
        wishBtn.classList.toggle('active', w);
      }
    });

    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });
  }

  /* Review Modal */
  var _selectedStars = 5;

  function initReviewModal() {
    var bd = document.getElementById('review-modal');
    if (!bd) return;

    bd.addEventListener('click', function (e) { if (e.target === bd) closeReviewModal(); });
    var closeBtn = bd.querySelector('.modal__close');
    if (closeBtn) closeBtn.addEventListener('click', closeReviewModal);

    /* Star rating */
    var stars = bd.querySelectorAll('.star-input');
    _selectedStars = 5;
    stars.forEach(function (star) {
      star.classList.toggle('active', parseInt(star.dataset.val) <= 5);
    });
    stars.forEach(function (star) {
      star.addEventListener('click', function () {
        _selectedStars = parseInt(star.dataset.val);
        stars.forEach(function (s) { s.classList.toggle('active', parseInt(s.dataset.val) <= _selectedStars); });
      });
      star.addEventListener('mouseenter', function () {
        stars.forEach(function (s) { s.classList.toggle('hover', parseInt(s.dataset.val) <= parseInt(star.dataset.val)); });
      });
      star.addEventListener('mouseleave', function () {
        stars.forEach(function (s) { s.classList.remove('hover'); });
      });
    });

    /* Populate product select */
    var sel = bd.querySelector('#review-product');
    if (sel) {
      sel.innerHTML = '<option value="">Select a fragrance</option>' +
        XNOTE.products.map(function (p) {
          return '<option value="' + p.name + '">' + p.name + '</option>';
        }).join('');
    }

    /* Submit */
    var submitBtn = bd.querySelector('#review-submit');
    if (submitBtn) submitBtn.addEventListener('click', function () {
      var name  = (bd.querySelector('#review-name').value  || '').trim();
      var prod  = (bd.querySelector('#review-product').value || '').trim();
      var quote = (bd.querySelector('#review-quote').value  || '').trim();
      if (!name || !prod || !quote) { toast('Please fill in all fields'); return; }
      XNOTE.submitReview(name, prod, _selectedStars, quote);
      toast('Thank you for your review!');
      closeReviewModal();
      if (typeof window.refreshCarousel === 'function') window.refreshCarousel();
    });
  }

  function openReviewModal()  { var bd = document.getElementById('review-modal'); if (bd) { bd.classList.add('open'); document.body.style.overflow = 'hidden'; } }
  function closeReviewModal() { var bd = document.getElementById('review-modal'); if (bd) bd.classList.remove('open'); document.body.style.overflow = ''; }

  /* ── Testimonials Carousel ────────────────────────────── */
  function buildCarousel(testimonials) {
    var track  = document.querySelector('.testimonials__track');
    var dotsEl = document.querySelector('.testimonials__dots');
    if (!track) return;
    track.innerHTML  = testimonials.map(buildTestimonialCard).join('');
    if (dotsEl) dotsEl.innerHTML = testimonials.map(function (_, i) {
      return '<button class="testimonials__dot' + (i === 0 ? ' active' : '') + '" aria-label="Slide ' + (i+1) + '"></button>';
    }).join('');
  }

  function initCarousel() {
    var wrap    = document.querySelector('.testimonials__track-wrap');
    var track   = document.querySelector('.testimonials__track');
    var btnPrev = document.querySelector('.testimonials__btn--prev');
    var btnNext = document.querySelector('.testimonials__btn--next');
    if (!track) return;

    var cur = 0, timer;

    function visible() { return window.innerWidth < 600 ? 1 : window.innerWidth < 960 ? 2 : 3; }
    function maxIdx()  { return Math.max(0, track.children.length - visible()); }
    function goTo(n) {
      cur = Math.max(0, Math.min(n, maxIdx()));
      var card = track.querySelector('.testimonial-card');
      var w    = card ? (card.offsetWidth + 24) : 364;
      track.style.transform = 'translateX(-' + (cur * w) + 'px)';
      document.querySelectorAll('.testimonials__dot').forEach(function (d, i) { d.classList.toggle('active', i === cur); });
    }
    function next() { goTo(cur >= maxIdx() ? 0 : cur + 1); }
    function prev() { goTo(cur === 0 ? maxIdx() : cur - 1); }
    function startAuto() { clearInterval(timer); timer = setInterval(next, 5200); }

    if (btnNext) btnNext.addEventListener('click', function () { next(); startAuto(); });
    if (btnPrev) btnPrev.addEventListener('click', function () { prev(); startAuto(); });
    document.querySelectorAll('.testimonials__dot').forEach(function (d, i) {
      d.addEventListener('click', function () { goTo(i); startAuto(); });
    });

    var startX = 0;
    if (wrap) {
      wrap.addEventListener('mousedown', function (e) { startX = e.pageX; clearInterval(timer); e.preventDefault(); });
      wrap.addEventListener('touchstart', function (e) { startX = e.touches[0].pageX; }, { passive: true });
    }
    document.addEventListener('mouseup', function (e) {
      if (!startX) return;
      var diff = startX - e.pageX; startX = 0;
      if (Math.abs(diff) > 55) { diff > 0 ? next() : prev(); }
      startAuto();
    });
    if (wrap) wrap.addEventListener('touchend', function (e) {
      var diff = startX - e.changedTouches[0].pageX;
      if (Math.abs(diff) > 45) { diff > 0 ? next() : prev(); }
      startAuto();
    }, { passive: true });

    window.addEventListener('resize', function () { goTo(cur); }, { passive: true });
    goTo(0);
    startAuto();

    window.refreshCarousel = function () {
      buildCarousel(XNOTE.getAllTestimonials());
      initCarousel();
    };

    /* Expose for hover buttons */
    XNOTE.ui.carouselNext = function () { next(); startAuto(); };
    XNOTE.ui.carouselPrev = function () { prev(); startAuto(); };
  }

  /* Card builders */
  function buildProductCard(product, delay) {
    var defaultPrice = XNOTE.getDefaultPrice(product);
    var isW  = XNOTE.cart.isWished(product.id);
    var del  = delay !== undefined ? ' data-delay="' + delay + '"' : '';

    return (
      '<article class="product-card reveal" data-id="' + product.id + '"' + del + '>' +
        '<div class="product-card__img-wrap">' +
          (product.badge ? '<span class="badge product-card__badge">' + product.badge + '</span>' : '') +
          '<button class="product-card__wish' + (isW ? ' active' : '') + '"' +
            ' data-wish-btn="' + product.id + '"' +
            ' aria-label="Add to favourites"' +
            ' onclick="event.stopPropagation();' +
              'var w=XNOTE.cart.toggleWish(\'' + product.id + '\');' +
              'this.classList.toggle(\'active\',w);' +
              'this.classList.add(\'pulse\');' +
              'var self=this;setTimeout(function(){self.classList.remove(\'pulse\');},400);">' +
            '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' +
          '</button>' +
          '<div class="product-card__placeholder-wrap">' + XNOTE.productImgHtml(product) + '</div>' +
          '<div class="product-card__overlay">' +
            '<div class="product-card__overlay-actions">' +
              '<button class="btn btn--primary" onclick="event.stopPropagation();XNOTE.cart.addToCart(\'' + product.id + '\', null, 1)">Add to Cart</button>' +
              '<button class="btn btn--outline"  onclick="event.stopPropagation();XNOTE.ui.openModal(\'' + product.id + '\')">Details</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="product-card__info">' +
          '<p class="product-card__category">' + product.category + '</p>' +
          '<h3 class="product-card__name">' + product.name + '</h3>' +
          '<p class="product-card__desc">' + product.description + '</p>' +
          '<div class="product-card__footer">' +
            '<div>' +
              '<span class="product-card__price">From ' + XNOTE.formatPrice(defaultPrice) + '</span>' +
              '<span class="product-card__price-unit">' + product.sizes.map(function (s) { return s.label; }).join(' / ') + '</span>' +
            '</div>' +
            '<button class="btn btn--outline btn--sm" onclick="event.stopPropagation();XNOTE.cart.addToCart(\'' + product.id + '\', null, 1)">Order</button>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  function buildTestimonialCard(t) {
    var stars = Array.from({ length: 5 }, function (_, i) {
      return '<span class="testimonial-card__star' + (i >= t.stars ? ' empty' : '') + '">\u2605</span>';
    }).join('');
    return (
      '<div class="testimonial-card">' +
        '<div class="testimonial-card__stars">' + stars + '</div>' +
        '<p class="testimonial-card__quote">' + t.quote + '</p>' +
        '<div class="testimonial-card__author">' +
          '<div class="testimonial-card__avatar">' + t.avatar + '</div>' +
          '<div>' +
            '<div class="testimonial-card__name">' + t.name + '</div>' +
            '<div class="testimonial-card__product">' + t.product + '</div>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  /* Init */
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
    init,
    toast,
    openModal,
    closeModal,
    openReviewModal,
    closeReviewModal,
    buildProductCard,
    buildTestimonialCard,
    buildCarousel,
    initCarousel,
    carouselNext: function () {},
    carouselPrev: function () {},
    initReveal,
  };
}());

document.addEventListener('DOMContentLoaded', function () { XNOTE.ui.init(); });
