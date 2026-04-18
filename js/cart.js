/*
   CART.JS — Persistent cart & wishlist across all pages
   Uses localStorage so state is shared between every page.
*/

window.XNOTE = window.XNOTE || {};

XNOTE.cart = (function () {
  'use strict';

  /* ── Always read fresh from storage ──────────────────── */
  function getItems()    { return JSON.parse(localStorage.getItem('xnote_cart') || '[]'); }
  function getWishlist() { return JSON.parse(localStorage.getItem('xnote_wish') || '[]'); }
  function saveItems(arr)    { localStorage.setItem('xnote_cart', JSON.stringify(arr)); }
  function saveWishlist(arr) { localStorage.setItem('xnote_wish', JSON.stringify(arr)); }

  /* ── Cart count ───────────────────────────────────────── */
  function cartCount() { return getItems().reduce((s, i) => s + i.qty, 0); }

  /* ── Add to cart ──────────────────────────────────────── */
  function addToCart(productId, size, qty) {
    const product = XNOTE.products.find(p => p.id === productId);
    if (!product) return;
    size = size || XNOTE.getDefaultSize(product);
    qty  = qty  || 1;
    const items = getItems();
    const key   = productId + '|' + size; // unique key per product+size combo
    const existing = items.find(i => i.key === key);
    if (existing) {
      existing.qty = Math.min(existing.qty + qty, 10);
    } else {
      items.push({ key, id: productId, size, qty });
    }
    saveItems(items);
    syncAllUI();
    XNOTE.ui.toast(product.name + ' (' + size + ') added to cart');
    bumpCountEl('[data-cart-count]');
  }

  /* ── Remove from cart ─────────────────────────────────── */
  function removeFromCart(key) {
    saveItems(getItems().filter(i => i.key !== key));
    syncAllUI();
    if (typeof window._renderPageCart === 'function') window._renderPageCart();
    renderPanelItems();
  }

  /* ── Change qty ───────────────────────────────────────── */
  function changeQty(key, delta) {
    const items = getItems();
    const item  = items.find(i => i.key === key);
    if (!item) return;
    item.qty = Math.max(1, Math.min(item.qty + delta, 10));
    saveItems(items);
    syncAllUI();
    if (typeof window._renderPageCart === 'function') window._renderPageCart();
    renderPanelItems();
  }

  /* ── Clear cart ───────────────────────────────────────── */
  function clearCart() {
    saveItems([]);
    syncAllUI();
    if (typeof window._renderPageCart === 'function') window._renderPageCart();
    renderPanelItems();
  }

  /* ── Wishlist toggle ──────────────────────────────────── */
  function toggleWish(productId) {
    const product = XNOTE.products.find(p => p.id === productId);
    if (!product) return false;
    const list = getWishlist();
    const idx  = list.indexOf(productId);
    if (idx === -1) {
      list.push(productId);
      XNOTE.ui.toast(product.name + ' saved to favourites ♡');
    } else {
      list.splice(idx, 1);
      XNOTE.ui.toast(product.name + ' removed from favourites');
    }
    saveWishlist(list);
    syncWishUI();
    bumpCountEl('[data-wish-count]');
    return list.includes(productId);
  }

  function isWished(productId) { return getWishlist().includes(productId); }

  /* ── Totals ───────────────────────────────────────────── */
  function getTotal() {
    return getItems().reduce((sum, item) => {
      const p = XNOTE.products.find(x => x.id === item.id);
      return sum + (p ? XNOTE.getPriceForSize(p, item.size) * item.qty : 0);
    }, 0);
  }

  /* ── WhatsApp message builder ─────────────────────────── */
  function buildWhatsAppMessage(details) {
    const items = getItems();
    let msg = '🛍️ *New X Note Order*\n\n';
    msg += '*Customer Details:*\n';
    msg += '• Name: ' + details.name + '\n';
    msg += '• Phone: ' + details.phone + '\n';
    msg += '• Address: ' + details.address + '\n\n';
    msg += '*Order:*\n';
    items.forEach(item => {
      const p = XNOTE.products.find(x => x.id === item.id);
      if (!p) return;
      const price = XNOTE.getPriceForSize(p, item.size);
      msg += `• ${p.name} (${item.size}) x${item.qty} = $${price * item.qty}\n`;
    });
    msg += '\n*Total: $' + getTotal() + '*\n';
    if (details.shipping) msg += '*Shipping: ' + details.shipping + '*\n';
    if (details.notes)    msg += '\nNotes: ' + details.notes + '\n';
    return encodeURIComponent(msg);
  }

  function openWhatsApp(details) {
    const msg = buildWhatsAppMessage(details);
    const url = 'https://wa.me/' + XNOTE.whatsappNumber + '?text=' + msg;
    window.open(url, '_blank');
  }

  function getCartSummary() {
    return getItems().map(item => {
      const p = XNOTE.products.find(x => x.id === item.id);
      return p ? p.name + ' (' + item.size + ') x' + item.qty + ' ($' + (XNOTE.getPriceForSize(p, item.size) * item.qty) + ')' : '';
    }).filter(Boolean).join(', ');
  }

  /* ── Sync all UI elements ─────────────────────────────── */
  function syncAllUI() {
    const count = cartCount();
    document.querySelectorAll('[data-cart-count]').forEach(el => {
      el.textContent    = count;
      el.style.display  = count > 0 ? 'flex' : 'none';
    });
    const panelCount = document.querySelector('.cart-panel__count');
    if (panelCount) panelCount.textContent = count + ' item' + (count !== 1 ? 's' : '');
    const totalEl = document.querySelector('.cart-panel__total-price');
    if (totalEl) totalEl.textContent = '$' + getTotal();
  }

  function syncWishUI() {
    const count = getWishlist().length;
    document.querySelectorAll('[data-wish-count]').forEach(el => {
      el.textContent   = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
    document.querySelectorAll('[data-wish-btn]').forEach(btn => {
      btn.classList.toggle('active', getWishlist().includes(btn.dataset.wishBtn));
    });
  }

  function bumpCountEl(sel) {
    document.querySelectorAll(sel).forEach(el => {
      el.classList.remove('bump');
      void el.offsetWidth;
      el.classList.add('bump');
    });
  }

  /* ── Render sliding panel items ───────────────────────── */
  function renderPanelItems() {
    const container = document.querySelector('.cart-panel__items');
    if (!container) return;
    const items = getItems();

    if (items.length === 0) {
      container.innerHTML = `
        <div class="cart-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width:44px;height:44px;opacity:.2;color:var(--gold);display:block;margin:0 auto 1rem;">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          <p class="cart-empty__text">Your cart is empty</p>
          <p class="cart-empty__sub">Discover our collection and add something beautiful</p>
        </div>`;
      return;
    }

    container.innerHTML = items.map(item => {
      const p = XNOTE.products.find(x => x.id === item.id);
      if (!p) return '';
      const price = XNOTE.getPriceForSize(p, item.size);
      return `
        <div class="cart-item" data-key="${item.key}">
          <div class="cart-item__img" style="position:relative;overflow:hidden;">
            ${XNOTE.productImgHtml(p)}
          </div>
          <div class="cart-item__info">
            <div class="cart-item__name">${p.name}</div>
            <div class="cart-item__variant">${item.size} · ${p.category}</div>
            <div class="cart-item__qty">
              <button class="cart-item__qty-btn" onclick="XNOTE.cart.changeQty('${item.key}',-1)">−</button>
              <span class="cart-item__qty-num">${item.qty}</span>
              <button class="cart-item__qty-btn" onclick="XNOTE.cart.changeQty('${item.key}',1)">+</button>
            </div>
          </div>
          <div class="cart-item__actions">
            <span class="cart-item__price">$${price * item.qty}</span>
            <button class="cart-item__remove" onclick="XNOTE.cart.removeFromCart('${item.key}')">Remove</button>
          </div>
        </div>`;
    }).join('');

    syncAllUI();
  }

  /* ── Open / close panel ───────────────────────────────── */
  function openPanel() {
    document.querySelector('.cart-panel')?.classList.add('open');
    document.querySelector('.cart-backdrop')?.classList.add('open');
    document.body.style.overflow = 'hidden';
    renderPanelItems();
  }

  function closePanel() {
    document.querySelector('.cart-panel')?.classList.remove('open');
    document.querySelector('.cart-backdrop')?.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ── Init ─────────────────────────────────────────────── */
  function init() {
    document.querySelector('.cart-backdrop')?.addEventListener('click', closePanel);
    document.querySelector('.cart-panel__close')?.addEventListener('click', closePanel);
    document.querySelectorAll('[data-open-cart]').forEach(btn => btn.addEventListener('click', openPanel));
    syncAllUI();
    syncWishUI();
  }

  return {
    init, addToCart, removeFromCart, changeQty, clearCart,
    toggleWish, isWished, openPanel, closePanel,
    getTotal, getCartSummary, renderPanelItems, openWhatsApp,
    getItems, getWishlist,
  };
})();
