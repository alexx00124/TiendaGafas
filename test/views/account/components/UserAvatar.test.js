import React from 'react';
import { shallow } from 'enzyme';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(() => jest.fn())
}));

jest.mock('react-router-dom', () => ({
  Link: ({ to, children }) => <a className="mock-link" href={to}>{children}</a>,
  withRouter: (Component) => Component
}));

jest.mock('@/redux/actions/authActions', () => ({
  signOut: jest.fn()
}));

import UserAvatar from '@/views/account/components/UserAvatar';
import { useSelector } from 'react-redux';

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
