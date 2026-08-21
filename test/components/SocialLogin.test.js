import React from 'react';
import { shallow } from 'enzyme';
import { signInWithGoogle, signInWithFacebook, signInWithGithub } from '@/redux/actions/authActions';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn()
}));

import { useDispatch } from 'react-redux';
import SocialLogin from '@/components/common/SocialLogin';

describe('SocialLogin', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const wrapper = shallow(<SocialLogin isLoading={false} />);
    expect(wrapper.exists()).toBe(true);
  });

  it('renders three login buttons', () => {
    const wrapper = shallow(<SocialLogin isLoading={false} />);
    expect(wrapper.find('button').length).toBe(3);
  });

  it('renders Facebook, Google, and GitHub buttons', () => {
    const wrapper = shallow(<SocialLogin isLoading={false} />);
    expect(wrapper.find('.provider-facebook').exists()).toBe(true);
    expect(wrapper.find('.provider-google').exists()).toBe(true);
    expect(wrapper.find('.provider-github').exists()).toBe(true);
  });

  it('dispatches signInWithGoogle when Google button is clicked', () => {
    const wrapper = shallow(<SocialLogin isLoading={false} />);
    wrapper.find('.provider-google').simulate('click');
    expect(mockDispatch).toHaveBeenCalledWith(signInWithGoogle());
  });

  it('dispatches signInWithFacebook when Facebook button is clicked', () => {
    const wrapper = shallow(<SocialLogin isLoading={false} />);
    wrapper.find('.provider-facebook').simulate('click');
    expect(mockDispatch).toHaveBeenCalledWith(signInWithFacebook());
  });

  it('dispatches signInWithGithub when GitHub button is clicked', () => {
    const wrapper = shallow(<SocialLogin isLoading={false} />);
    wrapper.find('.provider-github').simulate('click');
    expect(mockDispatch).toHaveBeenCalledWith(signInWithGithub());
  });

  it('disables buttons when isLoading is true', () => {
    const wrapper = shallow(<SocialLogin isLoading={true} />);
    wrapper.find('button').forEach((button) => {
      expect(button.prop('disabled')).toBe(true);
    });
  });

  it('enables buttons when isLoading is false', () => {
    const wrapper = shallow(<SocialLogin isLoading={false} />);
    wrapper.find('button').forEach((button) => {
      expect(button.prop('disabled')).toBe(false);
    });
  });
});
