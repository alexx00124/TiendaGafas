import React from 'react';
import { shallow } from 'enzyme';
import { useDispatch } from 'react-redux';
import { removeFromBasket } from '@/redux/actions/basketActions';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  Link: ({ children, ...props }) => <a {...props}>{children}</a>,
}));

jest.mock('@/components/common', () => ({
  ImageLoader: (props) => <img {...props} />,
}));

jest.mock('@/helpers/utils', () => ({
  displayMoney: (n) => `$${n}`,
}));

jest.mock('@/components/basket/BasketItemControl', () => {
  const MockControl = (props) => (
    <div className="basket-item-control-mock" data-product-id={props.product.id} />
  );
  MockControl.displayName = 'BasketItemControl';
  return MockControl;
});

import BasketItem from '@/components/basket/BasketItem';

describe('BasketItem', () => {
  const product = {
    id: '1',
    name: 'Glasses',
    image: 'img.jpg',
    price: 100,
    quantity: 2,
    selectedSize: '50',
    selectedColor: '#000',
    availableColors: ['#000', '#fff'],
  };

  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const wrapper = shallow(<BasketItem product={product} />);
    expect(wrapper.exists()).toBe(true);
  });

  it('renders product name', () => {
    const wrapper = shallow(<BasketItem product={product} />);
    expect(wrapper.find('.basket-item-name').text()).toBe('Glasses');
  });

  it('renders product price with displayMoney', () => {
    const wrapper = shallow(<BasketItem product={product} />);
    expect(wrapper.find('.basket-item-price').text()).toBe('$200');
  });

  it('renders product image', () => {
    const wrapper = shallow(<BasketItem product={product} />);
    const img = wrapper.find('ImageLoader');
    expect(img.prop('src')).toBe('img.jpg');
    expect(img.prop('alt')).toBe('Glasses');
  });

  it('renders quantity', () => {
    const wrapper = shallow(<BasketItem product={product} />);
    expect(wrapper.html()).toContain('2');
  });

  it('renders size', () => {
    const wrapper = shallow(<BasketItem product={product} />);
    expect(wrapper.html()).toContain('50');
  });

  it('dispatches removeFromBasket on close button click', () => {
    const wrapper = shallow(<BasketItem product={product} />);
    wrapper.find('.basket-item-remove').simulate('click');
    expect(mockDispatch).toHaveBeenCalledWith(removeFromBasket('1'));
  });

  it('renders BasketItemControl with product id', () => {
    const wrapper = shallow(<BasketItem product={product} />);
    expect(wrapper.find('BasketItemControl').prop('product')).toEqual(product);
  });
});
