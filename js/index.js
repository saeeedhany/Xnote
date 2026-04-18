document.addEventListener('DOMContentLoaded', function () {

  /* Render featured (unique) products */
  var grid = document.getElementById('featured-grid');
  if (grid) {
    var featured = XNOTE.products.filter(function (p) { return p.isUnique; });
    grid.innerHTML = featured.map(function (p, i) {
      return XNOTE.ui.buildProductCard(p, i * 80);
    }).join('');
    XNOTE.ui.initReveal();
    grid.querySelectorAll('.product-card').forEach(function (card) {
      card.addEventListener('click', function () { XNOTE.ui.openModal(card.dataset.id); });
    });
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
