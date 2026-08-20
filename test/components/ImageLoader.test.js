import React from 'react';
import { shallow } from 'enzyme';
import { LoadingOutlined } from '@ant-design/icons';
import ImageLoader from '@/components/common/ImageLoader';

describe('ImageLoader', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<ImageLoader src="test.png" />);
    expect(wrapper.exists()).toBe(true);
  });

  it('shows LoadingOutlined when not loaded', () => {
    const wrapper = shallow(<ImageLoader src="test.png" />);
    expect(wrapper.find(LoadingOutlined).exists()).toBe(true);
  });

  it('hides LoadingOutlined after onLoad', () => {
    const wrapper = shallow(<ImageLoader src="test.png" />);
    expect(wrapper.find(LoadingOutlined).exists()).toBe(true);
    wrapper.find('img').simulate('load');
    expect(wrapper.find(LoadingOutlined).exists()).toBe(false);
  });

  it('applies is-img-loading class before load', () => {
    const wrapper = shallow(<ImageLoader src="test.png" />);
    expect(wrapper.find('img').hasClass('is-img-loading')).toBe(true);
  });

  it('applies is-img-loaded class after onLoad', () => {
    const wrapper = shallow(<ImageLoader src="test.png" />);
    wrapper.find('img').simulate('load');
    expect(wrapper.find('img').hasClass('is-img-loaded')).toBe(true);
  });

  it('applies custom className', () => {
    const wrapper = shallow(<ImageLoader src="test.png" className="my-img" />);
    expect(wrapper.find('img').hasClass('my-img')).toBe(true);
  });

  it('passes alt attribute to img', () => {
    const wrapper = shallow(<ImageLoader src="test.png" alt="Product" />);
    expect(wrapper.find('img').prop('alt')).toBe('Product');
  });

  it('passes src to img', () => {
    const wrapper = shallow(<ImageLoader src="photo.jpg" />);
    expect(wrapper.find('img').prop('src')).toBe('photo.jpg');
  });
});
