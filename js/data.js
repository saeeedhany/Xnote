window.XNOTE = window.XNOTE || {};

/* ── WhatsApp Config ─────────────────────────────────────── */
XNOTE.whatsappNumber = '201000000000'; // ← Replace: country code + number, no +

/* ── Products Catalogue ──────────────────────────────────── */
XNOTE.products = [
  {
    id: 'nuit-doree',
    name: 'Nuit Dorée',
    category: 'Floral · Woody',
    categoryKey: 'floral',
    badge: 'New',
    description: 'A velvety nocturnal bloom. Rose absolute and oud entwine beneath a cool cedar sky — timeless, unhurried, unforgettable.',
    notes: ['Rose Absolute', 'Oud', 'Cedar', 'Amber', 'Musk'],
    sizes: [
      { label: '30ml', price: 120 },
      { label: '50ml', price: 185 },
      { label: '100ml', price: 290 },
    ],
    image: null, // e.g. 'assets/images/nuit-doree.jpg'
    featured: true,
    isUnique: true,
  },
  {
    id: 'ambre-blanc',
    name: 'Ambre Blanc',
    category: 'Oriental · Vanilla',
    categoryKey: 'oriental',
    badge: null,
    description: 'Pale amber and Tahitian vanilla rest on a warm sandalwood base. Intimate as candlelight. Addictive as memory.',
    notes: ['Amber', 'Vanilla', 'Sandalwood', 'Tonka Bean', 'White Musk'],
    sizes: [
      { label: '30ml', price: 105 },
      { label: '50ml', price: 165 },
      { label: '100ml', price: 260 },
    ],
    image: 'assets/images/perfume.png',
    featured: false,
    isUnique: false,
  },
  {
    id: 'sel-marin',
    name: 'Sel Marin',
    category: 'Fresh · Aquatic',
    categoryKey: 'fresh',
    badge: 'Bestseller',
    description: 'The first breath of open sea. Bergamot and marine accord fade into vetiver and driftwood. Clean. Limitless.',
    notes: ['Bergamot', 'Sea Salt', 'Vetiver', 'Driftwood', 'Ambergris'],
    sizes: [
      { label: '30ml', price: 98 },
      { label: '50ml', price: 155 },
      { label: '100ml', price: 245 },
    ],
    image: null,
    featured: true,
    isUnique: true,
  },
  {
    id: 'encens-royal',
    name: 'Encens Royal',
    category: 'Smoky · Resinous',
    categoryKey: 'resinous',
    badge: null,
    description: 'Sacred frankincense and labdanum ignite with dark saffron. A meditation in smoke and gold. For those who wear silence.',
    notes: ['Frankincense', 'Labdanum', 'Saffron', 'Benzoin', 'Patchouli'],
    sizes: [
      { label: '30ml', price: 135 },
      { label: '50ml', price: 210 },
      { label: '100ml', price: 330 },
    ],
    image: null,
    featured: false,
    isUnique: false,
  },
  {
    id: 'iris-poudre',
    name: 'Iris Poudré',
    category: 'Powdery · Chypre',
    categoryKey: 'powdery',
    badge: 'Limited',
    description: 'Orris root absolute and violet leaf suspended in soft iris powder. Whispered, aristocratic, impossible to place.',
    notes: ['Iris', 'Orris Root', 'Violet Leaf', 'Oakmoss', 'White Cedar'],
    sizes: [
      { label: '30ml', price: 110 },
      { label: '50ml', price: 175 },
      { label: '100ml', price: 275 },
    ],
    image: null,
    featured: true,
    isUnique: true,
  },
];

XNOTE.getDefaultPrice = p => p.sizes[0].price;
XNOTE.getDefaultSize  = p => p.sizes[0].label;
XNOTE.getPriceForSize = (p, label) => {
  const s = p.sizes.find(s => s.label === label);
  return s ? s.price : p.sizes[0].price;
};

/* ── Seed Testimonials ───────────────────────────────────── */
XNOTE.seedTestimonials = [
  { id:'s1', name:'Layla A.',   avatar:'L', stars:5, product:'Nuit Dorée',    quote:'I have never worn a perfume that made strangers stop and ask what I am wearing. This is not just a scent — it is an experience.' },
  { id:'s2', name:'Marcus D.',  avatar:'M', stars:5, product:'Sel Marin',     quote:'Sel Marin is the only perfume I have tried that genuinely smells like the open ocean. Understated yet impossible to ignore.' },
  { id:'s3', name:'Sofia R.',   avatar:'S', stars:5, product:'Iris Poudré',   quote:'Iris Poudré has this aristocratic quietness I have never encountered before. It is the kind of scent that feels like a secret.' },
  { id:'s4', name:'Yusuf K.',   avatar:'Y', stars:5, product:'Encens Royal',  quote:'I bought Encens Royal on a whim and it became my signature. My colleagues always comment on it. Truly a masterpiece.' },
  { id:'s5', name:'Elena M.',   avatar:'E', stars:4, product:'Ambre Blanc',   quote:'Ambre Blanc is warmth in a bottle. Perfect for cooler evenings, it lingers beautifully on skin. I am already on my second bottle.' },
  { id:'s6', name:'Tariq N.',   avatar:'T', stars:5, product:'Nuit Dorée',    quote:'The craftsmanship behind these fragrances is evident from the first spray. Nuit Dorée is opulence without ostentation.' },
];

XNOTE.getAllTestimonials = function() {
  const user = JSON.parse(localStorage.getItem('xnote_reviews') || '[]');
  return [...user, ...XNOTE.seedTestimonials];
};

XNOTE.submitReview = function(name, productName, stars, quote) {
  const reviews = JSON.parse(localStorage.getItem('xnote_reviews') || '[]');
  reviews.unshift({ id:'u'+Date.now(), name, avatar: name.trim()[0].toUpperCase(), stars: parseInt(stars), product: productName, quote });
  localStorage.setItem('xnote_reviews', JSON.stringify(reviews));
};

/* ── Product Image / Placeholder ────────────────────────── */
XNOTE.productImgHtml = function(product) {
  if (product.image) {
    return `<img src="${product.image}" alt="${product.name}"
      style="width:100%;height:100%;object-fit:cover;display:block;"
      loading="lazy"
      onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"/>
      ${XNOTE._placeholder()}`;
  }
  return XNOTE._placeholder();
};

XNOTE._placeholder = function() {
  return `<div style="
    width:100%;height:100%;
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    background:linear-gradient(160deg,#181410 0%,#080808 100%);
    gap:.7rem;position:absolute;inset:0;
  ">
    <div style="width:36px;height:54px;border:1px solid rgba(201,169,110,.25);"></div>
    <span style="font-family:var(--sans);font-size:.55rem;letter-spacing:.22em;text-transform:uppercase;color:rgba(201,169,110,.4);">Photo Here</span>
  </div>`;
};
