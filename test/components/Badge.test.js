import React from 'react';
import { shallow } from 'enzyme';
import Badge from '@/components/common/Badge';

describe('Badge', () => {
  it('renders children', () => {
    const wrapper = shallow(
      <Badge count={0}>
        <span className="child">Cart</span>
      </Badge>
    );
    expect(wrapper.find('.child').text()).toBe('Cart');
  });

  it('renders badge-count when count >= 1', () => {
    const wrapper = shallow(
      <Badge count={3}>
        <span>Cart</span>
      </Badge>
    );
    expect(wrapper.find('.badge-count').exists()).toBe(true);
    expect(wrapper.find('.badge-count').text()).toBe('3');
  });

  it('does not render badge-count when count is 0', () => {
    const wrapper = shallow(
      <Badge count={0}>
        <span>Cart</span>
      </Badge>
    );
    expect(wrapper.find('.badge-count').exists()).toBe(false);
  });

  it('does not render badge-count when count is negative', () => {
    const wrapper = shallow(
      <Badge count={-5}>
        <span>Cart</span>
      </Badge>
    );
    expect(wrapper.find('.badge-count').exists()).toBe(false);
  });

  it('renders the badge wrapper div', () => {
    const wrapper = shallow(
      <Badge count={1}>
        <span>Item</span>
      </Badge>
    );
    expect(wrapper.find('.badge').exists()).toBe(true);
  });
});
