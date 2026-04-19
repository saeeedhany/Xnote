window.XNOTE = window.XNOTE || {};

XNOTE.whatsappNumber = '201000000000';

/* ── Shipping costs (EGP) ──
   local   = Cairo & nearby areas
   distant = Other governorates
   Change these values anytime. */
XNOTE.shipping = { local: 50, distant: 90 };

XNOTE.currency = 'EGP';

XNOTE.products = [
  {
    id: 'rosendo-mateu-5',
    name: 'Rosendo Mateu Nº 5',
    category: 'Floral · Woody',
    categoryKey: 'floral',
    badge: null,
    description: 'A delicate balance of rose and bergamot unfolds into warm vanilla and cedar, settling into a velvety base of white musk and amber. Elegant, timeless, unforgettable.',
    notes: ['Rose', 'Bergamot', 'Vanilla', 'Cedarwood', 'White Musk', 'Amber', 'Incense'],
    sizes: [
      { label: '10ml', price: 170 },
      { label: '30ml', price: 450 },
      { label: '50ml', price: 600 },
    ],
    image: null,
    featured: true,
    isUnique: true,
  },
  {
    id: 'imagination',
    name: 'Imagination',
    category: 'Fresh · Citrus',
    categoryKey: 'fresh',
    badge: null,
    description: 'Bright lemon and spicy ginger open to a refined heart of tea and neroli. A scent that carries the mind somewhere cleaner, lighter, freer.',
    notes: ['Lemon', 'Ginger', 'Tea', 'Neroli', 'Musk', 'Amber'],
    sizes: [
      { label: '10ml', price: 220 },
      { label: '30ml', price: 600 },
      { label: '50ml', price: 800 },
    ],
    image: null,
    featured: true,
    isUnique: true,
  },
  {
    id: 'symphony',
    name: 'Symphony',
    category: 'Fresh · Aromatic',
    categoryKey: 'fresh',
    badge: null,
    description: 'Bergamot and grapefruit rise over a warm ginger and patchouli heart, resolving into a soft, seamless musk and amber base — a composition in perfect harmony.',
    notes: ['Bergamot', 'Grapefruit', 'Ginger', 'Patchouli', 'Musk', 'Amber'],
    sizes: [
      { label: '10ml', price: 160 },
      { label: '30ml', price: 450 },
      { label: '50ml', price: 650 },
    ],
    image: null,
    featured: false,
    isUnique: false,
  },
  {
    id: 'stronger-with-you-intensely',
    name: 'Stronger With You Intensely',
    category: 'Oriental · Woody',
    categoryKey: 'oriental',
    badge: 'Bestseller',
    description: 'Pink pepper and cardamom ignite over a compelling heart of chestnut and iris, anchored by a rich vanilla, amber and leather base — bold, confident, magnetic.',
    notes: ['Pink Pepper', 'Cardamom', 'Chestnut', 'Iris', 'Vanilla', 'Amber', 'Leather'],
    sizes: [
      { label: '10ml', price: 75 },
      { label: '30ml', price: 200 },
      { label: '50ml', price: 300 },
    ],
    image: null,
    featured: true,
    isUnique: true,
  },
  {
    id: 'jimmy-choo',
    name: 'Jimmy Choo',
    category: 'Floral · Sweet',
    categoryKey: 'floral',
    badge: null,
    description: 'Fresh pear and orange open into a lush orchid and caramel heart, grounded by patchouli and vanilla. Glamorous, feminine, unapologetically luxurious.',
    notes: ['Pear', 'Orange', 'Orchid', 'Caramel', 'Patchouli', 'Vanilla'],
    sizes: [
      { label: '10ml', price: 75 },
      { label: '30ml', price: 200 },
      { label: '50ml', price: 300 },
    ],
    image: null,
    featured: false,
    isUnique: false,
  },
  {
    id: 'khamrah-qahwa',
    name: 'Khamrah Qahwa',
    category: 'Oriental · Gourmand',
    categoryKey: 'oriental',
    badge: null,
    description: 'Warm ginger and cinnamon blend with praline and candied fruits over a deep coffee and tonka bean base. Rich, intoxicating, deeply Middle Eastern in soul.',
    notes: ['Ginger', 'Cinnamon', 'Cardamom', 'Praline', 'Candied Fruits', 'White Flowers', 'Coffee', 'Tonka Bean', 'Musk', 'Benzoin', 'Vanilla'],
    sizes: [
      { label: '10ml', price: 75 },
      { label: '30ml', price: 200 },
      { label: '50ml', price: 300 },
    ],
    image: null,
    featured: false,
    isUnique: false,
  },
  {
    id: 'le-male-elixir',
    name: 'Le Male Elixir',
    category: 'Oriental · Woody',
    categoryKey: 'oriental',
    badge: null,
    description: 'Cool mint and lavender open a strikingly modern fragrance, where honey and patchouli create warmth that deepens into a powerfully sensual vanilla and tonka bean finish.',
    notes: ['Mint', 'Lavender', 'Honey', 'Patchouli', 'Vanilla', 'Tonka Bean'],
    sizes: [
      { label: '10ml', price: 75 },
      { label: '30ml', price: 200 },
      { label: '50ml', price: 300 },
    ],
    image: null,
    featured: false,
    isUnique: false,
  },
  {
    id: 'creed-silver-mountain-water',
    name: 'Creed Silver Mountain Water',
    category: 'Fresh · Aquatic',
    categoryKey: 'fresh',
    badge: null,
    description: 'Bergamot and mandarin sparkle over a cool heart of green tea and black currant, resting on sandalwood and musk. The scent of pristine alpine air — pure and invigorating.',
    notes: ['Bergamot', 'Mandarin', 'Orange Blossom', 'Green Tea', 'Black Currant', 'Musk', 'Sandalwood', 'Galbanum'],
    sizes: [
      { label: '10ml', price: 90 },
      { label: '30ml', price: 240 },
      { label: '50ml', price: 350 },
    ],
    image: null,
    featured: false,
    isUnique: false,
  },
  {
    id: 'aqua-celestia',
    name: 'Aqua Celestia',
    category: 'Fresh · Floral',
    categoryKey: 'floral',
    badge: null,
    description: 'Lemon and mint open into an extraordinary floral heart of black currant blossom, jasmine and mimosa — ethereally light, effortlessly radiant, cloud-soft.',
    notes: ['Lemon', 'Mint', 'Black Currant Blossom', 'Jasmine', 'Hedione', 'Mimosa', 'Lily of the Valley', 'Musk'],
    sizes: [
      { label: '10ml', price: 90 },
      { label: '30ml', price: 240 },
      { label: '50ml', price: 350 },
    ],
    image: null,
    featured: false,
    isUnique: false,
  },
  {
    id: 'creed-aventus',
    name: 'Creed Aventus',
    category: 'Fruity · Woody',
    categoryKey: 'fresh',
    badge: 'New',
    description: 'The legendary king of fragrances. Pineapple and black currant over birch and rose, settling into a majestic base of musk, oakmoss and ambergris. Power and success in a bottle.',
    notes: ['Bergamot', 'Black Currant', 'Pineapple', 'Apple', 'Birch', 'Patchouli', 'Rose', 'Moroccan Jasmine', 'Musk', 'Oakmoss', 'Vanilla', 'Ambergris'],
    sizes: [
      { label: '10ml', price: 100 },
      { label: '30ml', price: 270 },
      { label: '50ml', price: 400 },
    ],
    image: null,
    featured: true,
    isUnique: true,
  },
  {
    id: '212-vip',
    name: '212 VIP',
    category: 'Oriental · Sweet',
    categoryKey: 'oriental',
    badge: null,
    description: 'Rum and tropical fruits open into a heady vanilla and musk heart, dissolving into warm amber and tonka bean. The scent of an exclusive night — seductive and irresistible.',
    notes: ['Rum', 'Tropical Fruits', 'Vanilla', 'Musk', 'Amber', 'Tonka Bean'],
    sizes: [
      { label: '10ml', price: 90 },
      { label: '30ml', price: 240 },
      { label: '50ml', price: 350 },
    ],
    image: null,
    featured: false,
    isUnique: false,
  },
  {
    id: 'imperial-valley-story',
    name: 'Imperial Valley Story',
    category: 'Smoky · Woody',
    categoryKey: 'resinous',
    badge: null,
    description: 'Davana and Italian bergamot open over a rare heart of white amber and oud. Haitian vetiver, leather and musk ground this opulent composition — mysterious, commanding, rare.',
    notes: ['Davana', 'Italian Bergamot', 'Pink Pepper', 'White Amber', 'African Rosemary', 'Oud', 'Musk', 'Leather', 'Haitian Vetiver'],
    sizes: [
      { label: '10ml', price: 100 },
      { label: '30ml', price: 270 },
      { label: '50ml', price: 400 },
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
XNOTE.formatPrice = function (amount) {
  return amount.toLocaleString() + ' ' + XNOTE.currency;
};

/* Seed testimonials */
XNOTE.seedTestimonials = [
  { id:'s1', name:'Layla A.',   avatar:'L', stars:5, product:'Creed Aventus',              quote:'I have never worn a perfume that made strangers stop and ask what I am wearing. Creed Aventus is not just a scent — it is a statement.' },
  { id:'s2', name:'Marcus D.',  avatar:'M', stars:5, product:'Creed Silver Mountain Water', quote:'Silver Mountain Water is the only fragrance I have tried that genuinely captures pure mountain air. Clean, fresh and impossible to ignore.' },
  { id:'s3', name:'Sofia R.',   avatar:'S', stars:5, product:'Rosendo Mateu Nº 5',          quote:'Rosendo Mateu has this aristocratic depth I have never encountered before. It lingers beautifully all day — truly exceptional.' },
  { id:'s4', name:'Yusuf K.',   avatar:'Y', stars:5, product:'Stronger With You Intensely', quote:'I bought Stronger With You on a whim and it became my signature. My colleagues always comment on it. Absolutely magnetic.' },
  { id:'s5', name:'Elena M.',   avatar:'E', stars:4, product:'Imagination',                 quote:'Imagination is the cleanest, most elegant fragrance I own. Perfect for any occasion — I am already on my second bottle.' },
  { id:'s6', name:'Tariq N.',   avatar:'T', stars:5, product:'Khamrah Qahwa',               quote:'Khamrah Qahwa is pure luxury. Rich, warming, and deeply Arabian in character. An experience unlike anything else.' },
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
XNOTE.productImgHtml = function (product) {
  if (product.image) {
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
