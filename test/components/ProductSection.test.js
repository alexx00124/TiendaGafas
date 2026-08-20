import React from 'react';
import { shallow } from 'enzyme';

jest.mock('@/components/product', () => ({
  ProductShowcaseGrid: () => <div className="mock-grid" />
}));

jest.mock('@/components/common/MessageDisplay', () => {
  const Mock = () => <div className="mock-msg" />;
  Mock.displayName = 'MessageDisplay';
  return Mock;
});

const ProductSection = require('@/components/common/ProductSection').default;

describe('ProductSection', () => {
  const defaultProps = {
    error: '',
    isLoading: false,
    products: [{ id: 1, name: 'Glasses' }],
    fetchProducts: jest.fn(),
    skeletonCount: 6
  };

  it('renders without crashing', () => {
    const wrapper = shallow(<ProductSection {...defaultProps} />);
    expect(wrapper.exists()).toBe(true);
  });

  it('renders ProductShowcaseGrid when no error', () => {
    const wrapper = shallow(<ProductSection {...defaultProps} />);
    expect(wrapper.find('ProductShowcaseGrid').exists()).toBe(true);
  });

  it('renders message display when error and not loading', () => {
    const wrapper = shallow(
      <ProductSection {...defaultProps} error="Something went wrong" />
    );
    expect(wrapper.find('.product-display-grid').children().length).toBeGreaterThan(0);
  });

  it('does not render ProductShowcaseGrid when error and not loading', () => {
    const wrapper = shallow(
      <ProductSection {...defaultProps} error="Something went wrong" />
    );
    expect(wrapper.find('ProductShowcaseGrid').exists()).toBe(false);
  });

  it('renders display div', () => {
    const wrapper = shallow(<ProductSection {...defaultProps} />);
    expect(wrapper.find('.display').exists()).toBe(true);
  });

  it('renders product-display-grid div', () => {
    const wrapper = shallow(<ProductSection {...defaultProps} />);
    expect(wrapper.find('.product-display-grid').exists()).toBe(true);
  });
});
