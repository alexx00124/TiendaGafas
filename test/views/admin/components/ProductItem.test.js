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
  default: ({ width }) => <div className="mock-skeleton" style={{ width }} />,
  SkeletonTheme: ({ children }) => <div className="skeleton-theme">{children}</div>
}));

jest.mock('@/components/common', () => ({
  ImageLoader: (props) => <img className="mock-image" alt={props.alt} src={props.src} />
}));

jest.mock('@/helpers/utils', () => ({
  displayActionMessage: jest.fn(),
  displayDate: jest.fn((d) => d),
  displayMoney: jest.fn((p) => `$${p}`)
}));

import ProductItem from '@/views/admin/components/ProductItem';

describe('ProductItem', () => {
  const fullProduct = {
    id: '1',
    name: 'Shades',
    brand: 'Ray-Ban',
    price: 100,
    image: 'shades.jpg',
    dateAdded: 1609459200000,
    maxQuantity: 10
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const wrapper = shallow(<ProductItem product={fullProduct} />);
    expect(wrapper.exists()).toBe(true);
  });

  it('shows product name', () => {
    const wrapper = shallow(<ProductItem product={fullProduct} />);
    expect(wrapper.find('span').filterWhere(
      (s) => s.text() === 'Shades'
    ).exists()).toBe(true);
  });

  it('shows product brand', () => {
    const wrapper = shallow(<ProductItem product={fullProduct} />);
    expect(wrapper.find('span').filterWhere(
      (s) => s.text() === 'Ray-Ban'
    ).exists()).toBe(true);
  });

  it('shows product price', () => {
    const wrapper = shallow(<ProductItem product={fullProduct} />);
    expect(wrapper.find('span').filterWhere(
      (s) => s.text() === '$100'
    ).exists()).toBe(true);
  });

  it('shows product quantity', () => {
    const wrapper = shallow(<ProductItem product={fullProduct} />);
    expect(wrapper.find('span').filterWhere(
      (s) => s.text() === '10'
    ).exists()).toBe(true);
  });

  it('renders skeleton when product has no id (loading)', () => {
    const skeletonProduct = { name: '', brand: '', price: 0 };
    const wrapper = shallow(<ProductItem product={skeletonProduct} />);
    expect(wrapper.find('.item-loading').exists()).toBe(true);
  });

  it('shows action buttons when product has id', () => {
    const wrapper = shallow(<ProductItem product={fullProduct} />);
    expect(wrapper.find('.item-action').exists()).toBe(true);
    expect(wrapper.find('.item-action button')).toHaveLength(4);
  });

  it('shows edit button with correct text', () => {
    const wrapper = shallow(<ProductItem product={fullProduct} />);
    const editBtn = wrapper.find('.item-action button').filterWhere(
      (b) => b.text() === 'Edit'
    );
    expect(editBtn.exists()).toBe(true);
  });

  it('shows delete button with correct text', () => {
    const wrapper = shallow(<ProductItem product={fullProduct} />);
    const deleteBtn = wrapper.find('.item-action .button-danger').filterWhere(
      (b) => b.text() === 'Delete'
    );
    expect(deleteBtn.exists()).toBe(true);
  });

  it('does not show action buttons when product has no id', () => {
    const skeletonProduct = { name: '', brand: '', price: 0 };
    const wrapper = shallow(<ProductItem product={skeletonProduct} />);
    expect(wrapper.find('.item-action').exists()).toBe(false);
  });
});
