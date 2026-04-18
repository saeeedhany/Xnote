window.XNOTE = window.XNOTE || {};

/* WhatsApp number */
XNOTE.whatsappNumber = '201027575715';

/* Products */
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
      { label: '30ml',  price: 120 },
      { label: '50ml',  price: 185 },
      { label: '100ml', price: 290 },
    ],
    image: 'assets/images/perfume.png',
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
      { label: '30ml',  price: 105 },
      { label: '50ml',  price: 165 },
      { label: '100ml', price: 260 },
    ],
    image: null,
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
      { label: '30ml',  price: 98  },
      { label: '50ml',  price: 155 },
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
      { label: '30ml',  price: 135 },
      { label: '50ml',  price: 210 },
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
      { label: '30ml',  price: 110 },
      { label: '50ml',  price: 175 },
      { label: '100ml', price: 275 },
    ],
    image: null,
    featured: true,
    isUnique: true,
  },
];

/* Price helpers */
XNOTE.getDefaultPrice = function (p) { return p.sizes[0].price; };
XNOTE.getDefaultSize  = function (p) { return p.sizes[0].label; };
XNOTE.getPriceForSize = function (p, label) {
  var s = p.sizes.find(function (x) { return x.label === label; });
  return s ? s.price : p.sizes[0].price;
};

/* Seed testimonials */
XNOTE.seedTestimonials = [
  { id:'s1', name:'Layla A.',  avatar:'L', stars:5, product:'Nuit Dorée',   quote:'I have never worn a perfume that made strangers stop and ask what I am wearing. This is not just a scent — it is an experience.' },
  { id:'s2', name:'Marcus D.', avatar:'M', stars:5, product:'Sel Marin',    quote:'Sel Marin is the only perfume I have tried that genuinely smells like the open ocean. Understated yet impossible to ignore.' },
  { id:'s3', name:'Sofia R.',  avatar:'S', stars:5, product:'Iris Poudré',  quote:'Iris Poudré has this aristocratic quietness I have never encountered before. It is the kind of scent that feels like a secret.' },
  { id:'s4', name:'Yusuf K.',  avatar:'Y', stars:5, product:'Encens Royal', quote:'I bought Encens Royal on a whim and it became my signature. My colleagues always comment on it. Truly a masterpiece.' },
  { id:'s5', name:'Elena M.',  avatar:'E', stars:4, product:'Ambre Blanc',  quote:'Ambre Blanc is warmth in a bottle. Perfect for cooler evenings, it lingers beautifully on skin. I am already on my second bottle.' },
  { id:'s6', name:'Tariq N.',  avatar:'T', stars:5, product:'Nuit Dorée',   quote:'The craftsmanship behind these fragrances is evident from the first spray. Nuit Dorée is opulence without ostentation.' },
];

XNOTE.getAllTestimonials = function () {
  var user = JSON.parse(localStorage.getItem('xnote_reviews') || '[]');
  return user.concat(XNOTE.seedTestimonials);
};

XNOTE.submitReview = function (name, productName, stars, quote) {
  var reviews = JSON.parse(localStorage.getItem('xnote_reviews') || '[]');
  reviews.unshift({
    id: 'u' + Date.now(),
    name: name,
    avatar: name.trim()[0].toUpperCase(),
    stars: parseInt(stars),
    product: productName,
    quote: quote,
  });
  localStorage.setItem('xnote_reviews', JSON.stringify(reviews));
};

/* Product image HTML */
/* Returns either an <img> tag (if image path is set and loads)
   or a placeholder div. Uses CSS classes — no inline styles.   */
XNOTE.productImgHtml = function (product) {
  if (product.image) {
    /* When the image loads successfully, hide the placeholder.
       When it fails, show the placeholder instead.              */
    return (
      '<img' +
        ' src="' + product.image + '"' +
        ' alt="' + product.name + '"' +
        ' class="product-real-img"' +
        ' loading="lazy"' +
        ' onload="this.classList.add(\'loaded\')"' +
        ' onerror="this.style.display=\'none\';' +
                  'var ph=this.parentElement.querySelector(\'.product-placeholder-box\');' +
                  'if(ph)ph.classList.add(\'visible\');"' +
      '/>' +
      '<div class="product-placeholder-box"></div>'
    );
  }
  return '<div class="product-placeholder-box visible"></div>';
};
