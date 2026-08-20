import React from 'react';
import { shallow } from 'enzyme';
import Preloader from '@/components/common/Preloader';

describe('Preloader', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<Preloader />);
    expect(wrapper.exists()).toBe(true);
  });

  it('renders the preloader div', () => {
    const wrapper = shallow(<Preloader />);
    expect(wrapper.find('.preloader').exists()).toBe(true);
  });

  it('renders the SVG logo symbol', () => {
    const wrapper = shallow(<Preloader />);
    expect(wrapper.find('svg').exists()).toBe(true);
    expect(wrapper.find('svg').hasClass('logo-symbol')).toBe(true);
  });

  it('renders the logo wordmark image', () => {
    const wrapper = shallow(<Preloader />);
    const img = wrapper.find('img');
    expect(img.exists()).toBe(true);
    expect(img.prop('alt')).toBe('Salinaka logo wordmark');
  });

  it('renders two circles in the SVG', () => {
    const wrapper = shallow(<Preloader />);
    expect(wrapper.find('svg circle').length).toBe(2);
  });
});
