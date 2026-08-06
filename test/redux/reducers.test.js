import filterReducer from '@/redux/reducers/filterReducer';
import productReducer from '@/redux/reducers/productReducer';
import basketReducer from '@/redux/reducers/basketReducer';
import miscReducer from '@/redux/reducers/miscReducer';
import authReducer from '@/redux/reducers/authReducer';
import userReducer from '@/redux/reducers/userReducer';
import profileReducer from '@/redux/reducers/profileReducer';
import checkoutReducer from '@/redux/reducers/checkoutReducer';
import * as C from '@/constants/constants';

describe('filterReducer', () => {
  it('SET_TEXT_FILTER adds keyword to recent list', () => {
    const state = { recent: [], keyword: '', brand: '', minPrice: 0, maxPrice: 0, sortBy: '' };
    const next = filterReducer(state, { type: C.SET_TEXT_FILTER, payload: 'ray' });
    expect(next.keyword).toBe('ray');
    expect(next.recent).toEqual(['ray']);
  });

  it('SET_TEXT_FILTER with empty payload does not add to recent', () => {
    const state = { recent: [], keyword: '', brand: '', minPrice: 0, maxPrice: 0, sortBy: '' };
    const next = filterReducer(state, { type: C.SET_TEXT_FILTER, payload: '' });
    expect(next.recent).toEqual([]);
  });

  it('SET_TEXT_FILTER does not duplicate existing recent item', () => {
    const state = { recent: ['ray'], keyword: 'ray', brand: '', minPrice: 0, maxPrice: 0, sortBy: '' };
    const next = filterReducer(state, { type: C.SET_TEXT_FILTER, payload: 'ray' });
    expect(next.recent).toEqual(['ray']);
  });

  it('SET_BRAND_FILTER and price filters', () => {
    let next = filterReducer(undefined, { type: C.SET_BRAND_FILTER, payload: 'rayban' });
    expect(next.brand).toBe('rayban');
    next = filterReducer(next, { type: C.SET_MIN_PRICE_FILTER, payload: 10 });
    next = filterReducer(next, { type: C.SET_MAX_PRICE_FILTER, payload: 100 });
    expect(next.minPrice).toBe(10);
    expect(next.maxPrice).toBe(100);
  });

  it('APPLY_FILTER merges payload', () => {
    const next = filterReducer(undefined, { type: C.APPLY_FILTER, payload: { sortBy: 'price-desc' } });
    expect(next.sortBy).toBe('price-desc');
  });

  it('CLEAR_RECENT_SEARCH and REMOVE_SELECTED_RECENT', () => {
    let state = { recent: ['a', 'b'], keyword: 'a', brand: '', minPrice: 0, maxPrice: 0, sortBy: '' };
    state = filterReducer(state, { type: C.REMOVE_SELECTED_RECENT, payload: 'a' });
    expect(state.recent).toEqual(['b']);
    state = filterReducer(state, { type: C.CLEAR_RECENT_SEARCH });
    expect(state.recent).toEqual([]);
  });

  it('RESET_FILTER returns initState', () => {
    let state = { recent: ['a'], keyword: 'a', brand: 'x', minPrice: 5, maxPrice: 50, sortBy: 'name' };
    state = filterReducer(state, { type: C.RESET_FILTER });
    expect(state).toEqual({ recent: [], keyword: '', brand: '', minPrice: 0, maxPrice: 0, sortBy: '' });
  });

  it('returns same state for unknown action', () => {
    const state = { recent: [], keyword: '', brand: '', minPrice: 0, maxPrice: 0, sortBy: '' };
    expect(filterReducer(state, { type: 'UNKNOWN' })).toBe(state);
  });
});

describe('productReducer', () => {
  const base = { lastRefKey: null, total: 0, items: [], searchedProducts: { lastRefKey: null, total: 0, items: [] } };

  it('GET_PRODUCTS_SUCCESS appends products', () => {
    const next = productReducer(base, {
      type: C.GET_PRODUCTS_SUCCESS,
      payload: { lastKey: 'k1', total: 1, products: [{ id: 1 }] }
    });
    expect(next.total).toBe(1);
    expect(next.items).toEqual([{ id: 1 }]);
  });

  it('ADD_PRODUCT_SUCCESS adds product', () => {
    const next = productReducer(base, { type: C.ADD_PRODUCT_SUCCESS, payload: { id: 2 } });
    expect(next.items).toEqual([{ id: 2 }]);
  });

  it('SEARCH_PRODUCT_SUCCESS fills searchedProducts', () => {
    const next = productReducer(base, {
      type: C.SEARCH_PRODUCT_SUCCESS,
      payload: { lastKey: 'k1', total: 3, products: [{ id: 1 }, { id: 2 }] }
    });
    expect(next.searchedProducts.total).toBe(3);
    expect(next.searchedProducts.items).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it('CLEAR_SEARCH_STATE resets searchedProducts', () => {
    let next = productReducer(base, {
      type: C.SEARCH_PRODUCT_SUCCESS,
      payload: { lastKey: 'k1', total: 3, products: [{ id: 1 }] }
    });
    next = productReducer(next, { type: C.CLEAR_SEARCH_STATE });
    expect(next.searchedProducts).toEqual({ lastRefKey: null, total: 0, items: [] });
  });

  it('REMOVE_PRODUCT_SUCCESS removes product by id', () => {
    const state = { ...base, items: [{ id: 1 }, { id: 2 }] };
    const next = productReducer(state, { type: C.REMOVE_PRODUCT_SUCCESS, payload: 1 });
    expect(next.items).toEqual([{ id: 2 }]);
  });

  it('EDIT_PRODUCT_SUCCESS updates matching product only', () => {
    const state = { ...base, items: [{ id: 1, name: 'a' }, { id: 2, name: 'b' }] };
    const next = productReducer(state, {
      type: C.EDIT_PRODUCT_SUCCESS,
      payload: { id: 1, updates: { name: 'z' } }
    });
    expect(next.items).toEqual([{ id: 1, name: 'z' }, { id: 2, name: 'b' }]);
  });
});

describe('basketReducer', () => {
  it('SET_BASKET_ITEMS replaces items', () => {
    expect(basketReducer([], { type: C.SET_BASKET_ITEMS, payload: [{ id: 1 }] })).toEqual([{ id: 1 }]);
  });

  it('ADD_TO_BASKET adds unique and ignores existing', () => {
    let next = basketReducer([{ id: 1 }], { type: C.ADD_TO_BASKET, payload: { id: 2 } });
    expect(next).toEqual([{ id: 2 }, { id: 1 }]);
    next = basketReducer([{ id: 1 }], { type: C.ADD_TO_BASKET, payload: { id: 1 } });
    expect(next).toEqual([{ id: 1 }]);
  });

  it('REMOVE_FROM_BASKET filters product', () => {
    const next = basketReducer([{ id: 1 }, { id: 2 }], { type: C.REMOVE_FROM_BASKET, payload: 1 });
    expect(next).toEqual([{ id: 2 }]);
  });

  it('ADD_QTY_ITEM and MINUS_QTY_ITEM adjust quantity', () => {
    let next = basketReducer([{ id: 1, quantity: 1 }], { type: C.ADD_QTY_ITEM, payload: 1 });
    expect(next[0].quantity).toBe(2);
    next = basketReducer([{ id: 1, quantity: 3 }], { type: C.MINUS_QTY_ITEM, payload: 1 });
    expect(next[0].quantity).toBe(2);
  });

  it('CLEAR_BASKET empties array', () => {
    expect(basketReducer([{ id: 1 }], { type: C.CLEAR_BASKET })).toEqual([]);
  });
});

describe('miscReducer', () => {
  it('handles LOADING / IS_AUTHENTICATING / SET_REQUEST_STATUS / SET_AUTH_STATUS', () => {
    let state = miscReducer(undefined, { type: C.LOADING, payload: true });
    expect(state.loading).toBe(true);
    state = miscReducer(state, { type: C.IS_AUTHENTICATING, payload: true });
    expect(state.isAuthenticating).toBe(true);
    state = miscReducer(state, { type: C.SET_REQUEST_STATUS, payload: 'ok' });
    expect(state.requestStatus).toBe('ok');
    state = miscReducer(state, { type: C.SET_AUTH_STATUS, payload: 'signed_in' });
    expect(state.authStatus).toBe('signed_in');
  });
});

describe('authReducer', () => {
  it('SIGNIN_SUCCESS / SIGNOUT_SUCCESS', () => {
    const next = authReducer(null, {
      type: C.SIGNIN_SUCCESS,
      payload: { id: 'u1', role: 'admin', provider: 'github' }
    });
    expect(next).toEqual({ id: 'u1', role: 'admin', provider: 'github' });
    expect(authReducer(next, { type: C.SIGNOUT_SUCCESS })).toBeNull();
  });
});

describe('userReducer', () => {
  it('ADD_USER / EDIT_USER / DELETE_USER', () => {
    let state = userReducer([], { type: C.ADD_USER, payload: { id: 1, name: 'a' } });
    expect(state).toEqual([{ id: 1, name: 'a' }]);
    state = userReducer(state, { type: C.EDIT_USER, payload: { id: 1, name: 'b' } });
    expect(state).toEqual([{ id: 1, name: 'b' }]);
    state = userReducer(state, { type: C.DELETE_USER, payload: 1 });
    expect(state).toEqual([]);
  });
});

describe('profileReducer', () => {
  it('SET_PROFILE / UPDATE_PROFILE_SUCCESS / CLEAR_PROFILE', () => {
    let state = profileReducer({}, { type: C.SET_PROFILE, payload: { name: 'x' } });
    expect(state).toEqual({ name: 'x' });
    state = profileReducer(state, { type: C.UPDATE_PROFILE_SUCCESS, payload: { age: 30 } });
    expect(state).toEqual({ name: 'x', age: 30 });
    state = profileReducer(state, { type: C.CLEAR_PROFILE });
    expect(state).toEqual({});
  });
});

describe('checkoutReducer', () => {
  it('SET_CHECKOUT_SHIPPING_DETAILS / SET_CHECKOUT_PAYMENT_DETAILS / RESET_CHECKOUT', () => {
    let state = checkoutReducer(undefined, { type: C.SET_CHECKOUT_SHIPPING_DETAILS, payload: { city: 'mad' } });
    expect(state.shipping).toEqual({ city: 'mad' });
    state = checkoutReducer(state, { type: C.SET_CHECKOUT_PAYMENT_DETAILS, payload: { type: 'card' } });
    expect(state.payment).toEqual({ type: 'card' });
    state = checkoutReducer(state, { type: C.RESET_CHECKOUT });
    expect(state.payment.type).toBe('paypal');
  });
});