import React from 'react';
import { shallow } from 'enzyme';
import UserTab from '@/views/account/components/UserTab';

describe('UserTab', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(
      <UserTab>
        <div index={0} label="Profile">Profile Content</div>
        <div index={1} label="Settings">Settings Content</div>
      </UserTab>
    );
    expect(wrapper.exists()).toBe(true);
  });

  it('renders tab labels', () => {
    const wrapper = shallow(
      <UserTab>
        <div index={0} label="Profile">Profile Content</div>
        <div index={1} label="Settings">Settings Content</div>
      </UserTab>
    );
    expect(wrapper.find('.user-tab-item')).toHaveLength(2);
    expect(wrapper.find('.user-tab-item').at(0).text()).toBe('Profile');
    expect(wrapper.find('.user-tab-item').at(1).text()).toBe('Settings');
  });

  it('activates first tab by default', () => {
    const wrapper = shallow(
      <UserTab>
        <div index={0} label="Profile">Profile Content</div>
        <div index={1} label="Settings">Settings Content</div>
      </UserTab>
    );
    expect(wrapper.find('.user-tab-item').at(0).hasClass('user-tab-active')).toBe(true);
  });

  it('switches active tab on click', () => {
    const wrapper = shallow(
      <UserTab>
        <div index={0} label="Profile">Profile Content</div>
        <div index={1} label="Settings">Settings Content</div>
      </UserTab>
    );
    wrapper.find('.user-tab-item').at(1).simulate('click');
    expect(wrapper.find('.user-tab-item').at(1).hasClass('user-tab-active')).toBe(true);
  });
});
