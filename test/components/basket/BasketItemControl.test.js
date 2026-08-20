import React from 'react';
import { shallow } from 'enzyme';
import { useDispatch } from 'react-redux';
import { addQtyItem, minusQtyItem } from '@/redux/actions/basketActions';
import BasketItemControl from '@/components/basket/BasketItemControl';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock('@/redux/actions/basketActions', () => ({
  addQtyItem: jest.fn((id) => ({ type: 'ADD_QTY_ITEM', payload: id })),
  minusQtyItem: jest.fn((id) => ({ type: 'MINUS_QTY_ITEM', payload: id })),
}));

describe('BasketItemControl', () => {
  const product = { id: '1', quantity: 2, maxQuantity: 5 };
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const wrapper = shallow(<BasketItemControl product={product} />);
    expect(wrapper.exists()).toBe(true);
  });

  it('renders add and minus buttons', () => {
    const wrapper = shallow(<BasketItemControl product={product} />);
    expect(wrapper.find('.basket-control-add').exists()).toBe(true);
    expect(wrapper.find('.basket-control-minus').exists()).toBe(true);
  });

  it('dispatches addQtyItem when clicking + and quantity < maxQuantity', () => {
    const wrapper = shallow(<BasketItemControl product={product} />);
    wrapper.find('.basket-control-add').simulate('click');
    expect(mockDispatch).toHaveBeenCalledWith(addQtyItem('1'));
  });

  it('dispatches minusQtyItem when clicking - and quantity > 1', () => {
    const wrapper = shallow(<BasketItemControl product={product} />);
    wrapper.find('.basket-control-minus').simulate('click');
    expect(mockDispatch).toHaveBeenCalledWith(minusQtyItem('1'));
  });

  it('disables + button when quantity === maxQuantity', () => {
    const maxProduct = { ...product, quantity: 5, maxQuantity: 5 };
    const wrapper = shallow(<BasketItemControl product={maxProduct} />);
    expect(wrapper.find('.basket-control-add').prop('disabled')).toBe(true);
  });

  it('enables + button when quantity < maxQuantity', () => {
    const wrapper = shallow(<BasketItemControl product={product} />);
    expect(wrapper.find('.basket-control-add').prop('disabled')).toBe(false);
  });

  it('disables - button when quantity === 1', () => {
    const minProduct = { ...product, quantity: 1 };
    const wrapper = shallow(<BasketItemControl product={minProduct} />);
    expect(wrapper.find('.basket-control-minus').prop('disabled')).toBe(true);
  });

  it('enables - button when quantity > 1', () => {
    const wrapper = shallow(<BasketItemControl product={product} />);
    expect(wrapper.find('.basket-control-minus').prop('disabled')).toBe(false);
  });

  it('calls onAddQty but does not dispatch when quantity === maxQuantity', () => {
    const maxProduct = { ...product, quantity: 5, maxQuantity: 5 };
    const wrapper = shallow(<BasketItemControl product={maxProduct} />);
    wrapper.find('.basket-control-add').simulate('click');
    expect(mockDispatch).not.toHaveBeenCalledWith(addQtyItem('1'));
  });
});
