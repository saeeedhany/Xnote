document.addEventListener('DOMContentLoaded', function () {

  /* Signature carousel */
  var track    = document.getElementById('signature-track');
  var prevBtn  = document.getElementById('sig-prev');
  var nextBtn  = document.getElementById('sig-next');
  var dotsWrap = document.getElementById('sig-dots');

  if (track) {
    var featured = XNOTE.products.filter(function (p) { return p.isUnique; });
    var cur      = 0;
    var total    = featured.length;
    var autoTimer;

    /* Build cards */
    track.innerHTML = featured.map(function (p, i) {
      return XNOTE.ui.buildProductCard(p, 0);
    }).join('');

    XNOTE.ui.initReveal();

    track.querySelectorAll('.product-card').forEach(function (card) {
      card.addEventListener('click', function () { XNOTE.ui.openModal(card.dataset.id); });
    });

    /* Build dots */
    if (dotsWrap) {
      dotsWrap.innerHTML = featured.map(function (_, i) {
        return '<button class="sig-dot' + (i === 0 ? ' active' : '') + '" aria-label="Go to slide ' + (i + 1) + '"></button>';
      }).join('');
    }

    function getVisible() {
      if (window.innerWidth >= 1100) return 3;
      if (window.innerWidth >= 700)  return 2;
      return 1;
    }

    function getCardWidth() {
      var card = track.querySelector('.product-card');
      if (!card) return 0;
      var style = window.getComputedStyle(card);
      return card.offsetWidth + parseInt(style.marginRight || 0);
    }

    function goTo(n) {
      var vis  = getVisible();
      var max  = Math.max(0, total - vis);
      cur = Math.max(0, Math.min(n, max));
      var w = getCardWidth();
      track.style.transform = 'translateX(-' + (cur * w) + 'px)';

      /* Update dots */
      if (dotsWrap) {
        dotsWrap.querySelectorAll('.sig-dot').forEach(function (d, i) {
          d.classList.toggle('active', i === cur);
        });
      }
    }

    function next() { goTo(cur + 1 > Math.max(0, total - getVisible()) ? 0 : cur + 1); }
    function prev() { var max = Math.max(0, total - getVisible()); goTo(cur === 0 ? max : cur - 1); }

    function startAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(next, 4500);
    }

    if (nextBtn) nextBtn.addEventListener('click', function () { next(); startAuto(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); startAuto(); });

    if (dotsWrap) {
      dotsWrap.querySelectorAll('.sig-dot').forEach(function (d, i) {
        d.addEventListener('click', function () { goTo(i); startAuto(); });
      });
    }

    /* Touch / drag swipe */
    var startX = 0;
    track.addEventListener('touchstart', function (e) { startX = e.touches[0].pageX; }, { passive: true });
    track.addEventListener('touchend',   function (e) {
      var diff = startX - e.changedTouches[0].pageX;
      if (Math.abs(diff) > 40) { diff > 0 ? next() : prev(); startAuto(); }
    }, { passive: true });

    window.addEventListener('resize', function () { goTo(cur); }, { passive: true });

    goTo(0);
    startAuto();
  }

  /* Testimonials carousel */
  XNOTE.ui.buildCarousel(XNOTE.getAllTestimonials());
  XNOTE.ui.initCarousel();

  /* Footer product links */
  var fp = document.getElementById('footer-products');
  if (fp) {
    fp.innerHTML = XNOTE.products.map(function (p) {
      return '<a href="collection.html" class="footer__link">' + p.name + '</a>';
    }).join('');
  }
});
