document.addEventListener('DOMContentLoaded', function () {

  var grid = document.getElementById('collection-grid');

  function renderGrid(filter) {
    var list = filter === 'all'
      ? XNOTE.products
      : XNOTE.products.filter(function (p) { return p.categoryKey === filter; });

    grid.innerHTML = list.map(function (p, i) {
      return XNOTE.ui.buildProductCard(p, i * 60);
    }).join('');

    XNOTE.ui.initReveal();

    grid.querySelectorAll('.product-card').forEach(function (card) {
      card.addEventListener('click', function () { XNOTE.ui.openModal(card.dataset.id); });
    });
  }

  renderGrid('all');

  document.querySelectorAll('.filter-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.filter-tab').forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      renderGrid(tab.dataset.filter);
    });
  });

  /* Testimonials */
  XNOTE.ui.buildCarousel(XNOTE.getAllTestimonials());
  XNOTE.ui.initCarousel();

  /* Footer links */
  var fp = document.getElementById('footer-products');
  if (fp) {
    fp.innerHTML = XNOTE.products.map(function (p) {
      return '<a href="collection.html" class="footer__link">' + p.name + '</a>';
    }).join('');
  }
});
