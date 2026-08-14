import { ArrowRightOutlined, LoadingOutlined } from '@ant-design/icons';
import { AuthStatus, SocialLogin } from '@/components/common';
import { CustomInput } from '@/components/formik';
import { FORGOT_PASSWORD, SIGNUP } from '@/constants/routes';
import { Field, Form, Formik } from 'formik';
import { useDocumentTitle, useScrollTop } from '@/hooks';
import { historyShape } from '@/helpers/propTypes';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { signIn } from '@/redux/actions/authActions';
import { setAuthenticating, setAuthStatus } from '@/redux/actions/miscActions';
import * as Yup from 'yup';

const SignInSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email is not valid.')
    .required('Email is required.'),
  password: Yup.string()
    .required('Password is required.')
});

const SignIn = ({ history }) => {
  const { authStatus, isAuthenticating } = useSelector((state) => ({
    authStatus: state.app.authStatus,
    isAuthenticating: state.app.isAuthenticating
  }));

  const dispatch = useDispatch();

  useScrollTop();
  useDocumentTitle('Sign In | Salinaka');

  useEffect(() => () => {
    dispatch(setAuthStatus(null));
    dispatch(setAuthenticating(false));
  }, [dispatch]);

  const onSignUp = () => history.push(SIGNUP);

  const onSubmitForm = (form) => {
    dispatch(signIn(form.email, form.password));
  };

  const onClickLink = (e) => {
    if (isAuthenticating) e.preventDefault();
  };

  return (
    <AuthStatus authStatus={authStatus}>
      <div className="auth-main">
        <h3>Sign in to Salinaka</h3>
        <br />
        <div className="auth-wrapper">
          <Formik
            initialValues={{
              email: '',
              password: ''
            }}
            validateOnChange
            validationSchema={SignInSchema}
            onSubmit={onSubmitForm}
          >
            {() => (
              <Form>
                <div className="auth-field">
                  <Field
                    disabled={isAuthenticating}
                    name="email"
                    type="email"
                    label="Email"
                    placeholder="test@example.com"
                    component={CustomInput}
                  />
                </div>
                <div className="auth-field">
                  <Field
                    disabled={isAuthenticating}
                    name="password"
                    type="password"
                    label="Password"
                    placeholder="Your Password"
                    component={CustomInput}
                  />
                </div>
                <br />
                <div className="auth-field auth-action">
                  <Link
                    onClick={onClickLink}
                    style={{ textDecoration: 'underline' }}
                    to={FORGOT_PASSWORD}
                  >
                    <span>Forgot password?</span>
                  </Link>
                  <button
                    className="button auth-button"
                    disabled={isAuthenticating}
                    type="submit"
                  >
                    {isAuthenticating ? 'Signing In' : 'Sign In'}
                    &nbsp;
                    {isAuthenticating ? <LoadingOutlined /> : <ArrowRightOutlined />}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <div className="auth-divider">
        <h6>OR</h6>
      </div>
      <SocialLogin isLoading={isAuthenticating} />
      <div className="auth-message">
        <span className="auth-info">
          <strong>Don&apos;t have an account?</strong>
        </span>
        <button
          className="button button-small button-border button-border-gray button-icon"
          disabled={isAuthenticating}
          onClick={onSignUp}
          type="button"
        >
          Sign Up
        </button>
      </div>
    </AuthStatus>
  );
};

SignIn.propTypes = {
  history: historyShape.isRequired
};

export default SignIn;
