document.addEventListener('DOMContentLoaded', function () {

  var grid        = document.getElementById('collection-grid');
  var noResults   = document.getElementById('collection-no-results');
  var searchInput = document.getElementById('collection-search-input');
  var searchClear = document.getElementById('collection-search-clear');

  var _activeFilter = 'all';
  var _searchQuery  = '';

  /* ── Search keywords map: boosts discovery with common terms ── */
  var KEYWORD_MAP = {
    'fresh':        ['fresh','citrus','light','clean','airy','morning','summer','lemon','grapefruit','neroli'],
    'woody':        ['woody','wood','cedar','sandalwood','oud','leather','earthy','warm'],
    'floral':       ['floral','flower','rose','jasmine','bloom','feminine','soft','bouquet'],
    'oriental':     ['oriental','spicy','exotic','amber','rich','warm','musk','resin','vanilla'],
    'smoky':        ['smoky','smoke','incense','dark','deep','resinous','vetiver','patchouli'],
    'masculine':    ['masculine','man','men','strong','bold','confident'],
    'feminine':     ['feminine','woman','women','soft','delicate','romantic'],
    'bestseller':   ['bestseller','best seller','popular','top','most ordered','trending'],
    'unique':       ['unique','rare','exclusive','special','signature'],
    'sweet':        ['sweet','candy','dessert','gourmand','vanilla','caramel'],
    'fresh air':    ['fresh air','clean air','outdoors','nature','green'],
    'night':        ['night','evening','date','dinner','sophisticated'],
    'day':          ['day','daytime','office','work','casual','everyday'],
    'summer':       ['summer','beach','holiday','vacation','bright'],
    'winter':       ['winter','cold','warm','cozy','festive'],
    'cheap':        ['cheap','affordable','budget','value','price'],
    'luxury':       ['luxury','premium','high end','expensive','niche'],
  };

  function _getSearchableText(p) {
    var parts = [
      p.name,
      p.category,
      p.description,
      p.badge || '',
      (p.notes || []).join(' '),
    ];
    /* Add virtual keywords */
    if (p.badge && p.badge.toLowerCase().includes('bestseller')) parts.push('popular most ordered trending');
    if (p.isUnique)   parts.push('unique rare exclusive signature');
    if (p.featured)   parts.push('featured top');
    return parts.join(' ').toLowerCase();
  }

  function _matchesQuery(p, query) {
    if (!query) return true;
    var text    = _getSearchableText(p);
    var tokens  = query.toLowerCase().trim().split(/\s+/);

    return tokens.every(function(token) {
      /* Direct text match */
      if (text.includes(token)) return true;
      /* Keyword map expansion */
      for (var key in KEYWORD_MAP) {
        var aliases = KEYWORD_MAP[key];
        if (aliases.some(function(a) { return a.includes(token) || token.includes(a); })) {
          if (text.includes(key) || aliases.some(function(a) { return text.includes(a); })) {
            return true;
          }
        }
      }
      return false;
    });
  }

  function renderGrid() {
    var list = XNOTE.products.filter(function(p) {
      var catMatch = _activeFilter === 'all' || p.categoryKey === _activeFilter;
      var qryMatch = _matchesQuery(p, _searchQuery);
      return catMatch && qryMatch;
    });

    if (list.length === 0) {
      grid.innerHTML = '';
      if (noResults) noResults.style.display = 'block';
    } else {
      if (noResults) noResults.style.display = 'none';
      grid.innerHTML = list.map(function(p, i) {
        return XNOTE.ui.buildProductCard(p, i * 60);
      }).join('');
      XNOTE.ui.initReveal();
      grid.querySelectorAll('.product-card').forEach(function(card) {
        card.addEventListener('click', function() { XNOTE.ui.openModal(card.dataset.id); });
      });
    }
  }

  renderGrid();

  /* Filter tabs */
  document.querySelectorAll('.filter-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.filter-tab').forEach(function(t) { t.classList.remove('active'); });
      tab.classList.add('active');
      _activeFilter = tab.dataset.filter;
      renderGrid();
    });
  });

  /* Search input */
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      _searchQuery = this.value.trim();
      if (searchClear) searchClear.style.display = _searchQuery ? 'flex' : 'none';
      renderGrid();
    });

    /* Focus shows placeholder suggestions */
    searchInput.addEventListener('focus', function() {
      this.placeholder = 'Try: rose, oud, fresh, bestseller, gift, night…';
    });
    searchInput.addEventListener('blur', function() {
      this.placeholder = 'Search by name, note, or mood… e.g. rose, oud, fresh, bestseller';
    });
  }

  if (searchClear) {
    searchClear.addEventListener('click', function() {
      if (searchInput) { searchInput.value = ''; searchInput.focus(); }
      _searchQuery = '';
      searchClear.style.display = 'none';
      renderGrid();
    });
  }

  /* Testimonials */
  XNOTE.ui.buildCarousel(XNOTE.getAllTestimonials());
  XNOTE.ui.initCarousel();

  /* Footer links */
  var fp = document.getElementById('footer-products');
  if (fp) {
    fp.innerHTML = XNOTE.products.map(function(p) {
      return '<a href="collection.html" class="footer__link">' + p.name + '</a>';
    }).join('');
  }
});
