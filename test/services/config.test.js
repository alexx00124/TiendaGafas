import firebaseConfig from '@/services/config';

describe('firebaseConfig', () => {
  it('should have all expected keys', () => {
    expect(firebaseConfig).toHaveProperty('apiKey');
    expect(firebaseConfig).toHaveProperty('authDomain');
    expect(firebaseConfig).toHaveProperty('databaseURL');
    expect(firebaseConfig).toHaveProperty('projectId');
    expect(firebaseConfig).toHaveProperty('storageBucket');
    expect(firebaseConfig).toHaveProperty('messagingSenderId');
    expect(firebaseConfig).toHaveProperty('appId');
  });

  it('should read values from import.meta.env via globalThis.__import_meta_env__', () => {
    const env = globalThis.__import_meta_env__;
    expect(firebaseConfig.apiKey).toBe(env.VITE_FIREBASE_API_KEY);
    expect(firebaseConfig.authDomain).toBe(env.VITE_FIREBASE_AUTH_DOMAIN);
    expect(firebaseConfig.databaseURL).toBe(env.VITE_FIREBASE_DB_URL);
    expect(firebaseConfig.projectId).toBe(env.VITE_FIREBASE_PROJECT_ID);
    expect(firebaseConfig.storageBucket).toBe(env.VITE_FIREBASE_STORAGE_BUCKET);
    expect(firebaseConfig.messagingSenderId).toBe(env.VITE_FIREBASE_MSG_SENDER_ID);
    expect(firebaseConfig.appId).toBe(env.VITE_FIREBASE_APP_ID);
  });

  it('should have non-empty string values', () => {
    Object.values(firebaseConfig).forEach((val) => {
      expect(typeof val).toBe('string');
      expect(val.length).toBeGreaterThan(0);
    });
  });
});
