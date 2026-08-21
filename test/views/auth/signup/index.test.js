import React from 'react';
import { mount } from 'enzyme';

const mockDispatch = jest.fn();
const mockPush = jest.fn();

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(() => mockDispatch)
}));

jest.mock('@/components/common', () => ({
  AuthStatus: ({ children }) => <div>{children}</div>,
  SocialLogin: () => <div className="mock-social-login" />
}));

jest.mock('@/components/formik', () => ({
  CustomInput: () => <div className="mock-custom-input" />
}));

jest.mock('@/hooks', () => ({
  useDocumentTitle: jest.fn(),
  useScrollTop: jest.fn()
}));

jest.mock('@/redux/actions/authActions', () => ({
  signUp: jest.fn((user) => ({ type: 'SIGN_UP', user }))
}));

jest.mock('@/redux/actions/miscActions', () => ({
  setAuthStatus: jest.fn((payload) => ({ type: 'SET_AUTH_STATUS', payload })),
  setAuthenticating: jest.fn((payload) => ({ type: 'SET_AUTHENTICATING', payload }))
}));

import SignUp from '@/views/auth/signup';
import { Formik } from 'formik';
import { useSelector } from 'react-redux';
import { signUp } from '@/redux/actions/authActions';
import { SIGNIN } from '@/constants/routes';

const appState = (overrides = {}) => ({
  app: { authStatus: null, isAuthenticating: false, ...overrides }
});

const render = (stateOverrides = {}) => {
  useSelector.mockImplementation((selector) => selector(appState(stateOverrides)));
  return mount(<SignUp history={{ push: mockPush }} />);
};

describe('Sign Up view', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the sign up heading and social login', () => {
    const wrapper = render();
    expect(wrapper.find('h3').text()).toBe('Sign up to Salinaka');
    expect(wrapper.find('.mock-social-login').exists()).toBe(true);
  });

  it('dispatches signUp with trimmed and normalized fields on submit', () => {
    const wrapper = render();
    wrapper.find(Formik).prop('onSubmit')({
      fullname: '  John Doe  ',
      email: '  John@Test.COM ',
      password: '  secret123 '
    });

    expect(signUp).toHaveBeenCalledWith({
      fullname: 'John Doe',
      email: 'john@test.com',
      password: 'secret123'
    });
  });

  it('marks required fields as invalid in the validation schema', async () => {
    const wrapper = render();
    const schema = wrapper.find(Formik).prop('validationSchema');

    await expect(schema.validate({}, { abortEarly: false })).rejects.toMatchObject({
      errors: expect.arrayContaining([
        'Full name is required.',
        'Email is required.',
        'Password is required.'
      ])
    });
  });

  it('rejects short names, invalid emails and weak passwords', async () => {
    const wrapper = render();
    const schema = wrapper.find(Formik).prop('validationSchema');

    await expect(schema.isValid({
      fullname: 'Jo',
      email: 'bad-email',
      password: 'weakpass'
    })).resolves.toBe(false);

    await expect(schema.isValid({
      fullname: 'John Doe',
      email: 'john@test.com',
      password: 'Abcdefgh'
    })).resolves.toBe(true);
  });

  it('shows signing-up state while authenticating', () => {
    const wrapper = render({ isAuthenticating: true });
    expect(wrapper.find('.auth-button').text()).toContain('Signing Up');
    expect(wrapper.find('.auth-button').prop('disabled')).toBe(true);
  });

  it('navigates to sign in from the sign in button', () => {
    const wrapper = render();
    wrapper.find('.auth-message .button').simulate('click');
    expect(mockPush).toHaveBeenCalledWith(SIGNIN);
  });

  it('resets auth status flags on unmount', () => {
    const wrapper = render();
    wrapper.unmount();
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_AUTH_STATUS', payload: null });
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_AUTHENTICATING', payload: false });
  });
});
