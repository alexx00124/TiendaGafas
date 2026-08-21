import React from 'react';
import { mount } from 'enzyme';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(() => mockDispatch)
}));

jest.mock('@/hooks', () => ({
  useDidMount: jest.fn(() => ({ current: true })),
  useDocumentTitle: jest.fn(),
  useScrollTop: jest.fn()
}));

jest.mock('@/redux/actions/authActions', () => ({
  resetPassword: jest.fn((email) => ({ type: 'RESET_PASSWORD', email }))
}));

import ForgotPassword from '@/views/auth/forgot_password';
import { useSelector } from 'react-redux';
import { resetPassword } from '@/redux/actions/authActions';

const appState = (overrides = {}) => ({
  app: { authStatus: null, isAuthenticating: false, ...overrides }
});

const render = (stateOverrides = {}) => {
  useSelector.mockImplementation((selector) => selector(appState(stateOverrides)));
  return mount(<ForgotPassword />);
};

const typeEmail = (wrapper, email) => {
  wrapper.find('input.input-form').simulate('change', { target: { value: email } });
};

describe('Forgot Password view', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders heading and instructions', () => {
    const wrapper = render();
    expect(wrapper.find('h2').text()).toBe('Forgot Your Password?');
    expect(wrapper.find('p').text()).toContain('password reset email');
  });

  it('dispatches resetPassword with the typed email on submit', () => {
    const wrapper = render();
    typeEmail(wrapper, 'user@test.com');
    wrapper.find('button.w-100-mobile').simulate('click');

    expect(resetPassword).toHaveBeenCalledWith('user@test.com');
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'RESET_PASSWORD', email: 'user@test.com' });
  });

  it('does not dispatch when the email field is empty', () => {
    const wrapper = render();
    wrapper.find('button.w-100-mobile').simulate('click');
    expect(resetPassword).not.toHaveBeenCalled();
  });

  it('shows the sending state while the request is in flight', () => {
    const wrapper = render({ isAuthenticating: true });
    const button = wrapper.find('button.w-100-mobile');
    expect(button.text()).toContain('Sending Password Reset Email');
    expect(button.prop('disabled')).toBe(true);
    expect(wrapper.find('input.input-form').prop('readOnly')).toBe(true);
  });

  it('shows a success message and locks the form after success', () => {
    const wrapper = render({
      authStatus: { success: true, message: 'Password reset email sent.' }
    });
    expect(wrapper.find('.toast-success').text()).toBe('Password reset email sent.');
    expect(wrapper.find('button.w-100-mobile').prop('disabled')).toBe(true);
  });

  it('shows an error message with error styling on failure', () => {
    const wrapper = render({
      authStatus: { success: false, message: 'No user found with that email.' }
    });
    expect(wrapper.find('.toast-error').text()).toBe('No user found with that email.');
    expect(wrapper.find('button.w-100-mobile').prop('disabled')).toBe(false);
  });
});
