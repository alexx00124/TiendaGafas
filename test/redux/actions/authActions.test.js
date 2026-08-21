import {
  signIn,
  signInWithGoogle,
  signInWithFacebook,
  signInWithGithub,
  signUp,
  signInSuccess,
  setAuthPersistence,
  signOut,
  signOutSuccess,
  onAuthStateChanged,
  onAuthStateSuccess,
  onAuthStateFail,
  resetPassword
} from '@/redux/actions/authActions';
import * as types from '@/constants/constants';

describe('authActions', () => {
  it('should create signIn action', () => {
    const result = signIn('a@b.com', 'pass');
    expect(result).toEqual({
      type: types.SIGNIN,
      payload: { email: 'a@b.com', password: 'pass' }
    });
  });

  it('should create signInWithGoogle action', () => {
    expect(signInWithGoogle()).toEqual({ type: types.SIGNIN_WITH_GOOGLE });
  });

  it('should create signInWithFacebook action', () => {
    expect(signInWithFacebook()).toEqual({ type: types.SIGNIN_WITH_FACEBOOK });
  });

  it('should create signInWithGithub action', () => {
    expect(signInWithGithub()).toEqual({ type: types.SIGNIN_WITH_GITHUB });
  });

  it('should create signUp action', () => {
    const user = { name: 'John', email: 'j@b.com' };
    expect(signUp(user)).toEqual({ type: types.SIGNUP, payload: user });
  });

  it('should create signInSuccess action', () => {
    const auth = { uid: '123', email: 'x@y.com' };
    expect(signInSuccess(auth)).toEqual({ type: types.SIGNIN_SUCCESS, payload: auth });
  });

  it('should create setAuthPersistence action', () => {
    expect(setAuthPersistence()).toEqual({ type: types.SET_AUTH_PERSISTENCE });
  });

  it('should create signOut action', () => {
    expect(signOut()).toEqual({ type: types.SIGNOUT });
  });

  it('should create signOutSuccess action', () => {
    expect(signOutSuccess()).toEqual({ type: types.SIGNOUT_SUCCESS });
  });

  it('should create onAuthStateChanged action', () => {
    expect(onAuthStateChanged()).toEqual({ type: types.ON_AUTHSTATE_CHANGED });
  });

  it('should create onAuthStateSuccess action', () => {
    const user = { uid: '123' };
    expect(onAuthStateSuccess(user)).toEqual({
      type: types.ON_AUTHSTATE_SUCCESS,
      payload: user
    });
  });

  it('should create onAuthStateFail action', () => {
    const error = new Error('fail');
    expect(onAuthStateFail(error)).toEqual({
      type: types.ON_AUTHSTATE_FAIL,
      payload: error
    });
  });

  it('should create resetPassword action', () => {
    expect(resetPassword('a@b.com')).toEqual({
      type: types.RESET_PASSWORD,
      payload: 'a@b.com'
    });
  });
});
