import React from 'react';
import { mount, shallow } from 'enzyme';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(() => jest.fn())
}));

jest.mock('react-router-dom', () => ({
  Link: ({ to, children }) => <a className="mock-link" href={to}>{children}</a>,
  withRouter: (Component) => Component
}));

jest.mock('@/redux/actions/authActions', () => ({
  signOut: jest.fn(() => ({ type: 'SIGN_OUT' }))
}));

import UserAvatar from '@/views/account/components/UserAvatar';
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from '@/redux/actions/authActions';

describe('UserAvatar', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    useSelector.mockReturnValue({
      profile: { fullname: 'John Doe', avatar: 'avatar.jpg', role: 'USER' },
      isAuthenticating: false
    });
    const wrapper = shallow(<UserAvatar />);
    expect(wrapper.exists()).toBe(true);
  });

  it('shows user first name', () => {
    useSelector.mockReturnValue({
      profile: { fullname: 'John Doe', avatar: 'avatar.jpg', role: 'USER' },
      isAuthenticating: false
    });
    const wrapper = shallow(<UserAvatar />);
    expect(wrapper.find('.text-overflow-ellipsis').text()).toBe('John');
  });

  it('shows default avatar when no avatar is provided', () => {
    useSelector.mockReturnValue({
      profile: { fullname: 'Jane Doe', avatar: '', role: 'USER' },
      isAuthenticating: false
    });
    const wrapper = shallow(<UserAvatar />);
    const img = wrapper.find('.user-nav-img');
    expect(img.prop('src')).toBe('');
  });

  it('shows Signing Out when isAuthenticating', () => {
    useSelector.mockReturnValue({
      profile: { fullname: 'John', avatar: 'a.jpg', role: 'USER' },
      isAuthenticating: true
    });
    const wrapper = shallow(<UserAvatar />);
    expect(wrapper.find('.user-nav').text()).toContain('Signing Out');
  });

  it('renders View Account link for non-admin users', () => {
    useSelector.mockReturnValue({
      profile: { fullname: 'John', avatar: 'a.jpg', role: 'USER' },
      isAuthenticating: false
    });
    const wrapper = shallow(<UserAvatar />);
    const link = wrapper.find('Link');
    expect(link.exists()).toBe(true);
    expect(link.render().text()).toContain('View Account');
  });

  it('hides View Account for admin users', () => {
    useSelector.mockReturnValue({
      profile: { fullname: 'Admin', avatar: 'a.jpg', role: 'ADMIN' },
      isAuthenticating: false
    });
    const wrapper = shallow(<UserAvatar />);
    expect(wrapper.find('Link').exists()).toBe(false);
  });
});

describe('UserAvatar interactions', () => {
  const navState = (overrides = {}) => ({
    profile: { fullname: 'John Doe', avatar: 'a.jpg', role: 'USER' },
    app: { isAuthenticating: false },
    ...overrides
  });

  afterEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
  });

  it('toggles the dropdown open state on nav click', () => {
    useSelector.mockImplementation((selector) => selector(navState()));
    const wrapper = mount(<UserAvatar />);
    const nav = wrapper.find('.user-nav');

    nav.simulate('click');
    expect(nav.getDOMNode().classList.contains('user-sub-open')).toBe(true);

    nav.simulate('click');
    expect(nav.getDOMNode().classList.contains('user-sub-open')).toBe(false);
    wrapper.unmount();
  });

  it('closes the dropdown when clicking on an element outside of it', () => {
    useSelector.mockImplementation((selector) => selector(navState()));
    const wrapper = mount(<UserAvatar />);
    const navNode = wrapper.find('.user-nav').getDOMNode();

    // Open the dropdown through the component's own handler
    wrapper.find('.user-nav').simulate('click');
    expect(navNode.classList.contains('user-sub-open')).toBe(true);

    // A click on an outside element must close it
    const outside = document.createElement('div');
    document.body.appendChild(outside);
    outside.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(navNode.classList.contains('user-sub-open')).toBe(false);
    wrapper.unmount();
  });

  it('dispatches signOut when Sign Out is clicked', () => {
    const dispatchSpy = jest.fn();
    useDispatch.mockReturnValue(dispatchSpy);
    useSelector.mockImplementation((selector) => selector(navState()));
    const wrapper = mount(<UserAvatar />);

    wrapper.find('.user-nav-sub h6').simulate('click');
    expect(signOut).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({ type: 'SIGN_OUT' }));
    wrapper.unmount();
  });
});
