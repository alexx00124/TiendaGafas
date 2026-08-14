import React from 'react';
import { shallow } from 'enzyme';
import SliderTooltip from '@/components/common/SliderTooltip';

describe('SliderTooltip', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<SliderTooltip percent={50} value={100} />);
    expect(wrapper.exists()).toBe(true);
  });

  it('renders tooltip div with correct percent', () => {
    const wrapper = shallow(<SliderTooltip percent={25} value={50} />);
    const tooltipDiv = wrapper.find('div').first();
    expect(tooltipDiv.prop('style')).toEqual(
      expect.objectContaining({ left: '25%' })
    );
  });

  it('displays the value text', () => {
    const wrapper = shallow(<SliderTooltip percent={75} value={200} />);
    const span = wrapper.find('.tooltiptext');
    expect(span.text()).toContain('200');
  });

  it('renders the tooltip className', () => {
    const wrapper = shallow(<SliderTooltip percent={0} value={0} />);
    expect(wrapper.find('.tooltip').exists()).toBe(true);
  });
});
