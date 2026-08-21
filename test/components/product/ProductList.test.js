import React from 'react';
import { shallow } from 'enzyme';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn()
}));

jest.mock('@/redux/actions/miscActions', () => ({
  setLoading: jest.fn()
}));

jest.mock('@/redux/actions/productActions', () => ({
  getProducts: jest.fn()
}));

import ProductList from '@/components/product/ProductList';
import { useDispatch } from 'react-redux';

describe('ProductList', () => {
  let mockDispatch;

  const baseProps = {
    products: { items: [{ id: '1' }], total: 2, lastRefKey: 'abc' },
    filteredProducts: [{ id: '1' }],
    isLoading: false,
    requestStatus: null,
    children: <div className="child-content">Products</div>
  };

  beforeEach(() => {
    mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const wrapper = shallow(<ProductList {...baseProps} />);
    expect(wrapper.exists()).toBe(true);
  });

  it('renders MessageDisplay when filteredProducts is empty and not loading', () => {
    const wrapper = shallow(
      <ProductList {...baseProps} filteredProducts={[]} />
    );
    expect(wrapper.find('MessageDisplay').exists()).toBe(true);
    expect(wrapper.find('MessageDisplay').prop('message')).toBe('No products found.');
  });

  it('renders MessageDisplay with requestStatus message when filteredProducts empty and not loading', () => {
    const wrapper = shallow(
      <ProductList {...baseProps} filteredProducts={[]} requestStatus={{ message: 'Custom error' }} />
    );
    expect(wrapper.find('MessageDisplay').prop('message')).toBe('Custom error');
  });

  it('renders children when products exist', () => {
    const wrapper = shallow(<ProductList {...baseProps} />);
    expect(wrapper.find('.child-content').exists()).toBe(true);
  });

  it('renders Boundary wrapper', () => {
    const wrapper = shallow(<ProductList {...baseProps} />);
    expect(wrapper.find('Boundary').exists()).toBe(true);
  });

  it('renders Show More button when items < total', () => {
    const wrapper = shallow(<ProductList {...baseProps} />);
    expect(wrapper.find('.button-small').exists()).toBe(true);
    expect(wrapper.find('.button-small').text()).toBe('Show More Items');
  });

  it('does not render Show More button when items >= total', () => {
    const props = {
      ...baseProps,
      products: { items: [{ id: '1' }], total: 1, lastRefKey: null }
    };
    const wrapper = shallow(<ProductList {...props} />);
    expect(wrapper.find('.button-small').exists()).toBe(false);
  });
});
