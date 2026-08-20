import React from 'react';
import { shallow } from 'enzyme';

jest.mock('@/hooks', () => ({
  useDocumentTitle: jest.fn(),
  useScrollTop: jest.fn()
}));

jest.mock('react-redux', () => ({
  useSelector: jest.fn()
}));

jest.mock('@/selectors/selector', () => ({
  selectFilter: jest.fn(() => [{ id: '1', name: 'Test Product' }])
}));

import Shop from '@/views/shop/index';
import { useSelector } from 'react-redux';

describe('Shop', () => {
  beforeEach(() => {
    useSelector.mockReturnValue({
      filteredProducts: [{ id: '1', name: 'Test Product' }],
      products: { items: [{ id: '1' }], total: 1, lastRefKey: null },
      requestStatus: null,
      isLoading: false
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const wrapper = shallow(<Shop />);
    expect(wrapper.exists()).toBe(true);
  });

  it('renders product-list-wrapper section', () => {
    const wrapper = shallow(<Shop />);
    expect(wrapper.find('section.product-list-wrapper').exists()).toBe(true);
  });

  it('renders ProductList component', () => {
    const wrapper = shallow(<Shop />);
    expect(wrapper.find('ProductList').exists()).toBe(true);
  });

  it('renders ProductGrid as child of ProductList', () => {
    const wrapper = shallow(<Shop />);
    const productList = wrapper.find('ProductList');
    expect(productList.children().find('ProductGrid').exists()).toBe(true);
  });

  it('passes store props to ProductList', () => {
    const wrapper = shallow(<Shop />);
    const productList = wrapper.find('ProductList');
    expect(productList.prop('isLoading')).toBe(false);
    expect(productList.prop('requestStatus')).toBeNull();
  });
});
