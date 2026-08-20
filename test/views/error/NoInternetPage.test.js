import React from 'react';
import { shallow } from 'enzyme';
import NoInternetPage from '@/views/error/NoInternetPage';

jest.mock('@/hooks', () => ({
  useScrollTop: jest.fn()
}));

describe('NoInternetPage', () => {
  it('renders no internet message', () => {
    const wrapper = shallow(<NoInternetPage />);
    expect(wrapper.find('h1').text()).toContain('No Internet Connection');
  });

  it('renders a description paragraph', () => {
    const wrapper = shallow(<NoInternetPage />);
    expect(wrapper.find('p').text()).toContain('network connectivity');
  });

  it('renders a try again button', () => {
    const wrapper = shallow(<NoInternetPage />);
    expect(wrapper.find('.button').exists()).toBe(true);
    expect(wrapper.find('.button').text()).toBe('Try Again');
  });
});
