/* ═══════════════════════════════════════════════
   X Note — Cart Page Logic (v2)
   Two-step flow: Order Summary → Checkout Form
════════════════════════════════════════════════ */
window.XNOTE = window.XNOTE || {};
XNOTE.shipping = XNOTE.shipping || { local: 85, distant: 125 };

var _shippingZone  = 'local';
var _shippingCost  = XNOTE.shipping.local;
var _orderSubtotal = 0;

function showStep(step) {
  document.querySelectorAll('.checkout-step').forEach(function(el) { el.classList.remove('active'); });
  var el = document.getElementById('step-' + step);
  if (el) { el.classList.add('active'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
}

window.renderPageCart = function() {
  var items   = XNOTE.cart.readCart();
  var listEl  = document.getElementById('page-cart-list');
  var countEl = document.getElementById('page-cart-count');
  var totalsEl = document.getElementById('page-totals');
  if (!listEl) return;

  var count = items.reduce(function(s,i) { return s+i.qty; }, 0);
  if (countEl) countEl.textContent = count + ' item' + (count !== 1 ? 's' : '');

  if (items.length === 0) {
    listEl.innerHTML = '<div class="cp-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width:48px;height:48px;color:var(--muted);margin-bottom:1rem;"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg><div class="cp-empty-title">Your cart is empty</div><p class="cp-empty-sub">Add something beautiful from the collection.</p><a href="collection.html" class="btn btn--outline">Explore Collection</a></div>';
    if (totalsEl) totalsEl.style.display = 'none';
    return;
  }
  if (totalsEl) totalsEl.style.display = '';

  var total = 0;
  listEl.innerHTML = items.map(function(item) {
    var p = XNOTE.products.find(function(x) { return x.id === item.id; });
    if (!p) return '';
    var price = XNOTE.getPriceForSize(p, item.size);
    var line  = price * item.qty;
    total += line;
    return '<div class="cp-item" data-key="' + item.key + '">' +
      '<div class="cp-item__img">' + XNOTE.productImgHtml(p) + '</div>' +
      '<div class="cp-item__info">' +
        '<div class="cp-item__name">' + p.name + '</div>' +
        '<div class="cp-item__meta">' + item.size + ' &middot; ' + XNOTE.formatPrice(price) + ' each</div>' +
        '<div class="cp-item__qty">' +
          '<button class="cp-qty-btn" onclick="XNOTE.cart.changeQty(\'' + item.key + '\',-1)">&#8722;</button>' +
          '<span class="cp-qty-num">' + item.qty + '</span>' +
          '<button class="cp-qty-btn" onclick="XNOTE.cart.changeQty(\'' + item.key + '\',1)">+</button>' +
        '</div>' +
      '</div>' +
      '<div class="cp-item__right">' +
        '<div class="cp-item__line-price">' + XNOTE.formatPrice(line) + '</div>' +
        '<button class="cp-item__remove" onclick="XNOTE.cart.removeFromCart(\'' + item.key + '\')" aria-label="Remove">&#215;</button>' +
      '</div></div>';
  }).join('');

  _orderSubtotal = total;
  updateShippingDisplay();
  syncReceiptPreview();
};

function updateShippingDisplay() {
  _shippingCost = _shippingZone === 'local' ? XNOTE.shipping.local : XNOTE.shipping.distant;
  var els = {
    localP:   document.getElementById('shipping-local-price'),
    distantP: document.getElementById('shipping-distant-price'),
    sub:      document.getElementById('page-subtotal'),
    ship:     document.getElementById('page-shipping-display'),
    total:    document.getElementById('page-total')
  };
  if (els.localP)   els.localP.textContent   = XNOTE.formatPrice(XNOTE.shipping.local);
  if (els.distantP) els.distantP.textContent = XNOTE.formatPrice(XNOTE.shipping.distant);
  if (els.sub)      els.sub.textContent      = XNOTE.formatPrice(_orderSubtotal);
  if (els.ship)     els.ship.textContent     = XNOTE.formatPrice(_shippingCost);
  if (els.total)    els.total.textContent    = XNOTE.formatPrice(_orderSubtotal + _shippingCost);
}

function syncReceiptPreview() {
  var items  = XNOTE.cart.readCart();
  var listEl = document.getElementById('receipt-items-list');
  if (!listEl) return;
  listEl.innerHTML = items.map(function(item) {
    var p = XNOTE.products.find(function(x) { return x.id === item.id; });
    if (!p) return '';
    var price = XNOTE.getPriceForSize(p, item.size);
    return '<div class="receipt-item">' +
      '<div class="receipt-item__name">' + p.name + ' <span class="receipt-item__size">(' + item.size + ')</span></div>' +
      '<div class="receipt-item__price">' + item.qty + ' &times; ' + XNOTE.formatPrice(price) + ' = <strong>' + XNOTE.formatPrice(price * item.qty) + '</strong></div>' +
    '</div>';
  }).join('');
  var payment = document.querySelector('input[name="payment-method"]:checked');
  var payName = payment ? payment.value : '—';
  var els = {
    rSub:  document.getElementById('r-subtotal'),
    rShip: document.getElementById('r-shipping'),
    rTot:  document.getElementById('r-total'),
    rPay:  document.getElementById('r-payment')
  };
  if (els.rSub)  els.rSub.textContent  = XNOTE.formatPrice(_orderSubtotal);
  if (els.rShip) els.rShip.textContent = XNOTE.formatPrice(_shippingCost);
  if (els.rTot)  els.rTot.textContent  = XNOTE.formatPrice(_orderSubtotal + _shippingCost);
  if (els.rPay)  els.rPay.textContent  = payName;
}

function placeOrder() {
  var name    = (document.getElementById('c-name')    || {}).value || '';
  var phone   = (document.getElementById('c-phone')   || {}).value || '';
  var email   = (document.getElementById('c-email')   || {}).value || '';
  var address = (document.getElementById('c-address') || {}).value || '';
  var notes   = (document.getElementById('c-notes')   || {}).value || '';
  var payment = document.querySelector('input[name="payment-method"]:checked');
  var payName = payment ? payment.value : 'Vodafone Cash';

  var errors = [];
  if (!name.trim())    errors.push('Full Name');
  if (!phone.trim())   errors.push('Phone Number');
  if (!email.trim())   errors.push('Email Address');
  if (!address.trim()) errors.push('Delivery Address');
  if (errors.length)   { alert('Please fill in all required fields:\n' + errors.join(', ')); return; }

  var items = XNOTE.cart.readCart();
  if (!items.length)   { alert('Your cart is empty.'); return; }

  var refNum = 'XN-' + Date.now().toString(36).toUpperCase();
  var zone   = _shippingZone === 'local' ? 'Normal Shipping' : 'Fast Shipping';
  var total  = XNOTE.formatPrice(_orderSubtotal + _shippingCost);

  var orderLines = items.map(function(item) {
    var p = XNOTE.products.find(function(x) { return x.id === item.id; });
    if (!p) return '';
    var price = XNOTE.getPriceForSize(p, item.size);
    return p.name + ' (' + item.size + ') x' + item.qty + ' = ' + XNOTE.formatPrice(price * item.qty);
  }).filter(Boolean).join('\n');

  /* ── WhatsApp message to store owner ── */
  var waMsg =
    '\uD83D\uDED8 *New Order \u2014 X Note*\n' +
    'Ref: ' + refNum + '\n\n' +
    '*Name:* ' + name + '\n' +
    '*Phone:* ' + phone + '\n' +
    '*Email:* ' + email + '\n' +
    '*Address:* ' + address + '\n' +
    (notes ? '*Notes:* ' + notes + '\n' : '') +
    '\n*Items:*\n' + orderLines + '\n\n' +
    '*Shipping (' + zone + '):* ' + XNOTE.formatPrice(_shippingCost) + '\n' +
    '*Total:* ' + total + '\n' +
    '*Payment:* ' + payName + '\n\n' +
    'Please confirm or cancel this order.';

  var waNumber = (XNOTE.whatsappNumber || '201000000000').replace(/\D/g, '');
  var waUrl    = 'https://wa.me/' + waNumber + '?text=' + encodeURIComponent(waMsg);

  /* ── Email receipt to customer (mailto best-effort) ── */
  var emailBody =
    'Dear ' + name + ',\n\n' +
    'Thank you for your X Note order.\n\n' +
    'ORDER RECEIPT\n' +
    'Reference: ' + refNum + '\n' +
    '----------------------------\n' +
    orderLines + '\n\n' +
    'Shipping (' + zone + '): ' + XNOTE.formatPrice(_shippingCost) + '\n' +
    'TOTAL: ' + total + '\n\n' +
    'Payment: ' + payName + '\n' +
    'Delivery: ' + address + '\n\n' +
    'We will contact you on WhatsApp at ' + phone + ' to arrange payment.\n\n' +
    'X Note Maison de Parfum';

  try {
    window.open(
      'mailto:' + encodeURIComponent(email) +
      '?subject=' + encodeURIComponent('Your X Note Order — ' + refNum) +
      '&body=' + encodeURIComponent(emailBody),
      '_blank'
    );
  } catch(e) {}

  /* ── Show success overlay ── */
  var overlay = document.getElementById('order-success-overlay');
  var refEl   = document.getElementById('success-ref-num');
  var pmEl    = document.getElementById('success-payment-method');
  var waLink  = document.getElementById('success-wa-link');

  if (refEl)  refEl.textContent = refNum;
  if (pmEl)   pmEl.textContent  = payName;
  if (waLink) waLink.href       = waUrl;
  if (overlay) {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  XNOTE.cart.clearCart();
}

document.addEventListener('DOMContentLoaded', function() {
  if (typeof renderPageCart === 'function') renderPageCart();

  /* Shipping zone */
  document.querySelectorAll('input[name="shipping-zone"]').forEach(function(r) {
    r.addEventListener('change', function() { _shippingZone = this.value; updateShippingDisplay(); });
  });

  /* Proceed to checkout */
  var proceedBtn = document.getElementById('proceed-to-checkout');
  if (proceedBtn) proceedBtn.addEventListener('click', function() {
    if (!XNOTE.cart.readCart().length) { alert('Your cart is empty.'); return; }
    syncReceiptPreview();
    showStep('checkout');
  });

  /* Back */
  var backBtn = document.getElementById('back-to-summary');
  if (backBtn) backBtn.addEventListener('click', function() { showStep('summary'); });

  /* Payment method → sync receipt */
  document.querySelectorAll('input[name="payment-method"]').forEach(function(r) {
    r.addEventListener('change', syncReceiptPreview);
  });

  /* Place order */
  var placeBtn = document.getElementById('place-order-btn');
  if (placeBtn) placeBtn.addEventListener('click', placeOrder);

  /* Close overlay */
  var overlay = document.getElementById('order-success-overlay');
  if (overlay) overlay.addEventListener('click', function(e) {
    if (e.target === overlay) { overlay.classList.remove('active'); document.body.style.overflow = ''; window.location.href = 'index.html'; }
  });

  /* WA float */
  var waFloat = document.getElementById('wa-float-btn');
  if (waFloat && XNOTE.whatsappNumber) waFloat.href = 'https://wa.me/' + XNOTE.whatsappNumber.replace(/\D/g,'');

  document.addEventListener('xnote:cart-changed', function() { renderPageCart(); });
});
