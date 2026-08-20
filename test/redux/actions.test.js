import * as authActions from '@/redux/actions/authActions';
import * as basketActions from '@/redux/actions/basketActions';
import * as checkoutActions from '@/redux/actions/checkoutActions';
import * as filterActions from '@/redux/actions/filterActions';
import * as miscActions from '@/redux/actions/miscActions';
import * as productActions from '@/redux/actions/productActions';
import * as profileActions from '@/redux/actions/profileActions';
import * as userActions from '@/redux/actions/userActions';
import * as C from '@/constants/constants';

describe('authActions', () => {
  it('signIn', () => {
    expect(authActions.signIn('a@b.c', 'pass')).toEqual({
      type: C.SIGNIN,
      payload: { email: 'a@b.c', password: 'pass' }
    });
  });
  it('signInWithGoogle', () => {
    expect(authActions.signInWithGoogle()).toEqual({ type: C.SIGNIN_WITH_GOOGLE });
  });
  it('signInWithFacebook', () => {
    expect(authActions.signInWithFacebook()).toEqual({ type: C.SIGNIN_WITH_FACEBOOK });
  });
  it('signInWithGithub', () => {
    expect(authActions.signInWithGithub()).toEqual({ type: C.SIGNIN_WITH_GITHUB });
  });
  it('signUp', () => {
    const user = { email: 'a@b.c' };
    expect(authActions.signUp(user)).toEqual({ type: C.SIGNUP, payload: user });
  });
  it('signInSuccess', () => {
    const auth = { id: '1' };
    expect(authActions.signInSuccess(auth)).toEqual({ type: C.SIGNIN_SUCCESS, payload: auth });
  });
  it('setAuthPersistence', () => {
    expect(authActions.setAuthPersistence()).toEqual({ type: C.SET_AUTH_PERSISTENCE });
  });
  it('signOut', () => {
    expect(authActions.signOut()).toEqual({ type: C.SIGNOUT });
  });
  it('signOutSuccess', () => {
    expect(authActions.signOutSuccess()).toEqual({ type: C.SIGNOUT_SUCCESS });
  });
  it('onAuthStateChanged', () => {
    expect(authActions.onAuthStateChanged()).toEqual({ type: C.ON_AUTHSTATE_CHANGED });
  });
  it('onAuthStateSuccess', () => {
    const user = { uid: 'u1' };
    expect(authActions.onAuthStateSuccess(user)).toEqual({ type: C.ON_AUTHSTATE_SUCCESS, payload: user });
  });
  it('onAuthStateFail', () => {
    const err = new Error('x');
    expect(authActions.onAuthStateFail(err)).toEqual({ type: C.ON_AUTHSTATE_FAIL, payload: err });
  });
  it('resetPassword', () => {
    expect(authActions.resetPassword('e@m.com')).toEqual({ type: C.RESET_PASSWORD, payload: 'e@m.com' });
  });
});

describe('basketActions', () => {
  it('setBasketItems default', () => {
    expect(basketActions.setBasketItems()).toEqual({ type: C.SET_BASKET_ITEMS, payload: [] });
  });
  it('setBasketItems with items', () => {
    expect(basketActions.setBasketItems([{ id: 1 }])).toEqual({ type: C.SET_BASKET_ITEMS, payload: [{ id: 1 }] });
  });
  it('addToBasket', () => {
    const p = { id: 1 };
    expect(basketActions.addToBasket(p)).toEqual({ type: C.ADD_TO_BASKET, payload: p });
  });
  it('removeFromBasket', () => {
    expect(basketActions.removeFromBasket(2)).toEqual({ type: C.REMOVE_FROM_BASKET, payload: 2 });
  });
  it('clearBasket', () => {
    expect(basketActions.clearBasket()).toEqual({ type: C.CLEAR_BASKET });
  });
  it('addQtyItem', () => {
    expect(basketActions.addQtyItem(3)).toEqual({ type: C.ADD_QTY_ITEM, payload: 3 });
  });
  it('minusQtyItem', () => {
    expect(basketActions.minusQtyItem(4)).toEqual({ type: C.MINUS_QTY_ITEM, payload: 4 });
  });
});

describe('checkoutActions', () => {
  it('setShippingDetails', () => {
    expect(checkoutActions.setShippingDetails({ city: 'mad' }))
      .toEqual({ type: C.SET_CHECKOUT_SHIPPING_DETAILS, payload: { city: 'mad' } });
  });
  it('setPaymentDetails', () => {
    expect(checkoutActions.setPaymentDetails({ type: 'card' }))
      .toEqual({ type: C.SET_CHECKOUT_PAYMENT_DETAILS, payload: { type: 'card' } });
  });
  it('resetCheckout', () => {
    expect(checkoutActions.resetCheckout()).toEqual({ type: C.RESET_CHECKOUT });
  });
});

describe('filterActions', () => {
  it('setTextFilter', () => {
    expect(filterActions.setTextFilter('ray')).toEqual({ type: C.SET_TEXT_FILTER, payload: 'ray' });
  });
  it('setBrandFilter', () => {
    expect(filterActions.setBrandFilter('rayban')).toEqual({ type: C.SET_BRAND_FILTER, payload: 'rayban' });
  });
  it('setMinPriceFilter', () => {
    expect(filterActions.setMinPriceFilter(10)).toEqual({ type: C.SET_MIN_PRICE_FILTER, payload: 10 });
  });
  it('setMaxPriceFilter', () => {
    expect(filterActions.setMaxPriceFilter(99)).toEqual({ type: C.SET_MAX_PRICE_FILTER, payload: 99 });
  });
  it('resetFilter', () => {
    expect(filterActions.resetFilter()).toEqual({ type: C.RESET_FILTER });
  });
  it('clearRecentSearch', () => {
    expect(filterActions.clearRecentSearch()).toEqual({ type: C.CLEAR_RECENT_SEARCH });
  });
  it('removeSelectedRecent', () => {
    expect(filterActions.removeSelectedRecent('x')).toEqual({ type: C.REMOVE_SELECTED_RECENT, payload: 'x' });
  });
  it('applyFilter', () => {
    expect(filterActions.applyFilter({ sortBy: 'price' })).toEqual({ type: C.APPLY_FILTER, payload: { sortBy: 'price' } });
  });
});

describe('miscActions', () => {
  it('setLoading default and explicit', () => {
    expect(miscActions.setLoading()).toEqual({ type: C.LOADING, payload: true });
    expect(miscActions.setLoading(false)).toEqual({ type: C.LOADING, payload: false });
  });
  it('setAuthenticating', () => {
    expect(miscActions.setAuthenticating()).toEqual({ type: C.IS_AUTHENTICATING, payload: true });
    expect(miscActions.setAuthenticating(false)).toEqual({ type: C.IS_AUTHENTICATING, payload: false });
  });
  it('setRequestStatus', () => {
    expect(miscActions.setRequestStatus('ok')).toEqual({ type: C.SET_REQUEST_STATUS, payload: 'ok' });
  });
  it('setAuthStatus default', () => {
    expect(miscActions.setAuthStatus()).toEqual({ type: C.SET_AUTH_STATUS, payload: null });
  });
  it('setAuthStatus with status', () => {
    expect(miscActions.setAuthStatus({ msg: 'hi' })).toEqual({ type: C.SET_AUTH_STATUS, payload: { msg: 'hi' } });
  });
});

describe('productActions', () => {
  it('getProducts', () => {
    expect(productActions.getProducts('k1')).toEqual({ type: C.GET_PRODUCTS, payload: 'k1' });
  });
  it('getProductsSuccess', () => {
    const p = { items: [1] };
    expect(productActions.getProductsSuccess(p)).toEqual({ type: C.GET_PRODUCTS_SUCCESS, payload: p });
  });
  it('cancelGetProducts', () => {
    expect(productActions.cancelGetProducts()).toEqual({ type: C.CANCEL_GET_PRODUCTS });
  });
  it('addProduct', () => {
    expect(productActions.addProduct({ id: 1 })).toEqual({ type: C.ADD_PRODUCT, payload: { id: 1 } });
  });
  it('searchProduct', () => {
    expect(productActions.searchProduct('ray')).toEqual({ type: C.SEARCH_PRODUCT, payload: { searchKey: 'ray' } });
  });
  it('searchProductSuccess', () => {
    const p = { items: [] };
    expect(productActions.searchProductSuccess(p)).toEqual({ type: C.SEARCH_PRODUCT_SUCCESS, payload: p });
  });
  it('clearSearchState', () => {
    expect(productActions.clearSearchState()).toEqual({ type: C.CLEAR_SEARCH_STATE });
  });
  it('addProductSuccess', () => {
    expect(productActions.addProductSuccess({ id: 2 })).toEqual({ type: C.ADD_PRODUCT_SUCCESS, payload: { id: 2 } });
  });
  it('removeProduct', () => {
    expect(productActions.removeProduct(3)).toEqual({ type: C.REMOVE_PRODUCT, payload: 3 });
  });
  it('removeProductSuccess', () => {
    expect(productActions.removeProductSuccess(3)).toEqual({ type: C.REMOVE_PRODUCT_SUCCESS, payload: 3 });
  });
  it('editProduct', () => {
    expect(productActions.editProduct(1, { name: 'a' }))
      .toEqual({ type: C.EDIT_PRODUCT, payload: { id: 1, updates: { name: 'a' } } });
  });
  it('editProductSuccess', () => {
    expect(productActions.editProductSuccess({ name: 'a' }))
      .toEqual({ type: C.EDIT_PRODUCT_SUCCESS, payload: { name: 'a' } });
  });
});

describe('profileActions', () => {
  it('clearProfile', () => {
    expect(profileActions.clearProfile()).toEqual({ type: C.CLEAR_PROFILE });
  });
  it('setProfile', () => {
    expect(profileActions.setProfile({ n: 1 })).toEqual({ type: C.SET_PROFILE, payload: { n: 1 } });
  });
  it('updateEmail', () => {
    expect(profileActions.updateEmail('pw', 'new@e.com'))
      .toEqual({ type: C.UPDATE_EMAIL, payload: { password: 'pw', newEmail: 'new@e.com' } });
  });
  it('updateProfile', () => {
    const newProfile = { updates: { a: 1 }, files: {}, credentials: {} };
    expect(profileActions.updateProfile(newProfile))
      .toEqual({ type: C.UPDATE_PROFILE, payload: newProfile });
  });
  it('updateProfileSuccess', () => {
    expect(profileActions.updateProfileSuccess({ a: 1 }))
      .toEqual({ type: C.UPDATE_PROFILE_SUCCESS, payload: { a: 1 } });
  });
});

describe('userActions', () => {
  it('registerUser', () => {
    expect(userActions.registerUser({ name: 'a' })).toEqual({ type: C.REGISTER_USER, payload: { name: 'a' } });
  });
  it('getUser', () => {
    expect(userActions.getUser('u1')).toEqual({ type: C.GET_USER, payload: 'u1' });
  });
  it('addUser', () => {
    expect(userActions.addUser({ name: 'b' })).toEqual({ type: C.ADD_USER, payload: { name: 'b' } });
  });
  it('editUser', () => {
    expect(userActions.editUser({ name: 'c' })).toEqual({ type: C.EDIT_USER, payload: { name: 'c' } });
  });
  it('deleteUser', () => {
    expect(userActions.deleteUser(5)).toEqual({ type: C.DELETE_USER, payload: 5 });
  });
});
