import React from 'react';
import { shallow } from 'enzyme';
import SuspenseLoader from '@/components/common/SuspenseLoader';

describe('SuspenseLoader', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<SuspenseLoader />);
    expect(wrapper.exists()).toBe(true);
  });

  it('renders a loader div', () => {
    const wrapper = shallow(<SuspenseLoader />);
    expect(wrapper.find('.loader').exists()).toBe(true);
  });

  it('displays loading text', () => {
    const wrapper = shallow(<SuspenseLoader />);
    expect(wrapper.find('h6').text()).toBe('Loading ... ');
  });

  it('renders an icon element', () => {
    const wrapper = shallow(<SuspenseLoader />);
    const h6 = wrapper.find('h6');
    expect(h6.length).toBe(1);
  });

  it('has minHeight style', () => {
    const wrapper = shallow(<SuspenseLoader />);
    const loaderDiv = wrapper.find('.loader');
    expect(loaderDiv.prop('style')).toEqual({ minHeight: '80vh' });
  });
});
