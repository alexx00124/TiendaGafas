import { ArrowRightOutlined, LoadingOutlined } from '@ant-design/icons';
import { AuthStatus, SocialLogin } from '@/components/common';
import { CustomInput } from '@/components/formik';
import { SIGNIN } from '@/constants/routes';
import { Field, Form, Formik } from 'formik';
import { useDocumentTitle, useScrollTop } from '@/hooks';
import { historyShape } from '@/helpers/propTypes';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signUp } from '@/redux/actions/authActions';
import { setAuthenticating, setAuthStatus } from '@/redux/actions/miscActions';
import * as Yup from 'yup';

const SignUpSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email is not valid.')
    .required('Email is required.'),
  password: Yup.string()
    .required('Password is required.')
    .min(8 /* MIN_PASSWORD_LENGTH */, 'Password length should be at least 8 characters.')
    .matches(/[A-Z\W]/g, 'Password should contain at least 1 uppercase letter.'),
  fullname: Yup.string()
    .required('Full name is required.')
    .min(4 /* MIN_NAME_LENGTH */, 'Name should be at least 4 characters.')
});

const SignUp = ({ history }) => {
  const { isAuthenticating, authStatus } = useSelector((state) => ({
    isAuthenticating: state.app.isAuthenticating,
    authStatus: state.app.authStatus
  }));
  const dispatch = useDispatch();

  useScrollTop();
  useDocumentTitle('Sign Up | Salinaka');

  useEffect(() => () => {
    dispatch(setAuthStatus(null));
    dispatch(setAuthenticating(false));
  }, [dispatch]);

  const onClickSignIn = () => history.push(SIGNIN);

  const onFormSubmit = (form) => {
    dispatch(signUp({
      fullname: form.fullname.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password.trim()
    }));
  };

  return (
    <AuthStatus authStatus={authStatus}>
      <div className="auth-main">
        <h3>Sign up to Salinaka</h3>
        <Formik
          initialValues={{
            fullname: '',
            email: '',
            password: ''
          }}
          validateOnChange
          validationSchema={SignUpSchema}
          onSubmit={onFormSubmit}
        >
          {() => (
            <Form>
              <div className="auth-field">
                <Field
                  disabled={isAuthenticating}
                  name="fullname"
                  type="text"
                  label="* Full Name"
                  placeholder="John Doe"
                  style={{ textTransform: 'capitalize' }}
                  component={CustomInput}
                />
              </div>
              <div className="auth-field">
                <Field
                  disabled={isAuthenticating}
                  name="email"
                  type="email"
                  label="* Email"
                  placeholder="test@example.com"
                  component={CustomInput}
                />
              </div>
              <div className="auth-field">
                <Field
                  disabled={isAuthenticating}
                  name="password"
                  type="password"
                  label="* Password"
                  placeholder="Your Password"
                  component={CustomInput}
                />
              </div>
              <br />
              <div className="auth-field auth-action auth-action-signup">
                <button
                  className="button auth-button"
                  disabled={isAuthenticating}
                  type="submit"
                >
                  {isAuthenticating ? 'Signing Up' : 'Sign Up'}
                  &nbsp;
                  {isAuthenticating ? <LoadingOutlined /> : <ArrowRightOutlined />}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <div className="auth-divider">
        <h6>OR</h6>
      </div>
      <SocialLogin isLoading={isAuthenticating} />
      <div className="auth-message">
        <span className="auth-info">
          <strong>Already have an account?</strong>
        </span>
        <button
          className="button button-small button-border button-border-gray"
          disabled={isAuthenticating}
          onClick={onClickSignIn}
          type="button"
        >
          Sign In
        </button>
      </div>
    </AuthStatus>
  );
};

SignUp.propTypes = {
  history: historyShape.isRequired
};

export default SignUp;
