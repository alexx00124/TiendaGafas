import React from 'react';
import { shallow } from 'enzyme';
import RecommendedProducts from '@/views/recommended/index';
import { ProductSection } from '@/components/common';

jest.mock('@/hooks', () => ({
  useDocumentTitle: jest.fn(),
  useScrollTop: jest.fn(),
  useRecommendedProducts: () => ({
    recommendedProducts: [],
    fetchRecommendedProducts: jest.fn(),
    isLoading: false,
    error: ''
  })
}));

jest.mock('@/components/common', () => ({
  ProductSection: (props) => <div className="mock-product-section" data-products={props.products} />
}));

jest.mock('@/images/banner-girl-1.png', () => 'banner-girl-1.png');

describe('RecommendedProducts', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<RecommendedProducts />);
    expect(wrapper.exists()).toBe(true);
  });

  it('renders the recommended products banner', () => {
    const wrapper = shallow(<RecommendedProducts />);
    expect(wrapper.find('h1').text()).toBe('Recommended Products');
  });

  it('renders ProductSection', () => {
    const wrapper = shallow(<RecommendedProducts />);
    expect(wrapper.find(ProductSection).exists()).toBe(true);
  });
});
