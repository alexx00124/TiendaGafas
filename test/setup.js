const DotEnv = require('dotenv');
const Enzyme = require('enzyme');
const Adapter = require('@wojtekmaj/enzyme-adapter-react-17');

DotEnv.config({ path: '.env.test' });
Enzyme.configure({
  adapter: new Adapter()
});

// Mock import.meta.env for Jest (Vite uses this, Jest doesn't understand it)
globalThis.import = globalThis.import || {};
globalThis.import.meta = globalThis.import.meta || {};
globalThis.import.meta.env = {
  VITE_FIREBASE_API_KEY: process.env.VITE_FIREBASE_API_KEY || 'test-key',
  VITE_FIREBASE_AUTH_DOMAIN: process.env.VITE_FIREBASE_AUTH_DOMAIN || 'test.firebaseapp.com',
  VITE_FIREBASE_DB_URL: process.env.VITE_FIREBASE_DB_URL || 'https://test.firebaseio.com',
  VITE_FIREBASE_PROJECT_ID: process.env.VITE_FIREBASE_PROJECT_ID || 'test-project',
  VITE_FIREBASE_STORAGE_BUCKET: process.env.VITE_FIREBASE_STORAGE_BUCKET || 'test.appspot.com',
  VITE_FIREBASE_MSG_SENDER_ID: process.env.VITE_FIREBASE_MSG_SENDER_ID || '123456789',
  VITE_FIREBASE_APP_ID: process.env.VITE_FIREBASE_APP_ID || '1:123456789:web:abc123'
};
