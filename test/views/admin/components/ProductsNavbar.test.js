import React from 'react';
import { shallow } from 'enzyme';

jest.mock('react-router-dom', () => ({
  useHistory: jest.fn(() => ({ push: jest.fn() }))
}));

jest.mock('@/components/common', () => ({
  SearchBar: () => <div className="mock-searchbar" />,
  FiltersToggle: ({ children }) => <div className="mock-filters-toggle">{children}</div>
}));

import ProductsNavbar from '@/views/admin/components/ProductsNavbar';

describe('ProductsNavbar', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const wrapper = shallow(<ProductsNavbar productsCount={5} totalProductsCount={20} />);
    expect(wrapper.exists()).toBe(true);
  });

  it('displays product count', () => {
    const wrapper = shallow(<ProductsNavbar productsCount={5} totalProductsCount={20} />);
    expect(wrapper.text()).toContain('5 / 20');
  });

  it('renders SearchBar', () => {
    const wrapper = shallow(<ProductsNavbar productsCount={5} totalProductsCount={20} />);
    expect(wrapper.find('SearchBar').exists()).toBe(true);
  });

  it('renders Add New Product button', () => {
    const wrapper = shallow(<ProductsNavbar productsCount={5} totalProductsCount={20} />);
    expect(wrapper.find('.button').last().text()).toContain('Add New Product');
  });
});
