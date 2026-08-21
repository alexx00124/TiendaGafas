import React from 'react';
import { shallow } from 'enzyme';
import ProductShowcaseGrid from '@/components/product/ProductShowcaseGrid';
import ProductFeatured from '@/components/product/ProductFeatured';

describe('ProductShowcaseGrid', () => {
  const products = [
    { id: '1', name: 'Glasses A', brand: 'Ray-Ban', image: 'img1.jpg' },
    { id: '2', name: 'Glasses B', brand: 'Oakley', image: 'img2.jpg' }
  ];

  it('renders a ProductFeatured for each product', () => {
    const wrapper = shallow(<ProductShowcaseGrid products={products} />);
    const items = wrapper.find(ProductFeatured);
    expect(items).toHaveLength(2);
    expect(items.at(0).prop('product')).toEqual(products[0]);
    expect(items.at(1).prop('product')).toEqual(products[1]);
  });

  it('renders skeletonCount skeletons when products is empty', () => {
    const wrapper = shallow(<ProductShowcaseGrid products={[]} skeletonCount={4} />);
    const items = wrapper.find(ProductFeatured);
    expect(items).toHaveLength(4);
    items.forEach((item) => {
      expect(item.prop('product')).toEqual({});
    });
  });

  it('defaults skeletonCount to 4', () => {
    const wrapper = shallow(<ProductShowcaseGrid products={[]} />);
    expect(wrapper.find(ProductFeatured)).toHaveLength(4);
  });
});
