import { call, put, select, all } from 'redux-saga/effects';
import productSaga from '@/redux/sagas/productSaga';
import firebase from '@/services/firebase';
import { history } from '@/routers/AppRouter';
import {
  ADD_PRODUCT,
  EDIT_PRODUCT,
  GET_PRODUCTS,
  REMOVE_PRODUCT,
  SEARCH_PRODUCT
} from '@/constants/constants';
import { ADMIN_PRODUCTS } from '@/constants/routes';
import { setLoading, setRequestStatus } from '@/redux/actions/miscActions';
import {
  addProductSuccess,
  clearSearchState,
  editProductSuccess,
  getProductsSuccess,
  removeProductSuccess,
  searchProductSuccess
} from '@/redux/actions/productActions';
import { displayActionMessage } from '@/helpers/utils';

// Helper: iterate initRequest sub-generator
function runInitRequest(gen) {
  const initGen = gen.next().value;
  expect(initGen.next().value).toEqual(put(setLoading(true)));
  expect(initGen.next().value).toEqual(put(setRequestStatus(null)));
  expect(initGen.next().done).toBe(true);
}

// Helper: iterate handleError sub-generator
function runHandleError(gen, message) {
  const handleErrorGen = gen.throw(new Error(message)).value;
  expect(handleErrorGen.next().value).toEqual(put(setLoading(false)));
  expect(handleErrorGen.next().value).toEqual(put(setRequestStatus(message)));
  expect(handleErrorGen.next().done).toBe(true);
}

// Helper: iterate handleAction sub-generator
function runHandleAction(gen, location, message, status) {
  const handleActionGen = gen.next().value;
  if (location) {
    expect(handleActionGen.next().value).toEqual(call(history.push, location));
  }
  expect(handleActionGen.next().value).toEqual(call(displayActionMessage, message, status));
  expect(handleActionGen.next().done).toBe(true);
}

describe('productSaga', () => {
  describe('GET_PRODUCTS', () => {
    it('fetches products successfully', () => {
      const gen = productSaga({ type: GET_PRODUCTS, payload: { key: 'date', sortBy: 'desc' } });
      runInitRequest(gen);

      expect(gen.next().value).toEqual(select());
      const state = { products: { lastRefKey: null, total: 0 } };
      expect(gen.next(state).value).toEqual(call(firebase.getProducts, { key: 'date', sortBy: 'desc' }));

      const result = { products: [{ id: '1' }], lastKey: 'key1', total: 1 };
      expect(gen.next(result).value).toEqual(put(getProductsSuccess({
        products: [{ id: '1' }],
        lastKey: 'key1',
        total: 1
      })));
      expect(gen.next().value).toEqual(put(setRequestStatus('')));
      expect(gen.next().value).toEqual(put(setLoading(false)));
      expect(gen.next().done).toBe(true);
    });

    it('handles empty results', () => {
      const gen = productSaga({ type: GET_PRODUCTS, payload: {} });
      runInitRequest(gen);
      gen.next(); // select()
      gen.next({ products: { lastRefKey: null, total: 0 } }); // state

      const handleErrorGen = gen.next({ products: [], lastKey: null, total: 0 }).value;
      expect(handleErrorGen.next().value).toEqual(put(setLoading(false)));
      expect(handleErrorGen.next().value).toEqual(put(setRequestStatus('No items found.')));
      expect(handleErrorGen.next().done).toBe(true);

      expect(gen.next().value).toEqual(put(setLoading(false)));
      expect(gen.next().done).toBe(true);
    });

    it('handles fetch error', () => {
      const gen = productSaga({ type: GET_PRODUCTS, payload: {} });
      runInitRequest(gen);
      gen.next(); // select()
      gen.next({ products: {} }); // state

      runHandleError(gen, 'Network error');
      expect(gen.next().done).toBe(true);
    });

    it('falls back to state lastRefKey and total when result lacks them', () => {
      const gen = productSaga({ type: GET_PRODUCTS, payload: {} });
      runInitRequest(gen);
      gen.next(); // select()
      const state = { products: { lastRefKey: 'prevKey', total: 5 } };
      gen.next(state); // state
      const result = { products: [{ id: '1' }], lastKey: undefined, total: undefined };
      expect(gen.next(result).value).toEqual(put(getProductsSuccess({
        products: [{ id: '1' }],
        lastKey: 'prevKey',
        total: 5
      })));
    });
  });

  describe('ADD_PRODUCT', () => {
    const productPayload = {
      name: 'Glasses',
      price: 99,
      image: { name: 'img.jpg', type: 'image/jpeg', size: 1000 },
      imageCollection: [],
      description: 'Nice glasses'
    };

    it('adds product successfully with empty imageCollection', () => {
      const gen = productSaga({ type: ADD_PRODUCT, payload: productPayload });
      runInitRequest(gen);

      expect(gen.next().value).toEqual(call(firebase.generateKey));
      expect(gen.next('key1').value).toEqual(call(firebase.storeImage, 'key1', 'products', productPayload.image));

      expect(gen.next('url1').value).toEqual(call(firebase.addProduct, 'key1',
        expect.objectContaining({ name: 'Glasses', image: 'url1' })
      ));
      expect(gen.next().value).toEqual(put(addProductSuccess(
        expect.objectContaining({ id: 'key1', name: 'Glasses' })
      )));

      // handleAction(ADMIN_PRODUCTS, 'Item succesfully added', 'success')
      runHandleAction(gen, ADMIN_PRODUCTS, 'Item succesfully added', 'success');
      expect(gen.next().value).toEqual(put(setLoading(false)));
      expect(gen.next().done).toBe(true);
    });

    it('handles add product error', () => {
      const gen = productSaga({ type: ADD_PRODUCT, payload: productPayload });
      runInitRequest(gen);
      gen.next(); // generateKey

      const handleErrorGen = gen.throw(new Error('Upload failed')).value;
      expect(handleErrorGen.next().value).toEqual(put(setLoading(false)));
      expect(handleErrorGen.next().value).toEqual(put(setRequestStatus('Upload failed')));
      expect(handleErrorGen.next().done).toBe(true);

      // handleAction(undefined, 'Item failed to add: Upload failed', 'error')
      runHandleAction(gen, undefined, 'Item failed to add: Upload failed', 'error');
      expect(gen.next().done).toBe(true);
    });
  });

  describe('REMOVE_PRODUCT', () => {
    it('removes product successfully', () => {
      const gen = productSaga({ type: REMOVE_PRODUCT, payload: 'product1' });
      runInitRequest(gen);
      expect(gen.next().value).toEqual(call(firebase.removeProduct, 'product1'));
      expect(gen.next().value).toEqual(put(removeProductSuccess('product1')));
      expect(gen.next().value).toEqual(put(setLoading(false)));

      // handleAction(ADMIN_PRODUCTS, 'Item succesfully removed', 'success')
      runHandleAction(gen, ADMIN_PRODUCTS, 'Item succesfully removed', 'success');
      expect(gen.next().done).toBe(true);
    });

    it('handles remove error', () => {
      const gen = productSaga({ type: REMOVE_PRODUCT, payload: 'product1' });
      runInitRequest(gen);
      gen.next(); // removeProduct

      runHandleError(gen, 'Delete failed');
      // handleAction(undefined, 'Item failed to remove: Delete failed', 'error')
      runHandleAction(gen, undefined, 'Item failed to remove: Delete failed', 'error');
      expect(gen.next().done).toBe(true);
    });
  });

  describe('SEARCH_PRODUCT', () => {
    it('searches products successfully', () => {
      const gen = productSaga({ type: SEARCH_PRODUCT, payload: { searchKey: 'rayban' } });
      runInitRequest(gen);
      expect(gen.next().value).toEqual(put(clearSearchState()));
      expect(gen.next().value).toEqual(select());
      const state = { products: { searchedProducts: { lastRefKey: null, total: 0 } } };
      expect(gen.next(state).value).toEqual(call(firebase.searchProducts, 'rayban'));

      const result = { products: [{ id: '1' }], lastKey: 'k1', total: 1 };
      expect(gen.next(result).value).toEqual(put(searchProductSuccess({
        products: [{ id: '1' }],
        lastKey: 'k1',
        total: 1
      })));
      expect(gen.next().value).toEqual(put(setRequestStatus('')));
      expect(gen.next().value).toEqual(put(setLoading(false)));
      expect(gen.next().done).toBe(true);
    });

    it('handles empty search results', () => {
      const gen = productSaga({ type: SEARCH_PRODUCT, payload: { searchKey: 'none' } });
      runInitRequest(gen);
      gen.next(); // clearSearchState
      gen.next(); // select()
      gen.next({ products: { searchedProducts: { lastRefKey: null, total: 0 } } }); // state

      const handleErrorGen = gen.next({ products: [], lastKey: null, total: 0 }).value;
      expect(handleErrorGen.next().value).toEqual(put(setLoading(false)));
      expect(handleErrorGen.next().value).toEqual(put(setRequestStatus('No product found.')));
      expect(handleErrorGen.next().done).toBe(true);

      expect(gen.next().value).toEqual(put(clearSearchState()));
      expect(gen.next().value).toEqual(put(setLoading(false)));
      expect(gen.next().done).toBe(true);
    });

    it('handles search error', () => {
      const gen = productSaga({ type: SEARCH_PRODUCT, payload: { searchKey: 'x' } });
      runInitRequest(gen);
      gen.next(); // clearSearchState
      gen.next(); // select()
      gen.next({ products: { searchedProducts: {} } }); // state

      runHandleError(gen, 'Search failed');
      expect(gen.next().done).toBe(true);
    });
  });

  describe('default', () => {
    it('throws on unexpected action type', () => {
      const gen = productSaga({ type: 'UNKNOWN', payload: {} });
      expect(() => gen.next()).toThrow('Unexpected action type UNKNOWN');
    });
  });
});
