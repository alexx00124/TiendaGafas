jest.mock('firebase/app', () => {
  const mockAuth = {
    createUserWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: { uid: '1' } })),
    signInWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: { uid: '1' } })),
    signInWithPopup: jest.fn(() => Promise.resolve({ user: { uid: '1' } })),
    signOut: jest.fn(() => Promise.resolve()),
    sendPasswordResetEmail: jest.fn(() => Promise.resolve()),
    currentUser: {
      updatePassword: jest.fn(() => Promise.resolve()),
      updateEmail: jest.fn(() => Promise.resolve()),
      email: 'test@test.com',
      reauthenticateWithCredential: jest.fn(() => Promise.resolve()),
    },
    setPersistence: jest.fn(() => Promise.resolve()),
    onAuthStateChanged: jest.fn((cb) => {
      cb({ uid: '1' });
      return jest.fn();
    }),
  };

  const mockDoc = {
    set: jest.fn(() => Promise.resolve()),
    get: jest.fn(() => Promise.resolve({ data: () => ({ id: '1' }) })),
    update: jest.fn(() => Promise.resolve()),
    delete: jest.fn(() => Promise.resolve()),
    id: 'mock-doc-id',
  };

  const mockSnapshot = {
    docs: [{ id: '1', data: () => ({}) }],
    forEach: jest.fn(),
    empty: false,
  };

  const mockQueryChain = {
    where: jest.fn(() => mockQueryChain),
    orderBy: jest.fn(() => mockQueryChain),
    limit: jest.fn(() => ({
      get: jest.fn(() => Promise.resolve(mockSnapshot)),
    })),
    startAfter: jest.fn(() => mockQueryChain),
    get: jest.fn(() => Promise.resolve(mockSnapshot)),
  };

  const mockCollection = {
    doc: jest.fn(() => mockDoc),
    where: jest.fn(() => mockQueryChain),
    orderBy: jest.fn(() => mockQueryChain),
    get: jest.fn(() => Promise.resolve(mockSnapshot)),
  };

  const mockStorageRef = {
    child: jest.fn(() => ({
      put: jest.fn(() =>
        Promise.resolve({
          ref: {
            getDownloadURL: jest.fn(() => Promise.resolve('http://url')),
          },
        })
      ),
      delete: jest.fn(() => Promise.resolve()),
    })),
  };

  function AuthFn() {}
  AuthFn.GoogleAuthProvider = function () {};
  AuthFn.FacebookAuthProvider = function () {};
  AuthFn.GithubAuthProvider = function () {};
  AuthFn.EmailAuthProvider = { credential: jest.fn(() => ({})) };
  AuthFn.Auth = { Persistence: { LOCAL: 'LOCAL' } };

  const mockFirestoreInstance = {
    collection: jest.fn(() => mockCollection),
    useEmulator: jest.fn(),
  };

  function FirestoreFn() {}
  FirestoreFn.FieldPath = { documentId: jest.fn(() => '__doc_id__') };

  return {
    __esModule: true,
    default: {
      initializeApp: jest.fn(),
      auth: Object.assign(jest.fn(() => mockAuth), AuthFn),
      firestore: Object.assign(jest.fn(() => mockFirestoreInstance), FirestoreFn),
      storage: jest.fn(() => ({
        ref: jest.fn(() => mockStorageRef),
      })),
    },
  };
});

jest.mock('@/services/config', () => ({ apiKey: 'test' }));

import firebase from '@/services/firebase';

describe('Firebase', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createAccount', () => {
    it('creates an account with email and password', async () => {
      const result = await firebase.createAccount('a@b.com', 'pass');
      expect(result).toEqual({ user: { uid: '1' } });
    });
  });

  describe('signIn', () => {
    it('signs in with email and password', async () => {
      const result = await firebase.signIn('a@b.com', 'pass');
      expect(result).toEqual({ user: { uid: '1' } });
    });
  });

  describe('signInWithGoogle', () => {
    it('signs in with Google popup', async () => {
      const result = await firebase.signInWithGoogle();
      expect(result).toEqual({ user: { uid: '1' } });
    });
  });

  describe('signInWithFacebook', () => {
    it('signs in with Facebook popup', async () => {
      const result = await firebase.signInWithFacebook();
      expect(result).toEqual({ user: { uid: '1' } });
    });
  });

  describe('signInWithGithub', () => {
    it('signs in with Github popup', async () => {
      const result = await firebase.signInWithGithub();
      expect(result).toEqual({ user: { uid: '1' } });
    });
  });

  describe('signOut', () => {
    it('signs out the user', async () => {
      await firebase.signOut();
    });
  });

  describe('passwordReset', () => {
    it('sends password reset email', async () => {
      await firebase.passwordReset('a@b.com');
    });
  });

  describe('addUser', () => {
    it('adds a user document', async () => {
      await firebase.addUser('u1', { name: 'Test' });
    });
  });

  describe('getUser', () => {
    it('gets a user document', async () => {
      const result = await firebase.getUser('u1');
      expect(result.data()).toEqual({ id: '1' });
    });
  });

  describe('passwordUpdate', () => {
    it('updates the password', async () => {
      await firebase.passwordUpdate('newpass');
    });
  });

  describe('changePassword', () => {
    it('reauthenticates and updates password', async () => {
      const result = await firebase.changePassword('oldpass', 'newpass');
      expect(result).toBe('Password updated successfully!');
    });
  });

  describe('reauthenticate', () => {
    it('reauthenticates with credential', async () => {
      await firebase.reauthenticate('pass');
    });
  });

  describe('updateEmail', () => {
    it('reauthenticates and updates email', async () => {
      const result = await firebase.updateEmail('pass', 'new@b.com');
      expect(result).toBe('Email Successfully updated');
    });
  });

  describe('updateProfile', () => {
    it('updates user profile', async () => {
      await firebase.updateProfile('u1', { name: 'New' });
    });
  });

  describe('onAuthStateChanged', () => {
    it('resolves with user when authenticated', async () => {
      const result = await firebase.onAuthStateChanged();
      expect(result).toEqual({ uid: '1' });
    });
  });

  describe('saveBasketItems', () => {
    it('saves basket items to user doc', async () => {
      await firebase.saveBasketItems([{ id: 'p1' }], 'u1');
    });
  });

  describe('setAuthPersistence', () => {
    it('sets auth persistence to LOCAL', async () => {
      await firebase.setAuthPersistence();
    });
  });

  describe('getSingleProduct', () => {
    it('gets a single product document', async () => {
      const result = await firebase.getSingleProduct('p1');
      expect(result.data()).toEqual({ id: '1' });
    });
  });

  describe('getProducts', () => {
    it('fetches products with lastRefKey', async () => {
      const result = await firebase.getProducts('lastKey');
      expect(result).toHaveProperty('products');
      expect(result).toHaveProperty('lastKey');
    });

    it('fetches products on initial load (no lastRefKey)', async () => {
      const result = await firebase.getProducts(null);
      expect(result).toHaveProperty('products');
      expect(result).toHaveProperty('lastKey');
      expect(result).toHaveProperty('total');
    });
  });

  describe('searchProducts', () => {
    it('searches products by name and keywords', async () => {
      const result = await firebase.searchProducts('test');
      expect(result).toHaveProperty('products');
      expect(result).toHaveProperty('lastKey');
    });
  });

  describe('getFeaturedProducts', () => {
    it('gets featured products', async () => {
      const result = await firebase.getFeaturedProducts();
      expect(result).toBeDefined();
    });
  });

  describe('getRecommendedProducts', () => {
    it('gets recommended products', async () => {
      const result = await firebase.getRecommendedProducts();
      expect(result).toBeDefined();
    });
  });

  describe('addProduct', () => {
    it('adds a product document', async () => {
      await firebase.addProduct('p1', { name: 'Glasses' });
    });
  });

  describe('generateKey', () => {
    it('generates a new document key', () => {
      const key = firebase.generateKey();
      expect(key).toBe('mock-doc-id');
    });
  });

  describe('storeImage', () => {
    it('stores an image and returns download URL', async () => {
      const url = await firebase.storeImage('img1', 'products', 'file');
      expect(url).toBe('http://url');
    });
  });

  describe('deleteImage', () => {
    it('deletes an image from storage', async () => {
      await firebase.deleteImage('img1');
    });
  });

  describe('editProduct', () => {
    it('updates a product document', async () => {
      await firebase.editProduct('p1', { name: 'Updated' });
    });
  });

  describe('removeProduct', () => {
    it('deletes a product document', async () => {
      await firebase.removeProduct('p1');
    });
  });
});
