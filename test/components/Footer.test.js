import React from 'react';
import { shallow } from 'enzyme';

jest.mock('@/images/logo-full.png', () => '');

jest.mock('react-router-dom', () => ({
  useLocation: jest.fn()
}));

import { useLocation } from 'react-router-dom';
import Footer from '@/components/common/Footer';

describe('Footer', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders on home page', () => {
    useLocation.mockReturnValue({ pathname: '/' });
    const wrapper = shallow(<Footer />);
    expect(wrapper.find('.footer').exists()).toBe(true);
  });

  it('renders on shop page', () => {
    useLocation.mockReturnValue({ pathname: '/shop' });
    const wrapper = shallow(<Footer />);
    expect(wrapper.find('.footer').exists()).toBe(true);
  });

  it('returns null on other pages', () => {
    useLocation.mockReturnValue({ pathname: '/signin' });
    const wrapper = shallow(<Footer />);
    expect(wrapper.isEmptyRender()).toBe(true);
  });

  it('returns null on account page', () => {
    useLocation.mockReturnValue({ pathname: '/account' });
    const wrapper = shallow(<Footer />);
    expect(wrapper.isEmptyRender()).toBe(true);
  });

  it('renders the footer logo image', () => {
    useLocation.mockReturnValue({ pathname: '/' });
    const wrapper = shallow(<Footer />);
    expect(wrapper.find('.footer-logo').exists()).toBe(true);
  });

  it('renders current year copyright', () => {
    useLocation.mockReturnValue({ pathname: '/' });
    const wrapper = shallow(<Footer />);
    expect(wrapper.text()).toContain(String(new Date().getFullYear()));
  });

  it('renders the developer link', () => {
    useLocation.mockReturnValue({ pathname: '/' });
    const wrapper = shallow(<Footer />);
    expect(wrapper.find('a').at(0).prop('href')).toBe('https://github.com/jgudo');
  });
});
