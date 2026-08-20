import React from 'react';
import { shallow } from 'enzyme';
import FeaturedProducts from '@/views/featured/index';
import { ProductSection } from '@/components/common';

jest.mock('@/hooks', () => ({
  useDocumentTitle: jest.fn(),
  useScrollTop: jest.fn(),
  useFeaturedProducts: () => ({
    featuredProducts: [],
    fetchFeaturedProducts: jest.fn(),
    isLoading: false,
    error: ''
  })
}));

jest.mock('@/components/common', () => ({
  ProductSection: (props) => <div className="mock-product-section" data-products={props.products} />
}));

jest.mock('@/images/banner-guy.png', () => 'banner-guy.png');

describe('FeaturedProducts', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<FeaturedProducts />);
    expect(wrapper.exists()).toBe(true);
  });

  it('renders the featured products banner', () => {
    const wrapper = shallow(<FeaturedProducts />);
    expect(wrapper.find('h1').text()).toBe('Featured Products');
  });

  it('renders ProductSection', () => {
    const wrapper = shallow(<FeaturedProducts />);
    expect(wrapper.find(ProductSection).exists()).toBe(true);
  });
});
