import React from 'react';
import { shallow } from 'enzyme';
import ProductItem from '@/components/product/ProductItem';
import * as reactRouter from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  useHistory: jest.fn(),
  withRouter: (C) => C
}));

jest.mock('@/components/common', () => ({
  ImageLoader: (props) => <img {...props} />
}));

const mockHistory = { push: jest.fn() };
reactRouter.useHistory.mockReturnValue(mockHistory);

const product = {
  id: '1',
  name: 'Glasses',
  brand: 'Ray-Ban',
  price: 100,
  image: 'img.jpg',
  sizes: ['50', '52']
};

describe('ProductItem', () => {
  beforeEach(() => {
    mockHistory.push.mockClear();
  });

  it('renders product name, brand, and price', () => {
    const wrapper = shallow(
      <ProductItem product={product} isItemOnBasket={() => false} addToBasket={() => {}} />
    );
    expect(wrapper.find('.product-card-name').text()).toBe('Glasses');
    expect(wrapper.find('.product-card-brand').text()).toBe('Ray-Ban');
    expect(wrapper.find('.product-card-price').text()).toContain('$100');
  });

  it('calls history.push with the product route on click', () => {
    const wrapper = shallow(
      <ProductItem product={product} isItemOnBasket={() => false} addToBasket={() => {}} />
    );
    wrapper.find('.product-card-content').simulate('click');
    expect(mockHistory.push).toHaveBeenCalledWith('/product/1');
  });

  it('calls addToBasket with the product and selected size', () => {
    const addToBasket = jest.fn();
    const wrapper = shallow(
      <ProductItem product={product} isItemOnBasket={() => false} addToBasket={addToBasket} />
    );
    wrapper.find('.product-card-button').simulate('click');
    expect(addToBasket).toHaveBeenCalledWith({ ...product, selectedSize: '50' });
  });

  it('renders a skeleton when product has no id', () => {
    const skeletonProduct = { name: 'Glasses', brand: 'Ray-Ban' };
    const wrapper = shallow(
      <ProductItem product={skeletonProduct} isItemOnBasket={() => false} addToBasket={() => {}} />
    );
    expect(wrapper.find('.product-loading').exists()).toBe(true);
    expect(wrapper.find('.product-card-button').exists()).toBe(false);
  });

  it('shows Remove from basket when item is on basket', () => {
    const wrapper = shallow(
      <ProductItem product={product} isItemOnBasket={() => true} addToBasket={jest.fn()} />
    );
    expect(wrapper.find('.product-card-button').text()).toBe('Remove from basket');
  });
});
