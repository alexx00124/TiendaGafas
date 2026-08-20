import React from 'react';
import { shallow } from 'enzyme';
import Home from '@/views/home/index';
import ProductShowcaseGrid from '@/components/product/ProductShowcaseGrid';

jest.mock('@/hooks', () => ({
  useDocumentTitle: jest.fn(),
  useScrollTop: jest.fn(),
  useFeaturedProducts: () => ({
    featuredProducts: [],
    fetchFeaturedProducts: jest.fn(),
    isLoading: false,
    error: ''
  }),
  useRecommendedProducts: () => ({
    recommendedProducts: [],
    fetchRecommendedProducts: jest.fn(),
    isLoading: false,
    error: ''
  })
}));

jest.mock('@/components/common', () => ({
  MessageDisplay: () => <div className="mock-message-display" />
}));

jest.mock('@/components/product', () => ({
  ProductShowcaseGrid: (props) => <div className="mock-showcase-grid" data-products={props.products} />
}));

jest.mock('@/images/banner-girl.png', () => 'banner-girl.png');

describe('Home', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<Home />);
    expect(wrapper.exists()).toBe(true);
  });

  it('renders featured products section', () => {
    const wrapper = shallow(<Home />);
    expect(wrapper.find('.display-header').at(0).find('h1').text()).toBe('Featured Products');
  });

  it('renders recommended products section', () => {
    const wrapper = shallow(<Home />);
    expect(wrapper.find('.display-header').at(1).find('h1').text()).toBe('Recommended Products');
  });

  it('renders ProductShowcaseGrid for featured products', () => {
    const wrapper = shallow(<Home />);
    const grids = wrapper.find('ProductShowcaseGrid');
    expect(grids.length).toBeGreaterThanOrEqual(2);
  });
});
