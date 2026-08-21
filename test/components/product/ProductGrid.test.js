import React from 'react';
import { shallow } from 'enzyme';
import ProductGrid from '@/components/product/ProductGrid';
import ProductItem from '@/components/product/ProductItem';

jest.mock('@/hooks', () => ({
  useBasket: () => ({
    addToBasket: jest.fn(),
    isItemOnBasket: jest.fn(() => false)
  })
}));

describe('ProductGrid', () => {
  const products = [
    { id: '1', name: 'Glasses A', brand: 'Ray-Ban', price: 100, image: 'img1.jpg', sizes: ['50'] },
    { id: '2', name: 'Glasses B', brand: 'Oakley', price: 200, image: 'img2.jpg', sizes: ['52'] }
  ];

  it('renders a ProductItem for each product', () => {
    const wrapper = shallow(<ProductGrid products={products} />);
    const items = wrapper.find(ProductItem);
    expect(items).toHaveLength(2);
    expect(items.at(0).prop('product')).toEqual(products[0]);
    expect(items.at(1).prop('product')).toEqual(products[1]);
  });

  it('passes addToBasket and isItemOnBasket to each product', () => {
    const wrapper = shallow(<ProductGrid products={products} />);
    const items = wrapper.find(ProductItem);
    items.forEach((item) => {
      expect(typeof item.prop('addToBasket')).toBe('function');
      expect(typeof item.prop('isItemOnBasket')).toBe('function');
    });
  });

  it('renders 12 skeleton items when products is empty', () => {
    const wrapper = shallow(<ProductGrid products={[]} />);
    const items = wrapper.find(ProductItem);
    expect(items).toHaveLength(12);
    items.forEach((item) => {
      expect(item.prop('product')).toEqual({});
    });
  });
});
