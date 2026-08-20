import {
  getProducts,
  getProductsSuccess,
  cancelGetProducts,
  addProduct,
  searchProduct,
  searchProductSuccess,
  clearSearchState,
  addProductSuccess,
  removeProduct,
  removeProductSuccess,
  editProduct,
  editProductSuccess
} from '@/redux/actions/productActions';
import * as types from '@/constants/constants';

describe('productActions', () => {
  it('should create getProducts action', () => {
    expect(getProducts('ref1')).toEqual({
      type: types.GET_PRODUCTS,
      payload: 'ref1'
    });
  });

  it('should create getProductsSuccess action', () => {
    const products = [{ id: '1' }];
    expect(getProductsSuccess(products)).toEqual({
      type: types.GET_PRODUCTS_SUCCESS,
      payload: products
    });
  });

  it('should create cancelGetProducts action', () => {
    expect(cancelGetProducts()).toEqual({ type: types.CANCEL_GET_PRODUCTS });
  });

  it('should create addProduct action', () => {
    const product = { name: 'Glasses' };
    expect(addProduct(product)).toEqual({
      type: types.ADD_PRODUCT,
      payload: product
    });
  });

  it('should create searchProduct action', () => {
    expect(searchProduct('rayban')).toEqual({
      type: types.SEARCH_PRODUCT,
      payload: { searchKey: 'rayban' }
    });
  });

  it('should create searchProductSuccess action', () => {
    const products = [{ id: '1' }];
    expect(searchProductSuccess(products)).toEqual({
      type: types.SEARCH_PRODUCT_SUCCESS,
      payload: products
    });
  });

  it('should create clearSearchState action', () => {
    expect(clearSearchState()).toEqual({ type: types.CLEAR_SEARCH_STATE });
  });

  it('should create addProductSuccess action', () => {
    const product = { id: '1', name: 'Glasses' };
    expect(addProductSuccess(product)).toEqual({
      type: types.ADD_PRODUCT_SUCCESS,
      payload: product
    });
  });

  it('should create removeProduct action', () => {
    expect(removeProduct('id-1')).toEqual({
      type: types.REMOVE_PRODUCT,
      payload: 'id-1'
    });
  });

  it('should create removeProductSuccess action', () => {
    expect(removeProductSuccess('id-1')).toEqual({
      type: types.REMOVE_PRODUCT_SUCCESS,
      payload: 'id-1'
    });
  });

  it('should create editProduct action', () => {
    expect(editProduct('id-1', { name: 'Updated' })).toEqual({
      type: types.EDIT_PRODUCT,
      payload: { id: 'id-1', updates: { name: 'Updated' } }
    });
  });

  it('should create editProductSuccess action', () => {
    const updates = { name: 'Updated' };
    expect(editProductSuccess(updates)).toEqual({
      type: types.EDIT_PRODUCT_SUCCESS,
      payload: updates
    });
  });
});
