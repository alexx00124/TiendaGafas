import React from 'react';
import { mount } from 'enzyme';

jest.mock('react-redux', () => ({
  useSelector: jest.fn()
}));

jest.mock('react-router-dom', () => ({
  withRouter: (Component) => Component
}));

jest.mock('@/components/common', () => ({
  ImageLoader: ({ src, className }) => <img className={className} src={src} alt="mock" />
}));

import UserAccountTab from '@/views/account/components/UserAccountTab';
import { useSelector } from 'react-redux';
import { displayDate } from '@/helpers/utils';
import { ACCOUNT_EDIT } from '@/constants/routes';

const profileFixture = {
  fullname: 'Jane Doe',
  email: 'jane@test.com',
  address: 'Fake Street 123',
  avatar: 'avatar.jpg',
  banner: 'banner.jpg',
  mobile: { value: '+54 9 11 5555' },
  dateJoined: '2020-01-01T00:00:00.000Z'
};

const render = (profile = profileFixture) => {
  useSelector.mockImplementation((selector) => selector({ profile }));
  const push = jest.fn();
  const wrapper = mount(<UserAccountTab history={{ push }} />);
  return { wrapper, push };
};

describe('UserAccountTab', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders banner and avatar images from profile', () => {
    const { wrapper } = render();
    expect(wrapper.find('img.user-profile-banner-img').prop('src')).toBe('banner.jpg');
    expect(wrapper.find('img.user-profile-img').prop('src')).toBe('avatar.jpg');
  });

  it('shows the full profile details', () => {
    const { wrapper } = render();
    expect(wrapper.find('.user-profile-name').text()).toBe('Jane Doe');
    expect(wrapper.text()).toContain('jane@test.com');
    expect(wrapper.text()).toContain('Fake Street 123');
    expect(wrapper.text()).toContain('+54 9 11 5555');
    expect(wrapper.text()).toContain(displayDate(profileFixture.dateJoined));
  });

  it('renders empty strings for missing optional fields', () => {
    const { wrapper } = render({
      fullname: 'Jane Doe',
      email: 'jane@test.com'
    });
    expect(wrapper.text()).not.toContain('undefined');
    expect(wrapper.text()).not.toContain('null');
  });

  it('navigates to edit account on button click', () => {
    const { wrapper, push } = render();
    wrapper.find('.user-profile-edit').simulate('click');
    expect(push).toHaveBeenCalledWith(ACCOUNT_EDIT);
  });
});
