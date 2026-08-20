import React from 'react';
import { shallow } from 'enzyme';
import UserOrdersTab from '@/views/account/components/UserOrdersTab';

describe('UserOrdersTab', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<UserOrdersTab />);
    expect(wrapper.exists()).toBe(true);
  });

  it('displays "My Orders" heading', () => {
    const wrapper = shallow(<UserOrdersTab />);
    expect(wrapper.find('h3').text()).toBe('My Orders');
  });

  it('displays no orders message', () => {
    const wrapper = shallow(<UserOrdersTab />);
    expect(wrapper.text()).toContain("You don't have any orders");
  });
});
