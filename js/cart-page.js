var SHEETS_ENDPOINT = ''; /* ← WEB APP URL */

window.renderPageCart = function () {
  var items    = XNOTE.cart.readCart();
  var listEl   = document.getElementById('page-cart-list');
  var countEl  = document.getElementById('page-cart-count');
  var totalsEl = document.getElementById('page-totals');
  var subEl    = document.getElementById('page-subtotal');
  var totalEl  = document.getElementById('page-total');
  if (!listEl) return;

  var count = items.reduce(function (s, i) { return s + i.qty; }, 0);
  if (countEl) countEl.textContent = count + ' item' + (count !== 1 ? 's' : '');

  if (items.length === 0) {
    listEl.innerHTML =
      '<div class="cp-empty">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
          '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>' +
          '<line x1="3" y1="6" x2="21" y2="6"/>' +
          '<path d="M16 10a4 4 0 0 1-8 0"/>' +
        '</svg>' +
        '<div class="cp-empty-title">Your cart is empty</div>' +
        '<p class="cp-empty-sub">Add something beautiful from the collection.</p>' +
        '<a href="collection.html" class="btn btn--outline">Explore Collection</a>' +
      '</div>';
    if (totalsEl) totalsEl.style.display = 'none';
    return;
  }

  var total = 0;
  listEl.innerHTML = items.map(function (item) {
    var p = XNOTE.products.find(function (x) { return x.id === item.id; });
    if (!p) return '';
    var price = XNOTE.getPriceForSize(p, item.size);
    var line  = price * item.qty;
    total += line;
    return (
      '<div class="cp-item" data-key="' + item.key + '">' +
        '<div class="cp-item__img">' + XNOTE.productImgHtml(p) + '</div>' +
        '<div>' +
          '<div class="cp-item__name">' + p.name + '</div>' +
          '<div class="cp-item__meta">' + item.size + ' · ' + XNOTE.formatPrice(price) + ' each</div>' +
          '<div class="cp-item__qty">' +
            '<button class="cp-qty-btn" onclick="XNOTE.cart.changeQty(\'' + item.key + '\',-1)">&#8722;</button>' +
            '<span class="cp-qty-num">' + item.qty + '</span>' +
            '<button class="cp-qty-btn" onclick="XNOTE.cart.changeQty(\'' + item.key + '\',1)">+</button>' +
          '</div>' +
        '</div>' +
        '<div class="cp-item__right">' +
          '<span class="cp-item__price">' + XNOTE.formatPrice(line) + '</span>' +
          '<button class="cp-item__remove" onclick="XNOTE.cart.removeFromCart(\'' + item.key + '\')">Remove</button>' +
        '</div>' +
      '</div>'
    );
  }).join('');

  if (subEl)    subEl.textContent   = XNOTE.formatPrice(total);
  if (totalEl)  totalEl.textContent = XNOTE.formatPrice(total);
  if (totalsEl) totalsEl.style.display = 'block';
};

/* Render wishlist */
window.renderWishlist = function () {
  var wish = XNOTE.cart.readWish();
  var grid = document.getElementById('wishlist-grid');
  if (!grid) return;

  if (wish.length === 0) {
    grid.innerHTML = '<p class="wishlist-empty">No saved items yet. Heart a fragrance to save it here.</p>';
    return;
  }

  var prods = XNOTE.products.filter(function (p) { return wish.includes(p.id); });
  grid.innerHTML = prods.map(function (p, i) { return XNOTE.ui.buildProductCard(p, i * 60); }).join('');
  XNOTE.ui.initReveal();
  grid.querySelectorAll('.product-card').forEach(function (c) {
    c.addEventListener('click', function () { XNOTE.ui.openModal(c.dataset.id); });
  });
};

/* Render recommended */
window.renderRecommended = function () {
  var cartIds = XNOTE.cart.readCart().map(function (i) { return i.id; });
  var wishIds = XNOTE.cart.readWish();
  var used    = cartIds.concat(wishIds).filter(function (v, i, a) { return a.indexOf(v) === i; });
  var recs    = XNOTE.products.filter(function (p) { return !used.includes(p.id); }).slice(0, 3);
  if (recs.length === 0) recs = XNOTE.products.slice(0, 3);

  var grid = document.getElementById('recommended-grid');
  if (!grid) return;
  grid.innerHTML = recs.map(function (p, i) { return XNOTE.ui.buildProductCard(p, i * 80); }).join('');
  XNOTE.ui.initReveal();
  grid.querySelectorAll('.product-card').forEach(function (c) {
    c.addEventListener('click', function () { XNOTE.ui.openModal(c.dataset.id); });
  });
};

function saveOrderToSheets(orderData) {
  if (!SHEETS_ENDPOINT) return;

  var items = XNOTE.cart.readCart().map(function (item) {
    var p = XNOTE.products.find(function (x) { return x.id === item.id; });
    if (!p) return '';
    var price = XNOTE.getPriceForSize(p, item.size);
    return p.name + ' (' + item.size + ') x' + item.qty + ' = ' + XNOTE.formatPrice(price * item.qty);
  }).filter(Boolean).join(' | ');

  /* Build URL with query parameters — reliable with Apps Script */
  var params = new URLSearchParams({
    name:     orderData.name     || '',
    phone:    orderData.phone    || '',
    email:    orderData.email    || '',
    address:  orderData.address  || '',
    shipping: orderData.shipping || 'Standard Delivery',
    payment:  orderData.payment  || 'Via WhatsApp',
    items:    items,
    total:    String(XNOTE.cart.getTotal()),
    notes:    orderData.notes    || '',
  });

  /* Use an Image beacon — works cross-origin with no CORS issues */
  var img = new Image();
  img.src = SHEETS_ENDPOINT + '?' + params.toString();
  /* Also try fetch as backup */
  try {
    fetch(SHEETS_ENDPOINT + '?' + params.toString(), { mode: 'no-cors' }).catch(function(){});
  } catch(e) {}
}

/* WhatsApp order button */
function initWhatsAppBtn() {
  var btn = document.getElementById('wa-btn');
  if (!btn) return;

  btn.addEventListener('click', function () {
    var name    = (document.getElementById('c-name').value    || '').trim();
    var phone   = (document.getElementById('c-phone').value   || '').trim();
    var email   = (document.getElementById('c-email').value   || '').trim();
    var address = (document.getElementById('c-address').value || '').trim();
    var notes   = (document.getElementById('c-notes').value   || '').trim();

    var shipping = '';
    var shipSel  = document.querySelector('input[name="shipping"]:checked');
    if (shipSel) shipping = shipSel.value;

    var payment = '';
    var paymentSel = document.querySelector('input[name="payment"]:checked');
    if (paymentSel) payment = paymentSel.value;

    if (!name || !phone || !address) {
      XNOTE.ui.toast('Please fill in your name, phone and address first');
      document.getElementById('c-name').focus();
      return;
    }
    if (XNOTE.cart.readCart().length === 0) {
      XNOTE.ui.toast('Your cart is empty — add a fragrance first');
      return;
    }

    var orderData = { name: name, phone: phone, email: email, address: address, notes: notes, shipping: shipping, payment: payment };

    /* 1. Save to Google Sheets silently in background */
    saveOrderToSheets(orderData);

    /* 2. Open WhatsApp with full order details */
    XNOTE.cart.openWhatsApp(orderData);
  });
}

/* Init */
document.addEventListener('DOMContentLoaded', function () {
  window.renderPageCart();
  window.renderWishlist();
  window.renderRecommended();
  initWhatsAppBtn();

  var clearBtn = document.getElementById('clear-cart-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      if (confirm('Clear all items from cart?')) {
        XNOTE.cart.clearCart();
        window.renderPageCart();
        window.renderRecommended();
      }
    });
  }

  var fp = document.getElementById('footer-products');
  if (fp) {
    fp.innerHTML = XNOTE.products.map(function (p) {
      return '<a href="collection.html" class="footer__link">' + p.name + '</a>';
    }).join('');
  }
});
