import React from 'react';
import { mount } from 'enzyme';

const mockDispatch = jest.fn();
const mockPush = jest.fn();

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(() => mockDispatch)
}));

jest.mock('react-router-dom', () => ({
  Link: ({ children, onClick }) => <a className="mock-link" onClick={onClick}>{children}</a>
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
  signIn: jest.fn((email, password) => ({ type: 'SIGN_IN', email, password }))
}));

jest.mock('@/redux/actions/miscActions', () => ({
  setAuthStatus: jest.fn((payload) => ({ type: 'SET_AUTH_STATUS', payload })),
  setAuthenticating: jest.fn((payload) => ({ type: 'SET_AUTHENTICATING', payload }))
}));

import SignIn from '@/views/auth/signin';
import { Formik } from 'formik';
import { useSelector } from 'react-redux';
import { signIn } from '@/redux/actions/authActions';
import { setAuthStatus, setAuthenticating } from '@/redux/actions/miscActions';
import { SIGNUP } from '@/constants/routes';

const appState = (overrides = {}) => ({
  app: { authStatus: null, isAuthenticating: false, ...overrides }
});

const render = (stateOverrides = {}) => {
  useSelector.mockImplementation((selector) => selector(appState(stateOverrides)));
  return mount(<SignIn history={{ push: mockPush }} />);
};

describe('Sign In view', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the sign in heading and social login', () => {
    const wrapper = render();
    expect(wrapper.find('h3').text()).toBe('Sign in to Salinaka');
    expect(wrapper.find('.mock-social-login').exists()).toBe(true);
  });

  it('dispatches signIn with typed credentials on submit', () => {
    const wrapper = render();
    wrapper.find(Formik).prop('onSubmit')({ email: 'user@test.com', password: 'secret123' });

    expect(signIn).toHaveBeenCalledWith('user@test.com', 'secret123');
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SIGN_IN',
      email: 'user@test.com',
      password: 'secret123'
    });
  });

  it('requires email and password through the validation schema', async () => {
    const wrapper = render();
    const schema = wrapper.find(Formik).prop('validationSchema');

    await expect(schema.validate({}, { abortEarly: false })).rejects.toMatchObject({
      errors: expect.arrayContaining(['Email is required.', 'Password is required.'])
    });
    await expect(schema.isValid({
      email: 'user@test.com',
      password: 'secret123'
    })).resolves.toBe(true);
  });

  it('marks invalid email in the schema as not valid', async () => {
    const wrapper = render();
    const schema = wrapper.find(Formik).prop('validationSchema');

    await expect(schema.isValid({ email: 'not-an-email', password: 'x' })).resolves.toBe(false);
  });

  it('shows signing-in state while authenticating', () => {
    const wrapper = render({ isAuthenticating: true });
    expect(wrapper.find('.auth-button').text()).toContain('Signing In');
    expect(wrapper.find('.auth-button').prop('disabled')).toBe(true);
  });

  it('blocks the forgot-password link while authenticating', () => {
    const preventDefault = jest.fn();
    const wrapper = render({ isAuthenticating: true });
    wrapper.find('.mock-link').simulate('click', { preventDefault });
    expect(preventDefault).toHaveBeenCalled();
  });

  it('allows the forgot-password link when idle', () => {
    const preventDefault = jest.fn();
    const wrapper = render();
    wrapper.find('.mock-link').simulate('click', { preventDefault });
    expect(preventDefault).not.toHaveBeenCalled();
  });

  it('navigates to sign up from the sign up button', () => {
    const wrapper = render();
    wrapper.find('.auth-message .button').simulate('click');
    expect(mockPush).toHaveBeenCalledWith(SIGNUP);
  });

  it('resets auth status flags on unmount', () => {
    const wrapper = render();
    wrapper.unmount();
    expect(setAuthStatus).toHaveBeenCalledWith(null);
    expect(setAuthenticating).toHaveBeenCalledWith(false);
  });
});
