window.XNOTE = window.XNOTE || {};

XNOTE.cart = (function () {
  'use strict';

  const CART_KEY = 'xnote_cart_v2';
  const WISH_KEY = 'xnote_wish_v2';

  /* Raw storage helpers */
  function readCart()      { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
  function readWish()      { return JSON.parse(localStorage.getItem(WISH_KEY) || '[]'); }
  function writeCart(arr)  { localStorage.setItem(CART_KEY, JSON.stringify(arr)); }
  function writeWish(arr)  { localStorage.setItem(WISH_KEY, JSON.stringify(arr)); }

  /* Bundle add */
  function addBundleToCart(bundle) {
    var key   = 'bundle|' + bundle.id;
    var items = readCart();
    var found = items.find(i => i.key === key);
    if (found) {
      found.qty = Math.min(found.qty + 1, 10);
    } else {
      items.push({ key, id: bundle.id, size: 'Bundle', qty: 1, isBundle: true, bundlePrice: bundle.price, bundleName: bundle.name, bundleImage: bundle.image || null });
    }
    writeCart(items);
    _syncUI();
    _refreshPageCartIfPresent();
    XNOTE.ui.toast(bundle.name + ' added to cart');
    _bump('[data-cart-count]');
  }

  /* Cart operations */
  function addToCart(productId, sizeLabel, qty) {
    const product = XNOTE.products.find(p => p.id === productId);
    if (!product) return;

    sizeLabel = sizeLabel || XNOTE.getDefaultSize(product);
    qty       = parseInt(qty) || 1;

    const key   = productId + '|' + sizeLabel;
    const items = readCart();
    const found = items.find(i => i.key === key);

    if (found) {
      found.qty = Math.min(found.qty + qty, 10);
    } else {
      items.push({ key, id: productId, size: sizeLabel, qty });
    }

    writeCart(items);
    _syncUI();
    _refreshPageCartIfPresent();
    XNOTE.ui.toast(product.name + ' (' + sizeLabel + ') added to cart');
    _bump('[data-cart-count]');
  }

  function removeFromCart(key) {
    writeCart(readCart().filter(i => i.key !== key));
    _syncUI();
    _refreshPageCartIfPresent();
    _renderPanel();
  }

  function changeQty(key, delta) {
    const items = readCart();
    const item  = items.find(i => i.key === key);
    if (!item) return;
    item.qty = Math.max(1, Math.min(item.qty + delta, 10));
    writeCart(items);
    _syncUI();
    _refreshPageCartIfPresent();
    _renderPanel();
  }

  function clearCart() {
    writeCart([]);
    _syncUI();
    _refreshPageCartIfPresent();
    _renderPanel();
  }

  /* Wishlist operations */
  function toggleWish(productId) {
    const product = XNOTE.products.find(p => p.id === productId);
    if (!product) return false;

    const list = readWish();
    const idx  = list.indexOf(productId);
    if (idx === -1) {
      list.push(productId);
      XNOTE.ui.toast(product.name + ' saved to favourites ♡');
    } else {
      list.splice(idx, 1);
      XNOTE.ui.toast(product.name + ' removed from favourites');
    }
    writeWish(list);
    _syncWishButtons();
    _bump('[data-wish-count]');
    _refreshPageCartIfPresent();
    if (XNOTE.ui && XNOTE.ui.updateFavCount) XNOTE.ui.updateFavCount();
    return list.includes(productId);
  }

  function isWished(productId) {
    return readWish().includes(productId);
  }

  /* Totals */
  function getTotal() {
    return readCart().reduce(function (sum, item) {
      if (item.isBundle) return sum + (item.bundlePrice * item.qty);
      var p = XNOTE.products.find(x => x.id === item.id);
      return sum + (p ? XNOTE.getPriceForSize(p, item.size) * item.qty : 0);
    }, 0);
  }

  function getCartSummary() {
    return readCart().map(function (item) {
      if (item.isBundle) {
        return item.bundleName + ' (Bundle) x' + item.qty + ' = ' + XNOTE.formatPrice(item.bundlePrice * item.qty);
      }
      var p = XNOTE.products.find(x => x.id === item.id);
      if (!p) return '';
      var price = XNOTE.getPriceForSize(p, item.size);
      return p.name + ' (' + item.size + ') x' + item.qty + ' = ' + XNOTE.formatPrice(price * item.qty);
    }).filter(Boolean).join('\n');
  }

  /* WhatsApp */
  function openWhatsApp(details) {
    var items = readCart();
    var msg   = '\uD83D\uDECD\uFE0F *New X Note Order*\n\n';
    msg += '*Customer Details:*\n';
    msg += '\u2022 Name: '    + details.name    + '\n';
    msg += '\u2022 Phone: '   + details.phone   + '\n';
    if (details.email)   msg += '\u2022 Email: '   + details.email   + '\n';
    msg += '\u2022 Address: ' + details.address + '\n\n';
    msg += '*Order Items:*\n';
    items.forEach(function (item) {
      var p = XNOTE.products.find(x => x.id === item.id);
      if (!p) return;
      var price = XNOTE.getPriceForSize(p, item.size);
      msg += '\u2022 ' + p.name + ' (' + item.size + ') x' + item.qty + ' = ' + XNOTE.formatPrice(price * item.qty) + '\n';
    });
    msg += '\n*Total: ' + XNOTE.formatPrice(getTotal()) + '*\n';
    if (details.shipping) msg += '*Shipping: ' + details.shipping + '*\n';
    if (details.payment) {
      msg += '*Payment Method: ' + details.payment + '*\n';
      if (details.payment === 'InstaPay')       msg += '_Please send payment to InstaPay: 01000000000_\n';
      if (details.payment === 'Vodafone Cash')  msg += '_Please send payment to Vodafone Cash: 01000000000_\n';
    }
    if (details.notes)    msg += '\nNotes: ' + details.notes + '\n';
    msg += '\n_We will confirm your order and send updates to your phone' + (details.email ? ' and email' : '') + '._';

    var number = (XNOTE.whatsappNumber || '').replace(/[^0-9]/g, '');
    window.open('https://wa.me/' + number + '?text=' + encodeURIComponent(msg), '_blank');
  }

  /* UI sync helpers */
  function _syncUI() {
    var count = readCart().reduce(function (s, i) { return s + i.qty; }, 0);

    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      el.textContent   = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });

    var panelCount = document.querySelector('.cart-panel__count');
    if (panelCount) panelCount.textContent = count + ' item' + (count !== 1 ? 's' : '');

    var totalEl = document.querySelector('.cart-panel__total-price');
    if (totalEl) totalEl.textContent = XNOTE.formatPrice(getTotal());
  }

  function _syncWishButtons() {
    var wish = readWish();
    document.querySelectorAll('[data-wish-btn]').forEach(function (btn) {
      btn.classList.toggle('active', wish.includes(btn.dataset.wishBtn));
    });
  }

  function _bump(selector) {
    document.querySelectorAll(selector).forEach(function (el) {
      el.classList.remove('bump');
      void el.offsetWidth;
      el.classList.add('bump');
    });
  }

  /* Cart slide-panel renderer */
  function _renderPanel() {
    var container = document.querySelector('.cart-panel__items');
    if (!container) return;

    var items = readCart();
    if (items.length === 0) {
      container.innerHTML =
        '<div class="cart-empty">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width:44px;height:44px;opacity:.2;color:var(--gold);display:block;margin:0 auto 1rem;">' +
            '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>' +
            '<line x1="3" y1="6" x2="21" y2="6"/>' +
            '<path d="M16 10a4 4 0 0 1-8 0"/>' +
          '</svg>' +
          '<p class="cart-empty__text">Your cart is empty</p>' +
          '<p class="cart-empty__sub">Discover our collection and add something beautiful</p>' +
        '</div>';
      return;
    }

    container.innerHTML = items.map(function (item) {
      if (item.isBundle) {
        var imgHtml = item.bundleImage
          ? '<img src="' + item.bundleImage + '" alt="' + item.bundleName + '" class="product-real-img" loading="lazy">'
          : '<div class="product-placeholder-box visible"></div>';
        return (
          '<div class="cart-item" data-key="' + item.key + '">' +
            '<div class="cart-item__img">' + imgHtml + '</div>' +
            '<div class="cart-item__info">' +
              '<div class="cart-item__name">' + item.bundleName + '</div>' +
              '<div class="cart-item__variant">Bundle · 3 fragrances</div>' +
              '<div class="cart-item__qty">' +
                '<button class="cart-item__qty-btn" onclick="XNOTE.cart.changeQty(\'' + item.key + '\',-1)">−</button>' +
                '<span class="cart-item__qty-num">' + item.qty + '</span>' +
                '<button class="cart-item__qty-btn" onclick="XNOTE.cart.changeQty(\'' + item.key + '\',1)">+</button>' +
              '</div>' +
            '</div>' +
            '<div class="cart-item__actions">' +
              '<span class="cart-item__price">' + XNOTE.formatPrice(item.bundlePrice * item.qty) + '</span>' +
              '<button class="cart-item__remove" onclick="XNOTE.cart.removeFromCart(\'' + item.key + '\')">Remove</button>' +
            '</div>' +
          '</div>'
        );
      }
      var p = XNOTE.products.find(x => x.id === item.id);
      if (!p) return '';
      var price = XNOTE.getPriceForSize(p, item.size);
      return (
        '<div class="cart-item" data-key="' + item.key + '">' +
          '<div class="cart-item__img">' + XNOTE.productImgHtml(p) + '</div>' +
          '<div class="cart-item__info">' +
            '<div class="cart-item__name">' + p.name + '</div>' +
            '<div class="cart-item__variant">' + item.size + ' · ' + p.category + '</div>' +
            '<div class="cart-item__qty">' +
              '<button class="cart-item__qty-btn" onclick="XNOTE.cart.changeQty(\'' + item.key + '\',-1)">−</button>' +
              '<span class="cart-item__qty-num">' + item.qty + '</span>' +
              '<button class="cart-item__qty-btn" onclick="XNOTE.cart.changeQty(\'' + item.key + '\',1)">+</button>' +
            '</div>' +
          '</div>' +
          '<div class="cart-item__actions">' +
            '<span class="cart-item__price">' + XNOTE.formatPrice(price * item.qty) + '</span>' +
            '<button class="cart-item__remove" onclick="XNOTE.cart.removeFromCart(\'' + item.key + '\')">Remove</button>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    _syncUI();
  }

  /* Trigger page-level cart refresh if available */
  function _refreshPageCartIfPresent() {
    if (typeof window.renderPageCart === 'function') window.renderPageCart();
    if (typeof window.renderWishlist === 'function') window.renderWishlist();
    if (typeof window.renderRecommended === 'function') window.renderRecommended();
  }

  /* Panel open / close */
  function openPanel() {
    var panel    = document.querySelector('.cart-panel');
    var backdrop = document.querySelector('.cart-backdrop');
    if (panel)    panel.classList.add('open');
    if (backdrop) backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    _renderPanel();
  }

  function closePanel() {
    var panel    = document.querySelector('.cart-panel');
    var backdrop = document.querySelector('.cart-backdrop');
    if (panel)    panel.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* Listen for cross-tab storage changes */
  window.addEventListener('storage', function (e) {
    if (e.key === CART_KEY || e.key === WISH_KEY) {
      _syncUI();
      _syncWishButtons();
    }
  });

  /* Init */
  function init() {
    var backdrop = document.querySelector('.cart-backdrop');
    var closeBtn = document.querySelector('.cart-panel__close');
    if (backdrop) backdrop.addEventListener('click', closePanel);
    if (closeBtn) closeBtn.addEventListener('click', closePanel);
    document.querySelectorAll('[data-open-cart]').forEach(function (btn) {
      btn.addEventListener('click', openPanel);
    });
    _syncUI();
    _syncWishButtons();
  }

  /* Public API */
  return {
    init,
    addToCart,
    addBundleToCart,
    removeFromCart,
    changeQty,
    clearCart,
    toggleWish,
    isWished,
    openPanel,
    closePanel,
    getTotal,
    getCartSummary,
    openWhatsApp,
    readCart,
    readWish,
  };
}());
