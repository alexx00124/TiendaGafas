// Helper para mockear firebase/app en los tests.
// Se importa desde la factory de jest.mock para evitar problemas de hoisting.

const mockProvider = jest.fn();

// authInstance: lo que devuelve app.auth() -> this.auth en el constructor.
const authInstance = {
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signInWithPopup: jest.fn(),
  signOut: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  setPersistence: jest.fn(),
  onAuthStateChanged: jest.fn()
};

// Instancias singleton que el constructor de Firebase captura una sola vez.
let firestoreInstance;
let storageInstance;

function mkCollection() {
  return {
    get: jest.fn(),
    set: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    doc: jest.fn(() => ({ id: 'generated-id', ...mkCollection() })),
    orderBy: jest.fn(() => ({ ...mkCollection(), startAfter: jest.fn(() => mkCollection()) })),
    where: jest.fn(() => mkCollection()),
    limit: jest.fn(() => mkCollection())
  };
}

function resetInstances() {
  firestoreInstance = {
    collection: jest.fn(() => mkCollection())
  };
  storageInstance = {
    ref: jest.fn(() => ({ child: jest.fn(() => ({ put: jest.fn(), delete: jest.fn() })) }))
  };
}

function getFirestoreInstance() {
  return firestoreInstance;
}

function getStorageInstance() {
  return storageInstance;
}

function getAuthInstance() {
  return authInstance;
}

function buildFirebaseAppMock() {
  // Wrappers que pasan las llamadas a los mocks de mockApi, pero que
  // ademas exponen las "estaticas" (GoogleAuthProvider, FieldPath, etc.)
  // que el codigo fuente accede via app.auth.X / app.firestore.X.
  const authWrapper = (...a) => mockApi.auth(...a);
  authWrapper.EmailAuthProvider = { credential: jest.fn(() => 'cred') };
  authWrapper.GoogleAuthProvider = mockProvider;
  authWrapper.FacebookAuthProvider = mockProvider;
  authWrapper.GithubAuthProvider = mockProvider;
  authWrapper.Auth = { Persistence: { LOCAL: 'local' } };

  const firestoreWrapper = (...a) => mockApi.firestore(...a);
  firestoreWrapper.FieldPath = { documentId: jest.fn(() => 'docId') };

  resetInstances();

  return {
    __esModule: true,
    default: {
      initializeApp: (...a) => mockApi.initializeApp(...a),
      storage: (...a) => mockApi.storage(...a),
      firestore: firestoreWrapper,
      auth: authWrapper
    }
  };
}

const mockApi = {
  initializeApp: jest.fn(),
  storage: jest.fn(() => storageInstance),
  firestore: jest.fn(() => firestoreInstance),
  auth: jest.fn(() => authInstance)
};

module.exports = {
  mockApi,
  mockProvider,
  mkCollection,
  authInstance,
  resetInstances,
  buildFirebaseAppMock,
  getFirestoreInstance,
  getStorageInstance,
  getAuthInstance
};