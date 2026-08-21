import React from 'react';
import { shallow } from 'enzyme';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(() => jest.fn())
}));

jest.mock('react-router-dom', () => ({
  useHistory: jest.fn(() => ({ push: jest.fn() })),
  withRouter: (Component) => Component
}));

jest.mock('react-loading-skeleton', () => ({
  __esModule: true,
  default: () => <div className="mock-skeleton" />,
  SkeletonTheme: ({ children }) => <div>{children}</div>
}));

jest.mock('@/components/common', () => ({
  ImageLoader: () => <div className="mock-image" />
}));

import ProductsTable from '@/views/admin/components/ProductsTable';
import ProductItem from '@/views/admin/components/ProductItem';

describe('ProductsTable', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const wrapper = shallow(<ProductsTable filteredProducts={[]} />);
    expect(wrapper.exists()).toBe(true);
  });

  it('renders skeleton items when filteredProducts is empty', () => {
    const wrapper = shallow(<ProductsTable filteredProducts={[]} />);
    expect(wrapper.find(ProductItem)).toHaveLength(10);
  });

  it('renders product items when filteredProducts has items', () => {
    const products = [
      { id: '1', name: 'Shades', brand: 'Ray-Ban', price: 100 },
      { id: '2', name: 'Aviator', brand: 'Oakley', price: 200 }
    ];
    const wrapper = shallow(<ProductsTable filteredProducts={products} />);
    expect(wrapper.find(ProductItem)).toHaveLength(2);
  });

  it('renders table header when products exist', () => {
    const products = [{ id: '1', name: 'Shades' }];
    const wrapper = shallow(<ProductsTable filteredProducts={products} />);
    expect(wrapper.find('.grid-col')).toHaveLength(6);
  });
});
