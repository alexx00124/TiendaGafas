import React from 'react';
import { shallow } from 'enzyme';
import UserWishListTab from '@/views/account/components/UserWishListTab';

describe('UserWishListTab', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<UserWishListTab />);
    expect(wrapper.exists()).toBe(true);
  });

  it('displays "My Wish List" heading', () => {
    const wrapper = shallow(<UserWishListTab />);
    expect(wrapper.find('h3').text()).toBe('My Wish List');
  });

  it('displays no wish list message', () => {
    const wrapper = shallow(<UserWishListTab />);
    expect(wrapper.text()).toContain("You don't have a wish list");
  });
});
