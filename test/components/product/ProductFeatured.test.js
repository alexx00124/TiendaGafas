import React from 'react';
import { shallow } from 'enzyme';
import ProductFeatured from '@/components/product/ProductFeatured';
import * as reactRouter from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  useHistory: jest.fn(),
  withRouter: (C) => C
}));

jest.mock('@/components/common', () => ({
  ImageLoader: (props) => <img {...props} />
}));

const mockHistory = { push: jest.fn() };
reactRouter.useHistory.mockReturnValue(mockHistory);

const product = {
  id: '1',
  name: 'Glasses',
  brand: 'Ray-Ban',
  image: 'img.jpg'
};

describe('ProductFeatured', () => {
  beforeEach(() => {
    mockHistory.push.mockClear();
  });

  it('renders product name and brand', () => {
    const wrapper = shallow(<ProductFeatured product={product} />);
    expect(wrapper.find('h2').text()).toBe('Glasses');
    expect(wrapper.find('.text-subtle').text()).toBe('Ray-Ban');
  });

  it('calls history.push on click', () => {
    const wrapper = shallow(<ProductFeatured product={product} />);
    wrapper.find('.product-display').simulate('click');
    expect(mockHistory.push).toHaveBeenCalledWith('/product/1');
  });

  it('renders skeleton when no product image', () => {
    const noImageProduct = { ...product, image: undefined };
    const wrapper = shallow(<ProductFeatured product={noImageProduct} />);
    expect(wrapper.find('Skeleton').exists()).toBe(true);
  });

  it('renders skeleton when no product name', () => {
    const noNameProduct = { ...product, name: undefined };
    const wrapper = shallow(<ProductFeatured product={noNameProduct} />);
    expect(wrapper.find('Skeleton').exists()).toBe(true);
  });
});
