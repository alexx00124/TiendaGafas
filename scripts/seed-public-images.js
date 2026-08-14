const fs = require('fs');
const path = require('path');
const { cert, initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const envPath = path.resolve(__dirname, '..', '.env');
const env = fs.readFileSync(envPath, 'utf8').split('\n').reduce((acc, line) => {
  const [k, ...rest] = line.split('=');
  if (k && rest.length) acc[k.trim()] = rest.join('=').trim();
  return acc;
}, {});

const serviceAccountPath = path.resolve(__dirname, '..', 'service-account.json');
const usesServiceAccount = fs.existsSync(serviceAccountPath);
const projectId = env.VITE_FIREBASE_PROJECT_ID || 'salinaka-ecommerce';

if (!usesServiceAccount && !process.env.FIRESTORE_EMULATOR_HOST) {
  process.env.FIRESTORE_EMULATOR_HOST = 'localhost:4000';
}

if (usesServiceAccount) {
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
  initializeApp({ credential: cert(serviceAccount) });
  console.log('Modo: proyecto Firebase real (service-account.json detectado).');
} else {
  initializeApp({ projectId });
  console.log(`Modo: emulador local Firestore en ${process.env.FIRESTORE_EMULATOR_HOST}.`);
}

const db = getFirestore();

const IMAGES = [
  'https://lens.com.co/cdn/shop/files/p-rb2140901-1-4417c8d9-4c24-4394-8941-077bdb83a1bb.jpg?v=1783455765&width=1800',
  'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
  'https://cdn.media.amplience.net/i/truworths/prod3223295_1?fmt=auto&',
  'https://media.carvela.com/product/2761600809/40/bold-cat-eye-sunglasses-black-other-print-carvela-2761600809',
  'https://zerouv.com/cdn/shop/products/D179-05a_2000x_2cdfda9a-7577-4cc0-b784-83f7ee475312_2000x.jpg?v=1690478143',
  'https://www.bfgcdn.com/1500_1500_90/205-3002/scott-sport-shield-s3-vlt-16-gafas-de-ciclismo-detail-2.jpg',
  'https://milanelo.com/cdn/shop/files/8051594394893_170e364c-ee5f-4950-8e9c-436abd135a66.jpg-2.png?v=1754927527&width=3000',
  'https://http2.mlstatic.com/D_Q_NP_815965-CBT111222634787_052026-O.webp',
  'https://lens.com.co/cdn/shop/files/p-rb44166653b1-1-40523cc0-13a6-4cc3-9ffe-c8e4203201a1.jpg?v=1734407482&width=1104',
  'https://image.made-in-china.com/318f0j00JasUEZRlJHbz/XC62165-mp4.webp',
  'https://http2.mlstatic.com/D_Q_NP_692995-CBT96619789746_112025-O.webp',
  'https://es.dfranklincreation.com/cdn/shop/files/DFSU913001-TRAN-10.jpg?v=1717150855&width=1125'
];

const BRANDS = ['Salt Maalat', 'Salt Maalat', 'Salt Maalat', 'Betsin Maalat', 'Betsin Maalat', 'Betsin Maalat', 'Sexbomb', 'Sexbomb', 'Sexbomb', 'Black Kibal', 'Black Kibal', 'Black Kibal'];
const CATEGORIES = ['Sunglasses', 'Sunglasses', 'Sunglasses', 'Sunglasses', 'Optical', 'Sunglasses', 'Optical', 'Sunglasses', 'Sunglasses', 'Optical', 'Sunglasses', 'Optical'];
const COLORS = [
  ['#000000', '#8B4513', '#2E2E2E'],
  ['#8B4513', '#000000', '#FFFFFF'],
  ['#C0C0C0', '#000000', '#FFD700'],
  ['#000000', '#FF69B4', '#8B0000'],
  ['#2E2E2E', '#8B4513', '#000080'],
  ['#000000', '#FF4500', '#00FFFF'],
  ['#C0C0C0', '#FFD700', '#000000'],
  ['#000000', '#8B0000', '#800080'],
  ['#8B4513', '#000000', '#FFD700'],
  ['#000000', '#FFFFFF', '#808080'],
  ['#000000', '#2E8B57', '#4682B4'],
  ['#C0C0C0', '#000000', '#8B4513']
];
const SIZES = [
  [48, 50, 52], [46, 48, 50], [52, 54, 56], [50, 52],
  [48, 50, 52], [55, 58, 60], [48, 50, 52], [54, 56, 58],
  [49, 51, 53], [48, 50], [52, 54, 56], [46, 48, 50]
];
const PRICES = [149, 139, 169, 159, 129, 179, 119, 189, 149, 169, 199, 99];
const NAMES = [
  'Classic Wayfarer', 'Retro Round', 'Urban Aviator', 'Bold Cat-Eye',
  'Vintage Square', 'Sport Shield', 'Minimalist Wire', 'Oversized Glam',
  'Clubmaster Style', 'Geometric Edge', 'Polarized Pro', 'Ultra Light'
];
const KEYWORDS = [
  ['classic', 'wayfarer', 'black'], ['round', 'retro', 'tortoise'],
  ['aviator', 'metal', 'gold'], ['cat-eye', 'bold', 'pink'],
  ['square', 'vintage', 'blue'], ['sport', 'shield', 'wrap'],
  ['wire', 'minimal', 'gold'], ['oversized', 'glam', 'purple'],
  ['clubmaster', 'browline'], ['geometric', 'edge', 'modern'],
  ['polarized', 'pro', 'green'], ['light', 'titanium', 'comfort']
];
const FEATURED = [true, false, true, true, false, true, false, true, false, true, true, false];
const RECOMMENDED = [false, true, true, false, true, true, false, true, true, false, true, true];

async function run() {
  console.log(`Seeding ${IMAGES.length} products...\n`);
  let created = 0;

  for (let i = 0; i < IMAGES.length; i += 1) {
    const id = db.collection('products').doc().id;
    const name = NAMES[i];
    const now = new Date().getTime();
    const imageCollection = [
      { id: now + 1, url: IMAGES[i] },
      { id: now + 2, url: IMAGES[(i + 1) % IMAGES.length] },
      { id: now + 3, url: IMAGES[(i + 2) % IMAGES.length] }
    ];

    const product = {
      name,
      name_lower: name.toLowerCase(),
      brand: BRANDS[i],
      category: CATEGORIES[i],
      description: `${name} - ${CATEGORIES[i].toLowerCase()} de alta calidad para tu tienda de gafas.`,
      price: PRICES[i],
      maxQuantity: 10,
      quantity: 1,
      dateAdded: now,
      keywords: KEYWORDS[i],
      sizes: SIZES[i],
      availableColors: COLORS[i],
      isFeatured: FEATURED[i],
      isRecommended: RECOMMENDED[i],
      image: IMAGES[i],
      imageCollection
    };

    await db.collection('products').doc(id).set(product);
    created += 1;
    console.log(`✔ Created "${name}" (brand: ${BRANDS[i]})`);
  }

  console.log(`\nDone! ${created} products created in Firestore.`);
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Error seeding:', err);
    process.exit(1);
  });