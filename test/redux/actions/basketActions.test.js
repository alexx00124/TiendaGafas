import {
  setBasketItems,
  addToBasket,
  removeFromBasket,
  clearBasket,
  addQtyItem,
  minusQtyItem
} from '@/redux/actions/basketActions';
import * as types from '@/constants/constants';

describe('basketActions', () => {
  it('should create setBasketItems action with default empty array', () => {
    expect(setBasketItems()).toEqual({
      type: types.SET_BASKET_ITEMS,
      payload: []
    });
  });

  it('should create setBasketItems action with items', () => {
    const items = [{ id: '1' }, { id: '2' }];
    expect(setBasketItems(items)).toEqual({
      type: types.SET_BASKET_ITEMS,
      payload: items
    });
  });

  it('should create addToBasket action', () => {
    const product = { id: '1', name: 'Glasses' };
    expect(addToBasket(product)).toEqual({
      type: types.ADD_TO_BASKET,
      payload: product
    });
  });

  it('should create removeFromBasket action', () => {
    expect(removeFromBasket('id-1')).toEqual({
      type: types.REMOVE_FROM_BASKET,
      payload: 'id-1'
    });
  });

  it('should create clearBasket action', () => {
    expect(clearBasket()).toEqual({ type: types.CLEAR_BASKET });
  });

  it('should create addQtyItem action', () => {
    expect(addQtyItem('id-1')).toEqual({
      type: types.ADD_QTY_ITEM,
      payload: 'id-1'
    });
  });

  it('should create minusQtyItem action', () => {
    expect(minusQtyItem('id-1')).toEqual({
      type: types.MINUS_QTY_ITEM,
      payload: 'id-1'
    });
  });
});
