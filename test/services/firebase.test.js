jest.mock('firebase/app', () => {
  const { buildFirebaseAppMock } = require('./firebaseAppMock');
  return buildFirebaseAppMock();
});

jest.mock('firebase/auth', () => ({}));
jest.mock('firebase/firestore', () => ({}));
jest.mock('firebase/storage', () => ({}));
jest.mock('@/services/config', () => ({ apiKey: 'test' }));

import firebase from '@/services/firebase';
import {
  mockApi,
  mkCollection,
  authInstance,
  getFirestoreInstance,
  getStorageInstance,
  getAuthInstance
} from './firebaseAppMock';

const db = getFirestoreInstance();
const storage = getStorageInstance();

const mockAuthUser = (overrides = {}) => ({
  uid: 'u1',
  email: 'user@test.com',
  metadata: { creationTime: '2020-01-01' },
  updatePassword: jest.fn(),
  updateEmail: jest.fn(),
  reauthenticateWithCredential: jest.fn(),
  ...overrides
});

describe('firebase service methods', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    db.collection.mockReset();
    storage.ref.mockReset();
    mockApi.auth.mockReset();
    mockApi.firestore.mockReset();
    mockApi.storage.mockReset();
    mockApi.initializeApp.mockReset();
    authInstance.createUserWithEmailAndPassword.mockReset();
    authInstance.signInWithEmailAndPassword.mockReset();
    authInstance.signInWithPopup.mockReset();
    authInstance.signOut.mockReset();
    authInstance.sendPasswordResetEmail.mockReset();
    authInstance.setPersistence.mockReset();
    authInstance.onAuthStateChanged.mockReset();
    authInstance.createUserWithEmailAndPassword.mockResolvedValue('ok');
    authInstance.signInWithEmailAndPassword.mockResolvedValue('ok');
    authInstance.signInWithPopup.mockResolvedValue('ok');
    authInstance.signOut.mockResolvedValue('ok');
    authInstance.sendPasswordResetEmail.mockResolvedValue('ok');
    authInstance.setPersistence.mockResolvedValue('ok');
    authInstance.onAuthStateChanged.mockImplementation(() => {});
    db.collection.mockImplementation(() => mkCollection());
    storage.ref.mockImplementation(() => ({ child: jest.fn(() => ({ put: jest.fn(), delete: jest.fn() })) }));
    mockApi.auth.mockImplementation(() => getAuthInstance());
    mockApi.firestore.mockImplementation(() => getFirestoreInstance());
    mockApi.storage.mockImplementation(() => getStorageInstance());
  });

  describe('auth methods', () => {
    it('createAccount calls auth.createUserWithEmailAndPassword', async () => {
      await firebase.createAccount('a@b.c', 'pw');
      expect(authInstance.createUserWithEmailAndPassword).toHaveBeenCalledWith('a@b.c', 'pw');
    });

    it('signIn calls auth.signInWithEmailAndPassword', () => {
      firebase.signIn('a@b.c', 'pw');
      expect(authInstance.signInWithEmailAndPassword).toHaveBeenCalledWith('a@b.c', 'pw');
    });

    it('signInWithGoogle uses GoogleAuthProvider', () => {
      firebase.signInWithGoogle();
      expect(authInstance.signInWithPopup).toHaveBeenCalled();
    });

    it('signInWithFacebook and signInWithGithub call popup', () => {
      firebase.signInWithFacebook();
      firebase.signInWithGithub();
      expect(authInstance.signInWithPopup).toHaveBeenCalledTimes(2);
    });

    it('signOut calls auth.signOut', () => {
      firebase.signOut();
      expect(authInstance.signOut).toHaveBeenCalled();
    });

    it('passwordReset calls sendPasswordResetEmail', () => {
      firebase.passwordReset('a@b.c');
      expect(authInstance.sendPasswordResetEmail).toHaveBeenCalledWith('a@b.c');
    });

    it('setAuthPersistence calls the persistence API', () => {
      firebase.setAuthPersistence();
      expect(authInstance.setPersistence).toHaveBeenCalledWith('local');
    });

    it('reauthenticate uses EmailAuthProvider', () => {
      const currentUser = mockAuthUser({ reauthenticateWithCredential: jest.fn().mockResolvedValue('ok') });
      authInstance.currentUser = currentUser;
      const result = firebase.reauthenticate('secret-pw');
      expect(currentUser.reauthenticateWithCredential).toHaveBeenCalled();
      expect(result).toBeDefined();
      delete authInstance.currentUser;
    });

    it('passwordUpdate updates current user password', () => {
      const currentUser = mockAuthUser();
      authInstance.currentUser = currentUser;
      firebase.passwordUpdate('n');
      expect(currentUser.updatePassword).toHaveBeenCalledWith('n');
      delete authInstance.currentUser;
    });

    it('changePassword resolves on success', async () => {
      const currentUser = mockAuthUser({
        reauthenticateWithCredential: jest.fn().mockResolvedValue(),
        updatePassword: jest.fn().mockResolvedValue()
      });
      authInstance.currentUser = currentUser;
      await expect(firebase.changePassword('old', 'new')).resolves.toBe('Password updated successfully!');
      delete authInstance.currentUser;
    });

    it('changePassword rejects when reauthenticate fails', async () => {
      const currentUser = mockAuthUser({ reauthenticateWithCredential: jest.fn().mockRejectedValue(new Error('bad pw')) });
      authInstance.currentUser = currentUser;
      await expect(firebase.changePassword('old', 'new')).rejects.toThrow('bad pw');
      delete authInstance.currentUser;
    });

    it('changePassword rejects when updatePassword fails', async () => {
      const currentUser = mockAuthUser({
        reauthenticateWithCredential: jest.fn().mockResolvedValue(),
        updatePassword: jest.fn().mockRejectedValue(new Error('weak'))
      });
      authInstance.currentUser = currentUser;
      await expect(firebase.changePassword('old', 'new')).rejects.toThrow('weak');
      delete authInstance.currentUser;
    });

    it('onAuthStateChanged resolves when user present', async () => {
      const currentUser = mockAuthUser();
      authInstance.onAuthStateChanged.mockImplementation((cb) => cb(currentUser));
      await expect(firebase.onAuthStateChanged()).resolves.toEqual(currentUser);
    });

    it('onAuthStateChanged rejects when no user', async () => {
      authInstance.onAuthStateChanged.mockImplementation((cb) => cb(null));
      await expect(firebase.onAuthStateChanged()).rejects.toThrow('Auth State Changed failed');
    });
  });

  describe('user methods', () => {
    it('addUser writes to users collection via doc', async () => {
      const doc = { set: jest.fn().mockResolvedValue('ok') };
      db.collection.mockReturnValue({ doc: jest.fn(() => doc) });
      const result = await firebase.addUser('u1', { name: 'x' });
      expect(db.collection).toHaveBeenCalledWith('users');
      expect(doc.set).toHaveBeenCalledWith({ name: 'x' });
      expect(result).toBe('ok');
    });

    it('getUser reads users/u1', async () => {
      const doc = { get: jest.fn().mockResolvedValue('snap') };
      db.collection.mockReturnValue({ doc: jest.fn(() => doc) });
      const result = await firebase.getUser('u1');
      expect(result).toBe('snap');
    });

    it('updateProfile updates users collection', () => {
      firebase.updateProfile('u1', { name: 'New' });
      expect(db.collection).toHaveBeenCalledWith('users');
    });

    it('saveBasketItems updates user basket', () => {
      firebase.saveBasketItems([{ id: 1 }], 'u1');
      expect(db.collection).toHaveBeenCalledWith('users');
    });
  });

  describe('product methods', () => {
    it('getSingleProduct reads products doc', () => {
      firebase.getSingleProduct('p1');
      expect(db.collection).toHaveBeenCalledWith('products');
    });

    it('getProducts with no lastRefKey resolves with total', async () => {
      const totalQuery = { docs: [{ id: 1 }, { id: 2 }] };
      const snapshot = {
        forEach: (cb) => cb({ id: 'p1', data: () => ({ name: 'A' }) }),
        docs: [{ id: 'p1' }]
      };
      db.collection
        .mockReturnValueOnce({
          get: jest.fn().mockResolvedValue(totalQuery)
        })
        .mockReturnValueOnce({
          orderBy: jest.fn(() => ({ limit: jest.fn(() => ({ get: jest.fn().mockResolvedValue(snapshot) })) }))
        });
      const result = await firebase.getProducts(null);
      expect(result.products).toEqual([{ id: 'p1', name: 'A' }]);
      expect(result.total).toBe(2);
    });

    it('getProducts with lastRefKey uses startAfter', async () => {
      const snapshot = {
        forEach: (cb) => cb({ id: 'p2', data: () => ({ name: 'B' }) }),
        docs: [{ id: 'p2' }]
      };
      const startAfter = jest.fn(() => ({ limit: jest.fn(() => ({ get: jest.fn().mockResolvedValue(snapshot) })) }));
      const orderBy = jest.fn(() => ({ startAfter }));
      db.collection.mockReturnValue({ orderBy });
      const result = await firebase.getProducts('k1');
      expect(orderBy).toHaveBeenCalled();
      expect(startAfter).toHaveBeenCalledWith('k1');
      expect(result.products).toEqual([{ id: 'p2', name: 'B' }]);
    });

    it('getProducts rejects on error', async () => {
      db.collection.mockReturnValue({
        get: jest.fn().mockRejectedValue({})
      });
      await expect(firebase.getProducts(null)).rejects.toBe(':( Failed to fetch products.');
    });

    it('searchProducts merges name + keyword results', async () => {
      const nameSnaps = {
        empty: false,
        forEach: (cb) => cb({ id: 'n1', data: () => ({ name_lower: 'ray-ban' }) }),
        docs: [{ id: 'n1' }]
      };
      const keywordsSnaps = {
        empty: false,
        forEach: (cb) => cb({ id: 'k1', data: () => ({ name: 'RAY' }) }),
        docs: [{ id: 'k1' }]
      };
      const nameChain = {
        where: jest.fn(() => ({
          where: jest.fn(() => ({ limit: jest.fn(() => ({ get: jest.fn().mockResolvedValue(nameSnaps) })) }))
        }))
      };
      const keywordsChain = {
        where: jest.fn(() => ({ limit: jest.fn(() => ({ get: jest.fn().mockResolvedValue(keywordsSnaps) })) }))
      };
      db.collection.mockReturnValue({
        orderBy: jest.fn((field) => (field === 'name_lower' ? nameChain : keywordsChain))
      });
      const result = await firebase.searchProducts('ray');
      expect(result.products).toHaveLength(2);
      expect(result.lastKey).toEqual({ id: 'n1' });
    });

    it('searchProducts succeeds when both empty', async () => {
      const empty = { empty: true, forEach: jest.fn() };
      const nameChain = {
        where: jest.fn(() => ({
          where: jest.fn(() => ({ limit: jest.fn(() => ({ get: jest.fn().mockResolvedValue(empty) })) }))
        }))
      };
      const keywordsChain = {
        where: jest.fn(() => ({ limit: jest.fn(() => ({ get: jest.fn().mockResolvedValue(empty) })) }))
      };
      db.collection.mockReturnValue({
        orderBy: jest.fn((field) => (field === 'name_lower' ? nameChain : keywordsChain))
      });
      const result = await firebase.searchProducts('x');
      expect(result.products).toEqual([]);
    });

    it('getFeaturedProducts chains where', () => {
      const coll = mkCollection();
      db.collection.mockReturnValue(coll);
      firebase.getFeaturedProducts(4);
      expect(coll.where).toHaveBeenCalledWith('isFeatured', '==', true);
    });

    it('getRecommendedProducts chains where', () => {
      const coll = mkCollection();
      db.collection.mockReturnValue(coll);
      firebase.getRecommendedProducts(3);
      expect(coll.where).toHaveBeenCalledWith('isRecommended', '==', true);
    });

    it('addProduct writes via doc', () => {
      firebase.addProduct('p1', { name: 'A' });
      expect(db.collection).toHaveBeenCalledWith('products');
    });

    it('generateKey returns doc id', () => {
      const doc = { id: 'generated-id' };
      db.collection.mockReturnValue({ doc: jest.fn(() => doc) });
      expect(firebase.generateKey()).toBe('generated-id');
    });

    it('editProduct updates doc', () => {
      firebase.editProduct('p1', { name: 'B' });
      expect(db.collection).toHaveBeenCalledWith('products');
    });

    it('removeProduct deletes doc', () => {
      firebase.removeProduct('p1');
      expect(db.collection).toHaveBeenCalledWith('products');
    });
  });

  describe('storage methods', () => {
    it('storeImage uploads and returns URL', async () => {
      const put = jest.fn().mockResolvedValue({
        ref: { getDownloadURL: jest.fn().mockResolvedValue('http://url') }
      });
      storage.ref.mockReturnValue({ child: jest.fn(() => ({ put })) });
      const url = await firebase.storeImage('id1', 'products', 'file');
      expect(put).toHaveBeenCalledWith('file');
      expect(url).toBe('http://url');
    });

    it('deleteImage deletes storage ref', () => {
      const del = jest.fn();
      storage.ref.mockReturnValue({ child: jest.fn(() => ({ delete: del })) });
      firebase.deleteImage('id1');
      expect(del).toHaveBeenCalled();
    });
  });
});