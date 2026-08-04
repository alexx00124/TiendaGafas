const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { cert, initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage');

const envPath = path.resolve(__dirname, '..', '.env');
const env = fs.readFileSync(envPath, 'utf8').split('\n').reduce((acc, line) => {
  const [k, ...rest] = line.split('=');
  if (k && rest.length) acc[k.trim()] = rest.join('=').trim();
  return acc;
}, {});

const serviceAccountPath = path.resolve(__dirname, '..', 'service-account.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET
});

const db = getFirestore();
const bucket = getStorage().bucket();
const staticDir = path.resolve(__dirname, '..', 'static');

const imageFiles = [];
for (let i = 1; i <= 10; i += 1) {
  const p = path.join(staticDir, `salt-image-${i}.png`);
  if (fs.existsSync(p)) imageFiles.push(p);
}

const brands = ['Ray-Ban', 'Oakley', 'Tommy Hilfiger', 'Polaroid', 'Vogue'];
const categories = ['Sunglasses', 'Optical'];
const colors = ['Black', 'Brown', 'Gold', 'Silver', 'Tortoise'];
const keywordsBase = ['glasses', 'eyewear', 'sun', 'optical', 'prescription'];

async function uploadImage(localPath, key, token) {
  const dest = `products/${key}.png`;
  await bucket.upload(localPath, {
    destination: dest,
    metadata: {
      metadata: { firebaseStorageDownloadTokens: token }
    }
  });
  const encoded = dest.split('/').map((s) => encodeURIComponent(s)).join('/');
  return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encoded}?alt=media&token=${token}`;
}

async function run() {
  console.log(`Found ${imageFiles.length} local product images.`);
  let created = 0;
  for (let i = 0; i < imageFiles.length; i += 1) {
    const id = db.collection('products').doc().id;
    const name = `Gafas ${i + 1}`;
    const token = crypto.randomBytes(16).toString('hex');
    const url = await uploadImage(imageFiles[i], id, token);

    const doc = {
      name,
      name_lower: name.toLowerCase(),
      brand: brands[i % brands.length],
      category: categories[i % categories.length],
      description: `Gafas de muestra ${i + 1} para la base de datos de prueba.`,
      price: Math.round((49 + i * 23 + Math.random() * 20) * 100) / 100,
      sizes: ['Small', 'Medium', 'Large'],
      colors: [colors[i % colors.length]],
      quantity: 1,
      dateAdded: new Date().getTime(),
      keywords: [...keywordsBase, name.toLowerCase()],
      isFeatured: i % 2 === 0,
      isRecommended: i % 3 === 0,
      image: url,
      imageCollection: [{ id: new Date().getTime(), url }]
    };

    await db.collection('products').doc(id).set(doc);
    created += 1;
    console.log(`✔ Created product "${name}" (id: ${id})`);
  }
  console.log(`\nDone! ${created} products created.`);
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Error seeding:', err);
    process.exit(1);
  });