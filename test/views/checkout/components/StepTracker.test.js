import React from 'react';
import { shallow } from 'enzyme';
import StepTracker from '@/views/checkout/components/StepTracker';

describe('StepTracker', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<StepTracker current={1} />);
    expect(wrapper.exists()).toBe(true);
  });

  it('renders three steps', () => {
    const wrapper = shallow(<StepTracker current={1} />);
    expect(wrapper.find('.checkout-header-list')).toHaveLength(3);
  });

  it('applies is-active-step to current step', () => {
    const wrapper = shallow(<StepTracker current={2} />);
    const items = wrapper.find('.checkout-header-list');
    expect(items.at(1).hasClass('is-active-step')).toBe(true);
  });

  it('applies is-done-step to completed steps', () => {
    const wrapper = shallow(<StepTracker current={3} />);
    const items = wrapper.find('.checkout-header-list');
    expect(items.at(0).hasClass('is-done-step')).toBe(true);
    expect(items.at(1).hasClass('is-done-step')).toBe(true);
  });

  it('shows step subtitles', () => {
    const wrapper = shallow(<StepTracker current={1} />);
    expect(wrapper.find('.checkout-header-subtitle').at(0).text()).toBe('Order Summary');
    expect(wrapper.find('.checkout-header-subtitle').at(1).text()).toBe('Shipping Details');
    expect(wrapper.find('.checkout-header-subtitle').at(2).text()).toBe('Payment');
  });
});
