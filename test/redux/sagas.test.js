import { runSaga } from 'redux-saga';
import authSaga from '@/redux/sagas/authSaga';
import productSaga from '@/redux/sagas/productSaga';
import profileSaga from '@/redux/sagas/profileSaga';
import rootSaga from '@/redux/sagas/rootSaga';
import * as ROUTES from '@/constants/routes';
import * as C from '@/constants/constants';

const mockHistoryPush = jest.fn();
const mockDisplayActionMessage = jest.fn();

jest.mock('@/services/firebase', () => ({
  signIn: jest.fn(),
  signInWithGoogle: jest.fn(),
  signInWithFacebook: jest.fn(),
  signInWithGithub: jest.fn(),
  signOut: jest.fn(),
  passwordReset: jest.fn(),
  createAccount: jest.fn(),
  addUser: jest.fn(),
  getUser: jest.fn(),
  setAuthPersistence: jest.fn(),
  getSingleProduct: jest.fn(),
  getProducts: jest.fn(),
  searchProducts: jest.fn(),
  generateKey: jest.fn(),
  storeImage: jest.fn(),
  deleteImage: jest.fn(),
  addProduct: jest.fn(),
  editProduct: jest.fn(),
  removeProduct: jest.fn(),
  updateEmail: jest.fn(),
  updateProfile: jest.fn()
}));

jest.mock('@/routers/AppRouter', () => ({
  history: { push: (...args) => mockHistoryPush(...args) }
}));

jest.mock('@/helpers/utils', () => ({
  displayActionMessage: (...args) => mockDisplayActionMessage(...args)
}));

jest.mock('@/images/defaultAvatar.jpg', () => 'avatar.jpg');
jest.mock('@/images/defaultBanner.jpg', () => 'banner.jpg');

import firebase from '@/services/firebase';

const recordSaga = async (saga, initialAction, state = {}) => {
  const dispatched = [];
  await runSaga(
    {
      dispatch: (action) => dispatched.push(action),
      getState: () => state
    },
    saga,
    initialAction
  ).toPromise();
  return dispatched;
};

describe('authSaga', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('SIGNIN success', async () => {
    firebase.signIn.mockResolvedValue({});
    const dispatched = await recordSaga(authSaga, { type: C.SIGNIN, payload: { email: 'a@b.c', password: 'pw' } });
    expect(firebase.signIn).toHaveBeenCalledWith('a@b.c', 'pw');
    expect(dispatched.some((a) => a.type === C.IS_AUTHENTICATING)).toBe(true);
  });

  it('SIGNIN error (network)', async () => {
    firebase.signIn.mockRejectedValue({ code: 'auth/network-request-failed', message: '' });
    const dispatched = await recordSaga(authSaga, { type: C.SIGNIN, payload: { email: 'a@b.c', password: 'pw' } });
    const status = dispatched.filter((a) => a.type === C.SET_AUTH_STATUS).pop();
    expect(status.payload.message).toContain('Network error');
  });

  it('SIGNIN error default message', async () => {
    firebase.signIn.mockRejectedValue({ code: 'unknown-code', message: 'generic boom' });
    const dispatched = await recordSaga(authSaga, { type: C.SIGNIN, payload: {} });
    const status = dispatched.filter((a) => a.type === C.SET_AUTH_STATUS).pop();
    expect(status.payload.message).toBe('generic boom');
  });

  it('SIGNIN_WITH_GOOGLE success', async () => {
    firebase.signInWithGoogle.mockResolvedValue({});
    await recordSaga(authSaga, { type: C.SIGNIN_WITH_GOOGLE });
    expect(firebase.signInWithGoogle).toHaveBeenCalled();
  });

  it('SIGNIN_WITH_GOOGLE error', async () => {
    firebase.signInWithGoogle.mockRejectedValue({ code: 'auth/wrong-password', message: '' });
    const dispatched = await recordSaga(authSaga, { type: C.SIGNIN_WITH_GOOGLE });
    const status = dispatched.filter((a) => a.type === C.SET_AUTH_STATUS).pop();
    expect(status.payload.message).toContain('Incorrect email or password');
  });

  it('SIGNIN_WITH_FACEBOOK success + error', async () => {
    firebase.signInWithFacebook.mockResolvedValue({});
    firebase.signInWithFacebook.mockRejectedValueOnce({ code: 'x', message: 'fb fail' });
    await recordSaga(authSaga, { type: C.SIGNIN_WITH_FACEBOOK });
    expect(firebase.signInWithFacebook).toHaveBeenCalled();
  });

  it('SIGNIN_WITH_GITHUB success + error', async () => {
    firebase.signInWithGithub.mockResolvedValue({});
    firebase.signInWithGithub.mockRejectedValueOnce({ code: 'x', message: 'gh fail' });
    await recordSaga(authSaga, { type: C.SIGNIN_WITH_GITHUB });
    expect(firebase.signInWithGithub).toHaveBeenCalled();
  });

  it('SIGNUP success creates user', async () => {
    firebase.createAccount.mockResolvedValue({
      user: { uid: 'u1', metadata: { creationTime: '2020' } }
    });
    firebase.addUser.mockResolvedValue({});
    const dispatched = await recordSaga(authSaga, {
      type: C.SIGNUP,
      payload: { email: 'a@b.c', password: 'pw', fullname: 'john doe' }
    });
    expect(firebase.addUser).toHaveBeenCalledWith('u1', expect.objectContaining({ fullname: 'John Doe' }));
    expect(dispatched.some((a) => a.type === C.SET_PROFILE)).toBe(true);
  });

  it('SIGNUP error email-already-in-use', async () => {
    firebase.createAccount.mockRejectedValue({ code: 'auth/email-already-in-use', message: '' });
    const dispatched = await recordSaga(authSaga, { type: C.SIGNUP, payload: {} });
    const status = dispatched.filter((a) => a.type === C.SET_AUTH_STATUS).pop();
    expect(status.payload.message).toContain('Email is already in use');
  });

  it('SIGNOUT success', async () => {
    firebase.signOut.mockResolvedValue({});
    const dispatched = await recordSaga(authSaga, { type: C.SIGNOUT });
    expect(firebase.signOut).toHaveBeenCalled();
    expect(dispatched.some((a) => a.type === C.CLEAR_BASKET)).toBe(true);
    expect(dispatched.some((a) => a.type === C.CLEAR_PROFILE)).toBe(true);
    expect(dispatched.some((a) => a.type === C.RESET_FILTER)).toBe(true);
    expect(dispatched.some((a) => a.type === C.RESET_CHECKOUT)).toBe(true);
    expect(dispatched.some((a) => a.type === C.SIGNOUT_SUCCESS)).toBe(true);
    expect(mockHistoryPush).toHaveBeenCalledWith(ROUTES.SIGNIN);
  });

  it('SIGNOUT error', async () => {
    firebase.signOut.mockRejectedValue({ message: 'signout fail' });
    const dispatched = await recordSaga(authSaga, { type: C.SIGNOUT });
    const status = dispatched.filter((a) => a.type === C.SET_AUTH_STATUS).pop();
    expect(status.payload.message).toBe('signout fail');
  });

  it('RESET_PASSWORD success', async () => {
    firebase.passwordReset.mockResolvedValue({});
    const dispatched = await recordSaga(authSaga, { type: C.RESET_PASSWORD, payload: 'e@m.com' });
    expect(firebase.passwordReset).toHaveBeenCalledWith('e@m.com');
    const status = dispatched.filter((a) => a.type === C.SET_AUTH_STATUS).pop();
    expect(status.payload.success).toBe(true);
    expect(status.payload.type).toBe('reset');
  });

  it('RESET_PASSWORD error', async () => {
    firebase.passwordReset.mockRejectedValue({ code: 'x', message: 'reset fail' });
    const dispatched = await recordSaga(authSaga, { type: C.RESET_PASSWORD, payload: 'e@m.com' });
    const status = dispatched.filter((a) => a.type === C.SET_AUTH_STATUS).pop();
    expect(status.payload.message).toContain('Failed to send password reset email');
  });

  it('ON_AUTHSTATE_SUCCESS with existing user', async () => {
    firebase.getUser.mockResolvedValue({
      data: () => ({ role: 'USER', basket: [{ id: 1 }] })
    });
    const dispatched = await recordSaga(authSaga, {
      type: C.ON_AUTHSTATE_SUCCESS,
      payload: { uid: 'u1', providerData: [{ providerId: 'password' }] }
    });
    expect(firebase.getUser).toHaveBeenCalledWith('u1');
    expect(dispatched.some((a) => a.type === C.SET_PROFILE)).toBe(true);
    expect(dispatched.some((a) => a.type === C.SET_BASKET_ITEMS)).toBe(true);
    expect(dispatched.some((a) => a.type === C.SIGNIN_SUCCESS)).toBe(true);
  });

  it('ON_AUTHSTATE_SUCCESS adds non-password provider user', async () => {
    firebase.getUser.mockResolvedValue({ data: () => null });
    firebase.addUser.mockResolvedValue({});
    const dispatched = await recordSaga(authSaga, {
      type: C.ON_AUTHSTATE_SUCCESS,
      payload: {
        uid: 'u2',
        displayName: 'Jane',
        photoURL: 'http://x/p.jpg',
        email: 'j@e.com',
        metadata: { creationTime: '2021' },
        providerData: [{ providerId: 'google.com' }]
      }
    });
    expect(firebase.addUser).toHaveBeenCalledWith('u2', expect.objectContaining({ fullname: 'Jane' }));
    expect(dispatched.some((a) => a.type === C.SIGNIN_SUCCESS)).toBe(true);
  });

  it('ON_AUTHSTATE_FAIL', async () => {
    const dispatched = await recordSaga(authSaga, { type: C.ON_AUTHSTATE_FAIL, payload: {} });
    expect(dispatched.some((a) => a.type === C.CLEAR_PROFILE)).toBe(true);
    expect(dispatched.some((a) => a.type === C.SIGNOUT_SUCCESS)).toBe(true);
  });

  it('SET_AUTH_PERSISTENCE success + error', async () => {
    firebase.setAuthPersistence.mockResolvedValue({});
    await recordSaga(authSaga, { type: C.SET_AUTH_PERSISTENCE });
    expect(firebase.setAuthPersistence).toHaveBeenCalled();

    firebase.setAuthPersistence.mockRejectedValue({ message: 'persist fail' });
    const dispatched = await recordSaga(authSaga, { type: C.SET_AUTH_PERSISTENCE });
    const status = dispatched.filter((a) => a.type === C.SET_AUTH_STATUS).pop();
    expect(status.payload.message).toBe('persist fail');
  });

  it('default throws', async () => {
    await expect(recordSaga(authSaga, { type: 'WHATEVER' })).rejects.toThrow('Unexpected Action Type.');
  });
});

describe('productSaga', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET_PRODUCTS success', async () => {
    firebase.getProducts.mockResolvedValue({ products: [{ id: 1 }], lastKey: 'k', total: 1 });
    const state = { products: { lastRefKey: null, total: 0 } };
    const dispatched = await recordSaga(productSaga, { type: C.GET_PRODUCTS, payload: null }, state);
    expect(firebase.getProducts).toHaveBeenCalled();
    expect(dispatched.some((a) => a.type === C.GET_PRODUCTS_SUCCESS)).toBe(true);
  });

  it('GET_PRODUCTS empty -> error', async () => {
    firebase.getProducts.mockResolvedValue({ products: [], lastKey: null, total: 0 });
    firebase.getProducts.mockRejectedValueOnce({ message: 'boom' });
    const state = { products: { lastRefKey: null, total: 0 } };
    const dispatched = await recordSaga(productSaga, { type: C.GET_PRODUCTS, payload: null }, state);
    expect(dispatched.some((a) => a.type === C.SET_REQUEST_STATUS)).toBe(true);
  });

  it('GET_PRODUCTS rejected', async () => {
    firebase.getProducts.mockRejectedValue({ message: 'network' });
    const dispatched = await recordSaga(productSaga, { type: C.GET_PRODUCTS, payload: null }, { products: {} });
    const status = dispatched.filter((a) => a.type === C.SET_REQUEST_STATUS).pop();
    expect(status.payload).toBe('network');
  });

  it('ADD_PRODUCT success without imageCollection', async () => {
    firebase.generateKey.mockReturnValue('key1');
    firebase.storeImage.mockResolvedValue('http://img');
    firebase.addProduct.mockResolvedValue({});
    const dispatched = await recordSaga(productSaga, {
      type: C.ADD_PRODUCT,
      payload: { imageCollection: [], image: 'file', name: 'X', price: 10 }
    });
    expect(firebase.addProduct).toHaveBeenCalledWith('key1', expect.objectContaining({
      image: 'http://img',
      imageCollection: [{ id: 'key1', url: 'http://img' }]
    }));
    expect(dispatched.some((a) => a.type === C.ADD_PRODUCT_SUCCESS)).toBe(true);
    expect(mockHistoryPush).toHaveBeenCalled();
  });

  it('ADD_PRODUCT success with imageCollection', async () => {
    firebase.generateKey.mockReturnValue('g');
    firebase.storeImage.mockResolvedValue('http://img');
    firebase.addProduct.mockResolvedValue({});
    await recordSaga(productSaga, {
      type: C.ADD_PRODUCT,
      payload: {
        imageCollection: [{ file: 'f1' }],
        image: 'file',
        name: 'X'
      }
    });
    expect(firebase.addProduct).toHaveBeenCalled();
  });

  it('ADD_PRODUCT error', async () => {
    firebase.generateKey.mockReturnValue('k');
    firebase.storeImage.mockRejectedValue({ message: 'upload fail' });
    await recordSaga(productSaga, { type: C.ADD_PRODUCT, payload: { imageCollection: [], image: 'f' } });
    expect(mockDisplayActionMessage).toHaveBeenCalledWith('Item failed to add: upload fail', 'error');
  });

  it('EDIT_PRODUCT keeps url image (not File)', async () => {
    firebase.editProduct.mockResolvedValue({});
    const payload = {
      id: 'p1',
      updates: { image: 'http://exist', imageCollection: [{ id: 1, url: 'http://a' }] }
    };
    const dispatched = await recordSaga(productSaga, { type: C.EDIT_PRODUCT, payload });
    expect(dispatched.some((a) => a.type === C.EDIT_PRODUCT_SUCCESS)).toBe(true);
    expect(mockHistoryPush).toHaveBeenCalled();
  });

  it('EDIT_PRODUCT with File image (single)', async () => {
    firebase.deleteImage.mockResolvedValue({});
    firebase.storeImage.mockResolvedValue('http://new');
    firebase.editProduct.mockResolvedValue({});
    const file = new Blob(['x'], { type: 'image/jpeg' });
    file.constructor = File;
    await recordSaga(productSaga, {
      type: C.EDIT_PRODUCT,
      payload: { id: 'p1', updates: { image: file, imageCollection: [] } }
    });
    expect(firebase.deleteImage).toHaveBeenCalledWith('p1');
    expect(firebase.storeImage).toHaveBeenCalled();
    expect(firebase.editProduct).toHaveBeenCalled();
  });

  it('EDIT_PRODUCT deleteImage error fallback', async () => {
    firebase.deleteImage.mockRejectedValue({ message: 'del fail' });
    firebase.storeImage.mockResolvedValue('http://new');
    firebase.editProduct.mockResolvedValue({});
    const file = new Blob(['x'], { type: 'image/jpeg' });
    file.constructor = File;
    const dispatched = await recordSaga(productSaga, {
      type: C.EDIT_PRODUCT,
      payload: { id: 'p1', updates: { image: file, imageCollection: [] } }
    });
    const status = dispatched.filter((a) => a.type === C.SET_REQUEST_STATUS).pop();
    expect(status.payload).toContain('Failed to delete image');
  });

  it('EDIT_PRODUCT with new imageCollection files', async () => {
    firebase.generateKey.mockReturnValue('g');
    firebase.storeImage.mockResolvedValue('http://new');
    firebase.editProduct.mockResolvedValue({});
    await recordSaga(productSaga, {
      type: C.EDIT_PRODUCT,
      payload: {
        id: 'p1',
        updates: {
          image: 'http://keep',
          imageCollection: [
            { id: 'e1', url: 'http://old' },
            { file: 'f1' }
          ]
        }
      }
    });
    expect(firebase.editProduct).toHaveBeenCalled();
  });

  it('EDIT_PRODUCT error', async () => {
    firebase.editProduct.mockRejectedValue({ message: 'edit fail' });
    await recordSaga(productSaga, {
      type: C.EDIT_PRODUCT,
      payload: { id: 'p1', updates: { image: 'x', imageCollection: [] } }
    });
    expect(mockDisplayActionMessage).toHaveBeenCalledWith('Item failed to edit: edit fail', 'error');
  });

  it('REMOVE_PRODUCT success + error', async () => {
    firebase.removeProduct.mockResolvedValue({});
    const dispatched = await recordSaga(productSaga, { type: C.REMOVE_PRODUCT, payload: 'p1' });
    expect(dispatched.some((a) => a.type === C.REMOVE_PRODUCT_SUCCESS)).toBe(true);

    firebase.removeProduct.mockRejectedValue({ message: 'rm fail' });
    await recordSaga(productSaga, { type: C.REMOVE_PRODUCT, payload: 'p1' });
    expect(mockDisplayActionMessage).toHaveBeenCalledWith('Item failed to remove: rm fail', 'error');
  });

  it('SEARCH_PRODUCT success', async () => {
    firebase.searchProducts.mockResolvedValue({ products: [{ id: 1 }], lastKey: 'k' });
    const state = { products: { searchedProducts: { lastRefKey: null, total: 0 } } };
    const dispatched = await recordSaga(
      productSaga,
      { type: C.SEARCH_PRODUCT, payload: { searchKey: 'ray' } },
      state
    );
    expect(firebase.searchProducts).toHaveBeenCalledWith('ray');
    expect(dispatched.some((a) => a.type === C.SEARCH_PRODUCT_SUCCESS)).toBe(true);
  });

  it('SEARCH_PRODUCT empty results', async () => {
    firebase.searchProducts.mockResolvedValue({ products: [], lastKey: null });
    const state = { products: { searchedProducts: {} } };
    const dispatched = await recordSaga(
      productSaga,
      { type: C.SEARCH_PRODUCT, payload: { searchKey: 'none' } },
      state
    );
    expect(dispatched.some((a) => a.type === C.CLEAR_SEARCH_STATE)).toBe(true);
  });

  it('SEARCH_PRODUCT rejected', async () => {
    firebase.searchProducts.mockRejectedValue({ message: 'search fail' });
    const dispatched = await recordSaga(
      productSaga,
      { type: C.SEARCH_PRODUCT, payload: { searchKey: 'x' } },
      { products: {} }
    );
    expect(dispatched.some((a) => a.type === C.SET_REQUEST_STATUS)).toBe(true);
  });

  it('default throws', async () => {
    await expect(recordSaga(productSaga, { type: 'NOPE' })).rejects.toThrow();
  });
});

describe('profileSaga', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('UPDATE_EMAIL success', async () => {
    firebase.updateEmail.mockResolvedValue({});
    await recordSaga(profileSaga, { type: C.UPDATE_EMAIL, payload: { password: 'pw', newEmail: 'n@e.com' } });
    expect(firebase.updateEmail).toHaveBeenCalledWith('pw', 'n@e.com');
    expect(mockHistoryPush).toHaveBeenCalledWith('/profile');
    expect(mockDisplayActionMessage).toHaveBeenCalledWith('Email Updated Successfully!', 'success');
  });

  it('UPDATE_EMAIL error', async () => {
    firebase.updateEmail.mockRejectedValue({ message: 'email fail' });
    await recordSaga(profileSaga, { type: C.UPDATE_EMAIL, payload: {} });
    expect(mockDisplayActionMessage).toHaveBeenCalledWith('Failed to update email: email fail', 'error');
  });

  it('UPDATE_PROFILE with email+password change', async () => {
    const state = {
      profile: { email: 'old@e.com' },
      auth: { id: 'u1' }
    };
    firebase.updateEmail.mockResolvedValue({});
    firebase.updateProfile.mockResolvedValue({});
    const dispatched = await recordSaga(profileSaga, {
      type: C.UPDATE_PROFILE,
      payload: {
        credentials: { email: 'new@e.com', password: 'pw' },
        files: { avatarFile: null, bannerFile: null },
        updates: { name: 'John' }
      }
    }, state);
    expect(firebase.updateEmail).toHaveBeenCalledWith('pw', 'new@e.com');
    expect(firebase.updateProfile).toHaveBeenCalledWith('u1', { name: 'John' });
    expect(dispatched.some((a) => a.type === C.UPDATE_PROFILE_SUCCESS)).toBe(true);
    expect(mockHistoryPush).toHaveBeenCalled();
  });

  it('UPDATE_PROFILE without email change', async () => {
    const state = { profile: { email: 'same@e.com' }, auth: { id: 'u1' } };
    firebase.updateProfile.mockResolvedValue({});
    await recordSaga(profileSaga, {
      type: C.UPDATE_PROFILE,
      payload: {
        credentials: { email: 'same@e.com', password: 'pw' },
        files: {},
        updates: { name: 'Jane' }
      }
    }, state);
    expect(firebase.updateEmail).not.toHaveBeenCalled();
    expect(firebase.updateProfile).toHaveBeenCalledWith('u1', { name: 'Jane' });
  });

  it('UPDATE_PROFILE with avatar/banner files', async () => {
    const state = { profile: { email: 'a@b.c' }, auth: { id: 'u1' } };
    firebase.storeImage.mockResolvedValue('http://img');
    firebase.updateProfile.mockResolvedValue({});
    await recordSaga(profileSaga, {
      type: C.UPDATE_PROFILE,
      payload: {
        credentials: {},
        files: { avatarFile: 'av', bannerFile: 'bn' },
        updates: { name: 'X' }
      }
    }, state);
    expect(firebase.storeImage).toHaveBeenCalledTimes(2);
    expect(firebase.updateProfile).toHaveBeenCalledWith('u1', expect.objectContaining({
      avatar: 'http://img',
      banner: 'http://img'
    }));
  });

  it('UPDATE_PROFILE error wrong password', async () => {
    firebase.updateProfile.mockRejectedValue({ code: 'auth/wrong-password' });
    await recordSaga(profileSaga, {
      type: C.UPDATE_PROFILE,
      payload: { credentials: {}, files: {}, updates: {} }
    }, { profile: {}, auth: {} });
    expect(mockDisplayActionMessage).toHaveBeenCalledWith('Wrong password, profile update failed :(', 'error');
  });

  it('UPDATE_PROFILE error generic', async () => {
    firebase.updateProfile.mockRejectedValue({ code: 'other', message: 'generic' });
    await recordSaga(profileSaga, {
      type: C.UPDATE_PROFILE,
      payload: { credentials: {}, files: {}, updates: {} }
    }, { profile: {}, auth: {} });
    expect(mockDisplayActionMessage).toHaveBeenCalledWith(':( Failed to update profile. generic', 'error');
  });

  it('default throws', async () => {
    await expect(recordSaga(profileSaga, { type: 'NOPE' })).rejects.toThrow('Unexpected action type.');
  });
});

describe('rootSaga', () => {
  it('is a generator function that runs without throwing', () => {
    const gen = rootSaga();
    expect(typeof gen.next).toBe('function');
    const first = gen.next();
    expect(first.done).toBe(false);
  });
});
