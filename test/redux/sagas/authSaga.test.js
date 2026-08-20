import { call, put } from 'redux-saga/effects';
import authSaga from '@/redux/sagas/authSaga';
import firebase from '@/services/firebase';
import { history } from '@/routers/AppRouter';
import {
  ON_AUTHSTATE_FAIL,
  ON_AUTHSTATE_SUCCESS,
  RESET_PASSWORD,
  SET_AUTH_PERSISTENCE,
  SIGNIN,
  SIGNIN_WITH_FACEBOOK,
  SIGNIN_WITH_GITHUB,
  SIGNIN_WITH_GOOGLE,
  SIGNOUT,
  SIGNUP
} from '@/constants/constants';
import { SIGNIN as ROUTE_SIGNIN } from '@/constants/routes';
import { signInSuccess, signOutSuccess } from '@/redux/actions/authActions';
import { clearBasket, setBasketItems } from '@/redux/actions/basketActions';
import { resetCheckout } from '@/redux/actions/checkoutActions';
import { resetFilter } from '@/redux/actions/filterActions';
import { setAuthenticating, setAuthStatus } from '@/redux/actions/miscActions';
import { clearProfile, setProfile } from '@/redux/actions/profileActions';

// Helper: iterate initRequest sub-generator
function runInitRequest(gen) {
  const initGen = gen.next().value;
  expect(initGen.next().value).toEqual(put(setAuthenticating()));
  expect(initGen.next().value).toEqual(put(setAuthStatus({})));
  expect(initGen.next().done).toBe(true);
}

// Helper: iterate handleError sub-generator
function runHandleError(gen, errorCode) {
  const handleErrorGen = gen.throw({ code: errorCode }).value;
  expect(handleErrorGen.next().value).toEqual(put(setAuthenticating(false)));
  const statusEffect = handleErrorGen.next().value;
  expect(statusEffect).toEqual(put(setAuthStatus(
    expect.objectContaining({ success: false, type: 'auth', isError: true })
  )));
  expect(handleErrorGen.next().done).toBe(true);
}

describe('authSaga', () => {
  describe('SIGNIN', () => {
    it('handles successful sign in', () => {
      const gen = authSaga({ type: SIGNIN, payload: { email: 'a@b.com', password: '123' } });
      runInitRequest(gen);
      expect(gen.next().value).toEqual(call(firebase.signIn, 'a@b.com', '123'));
      expect(gen.next().done).toBe(true);
    });

    it('handles auth/network-request-failed error', () => {
      const gen = authSaga({ type: SIGNIN, payload: { email: 'a@b.com', password: '123' } });
      runInitRequest(gen);
      gen.next(); // call(firebase.signIn)
      runHandleError(gen, 'auth/network-request-failed');
      expect(gen.next().done).toBe(true);
    });

    it('handles auth/wrong-password error', () => {
      const gen = authSaga({ type: SIGNIN, payload: { email: 'a@b.com', password: '123' } });
      runInitRequest(gen);
      gen.next();
      runHandleError(gen, 'auth/wrong-password');
      expect(gen.next().done).toBe(true);
    });

    it('handles auth/user-not-found error', () => {
      const gen = authSaga({ type: SIGNIN, payload: { email: 'a@b.com', password: '123' } });
      runInitRequest(gen);
      gen.next();
      runHandleError(gen, 'auth/user-not-found');
      expect(gen.next().done).toBe(true);
    });

    it('handles generic error', () => {
      const gen = authSaga({ type: SIGNIN, payload: { email: 'a@b.com', password: '123' } });
      runInitRequest(gen);
      gen.next();
      const handleErrorGen = gen.throw(new Error('something broke')).value;
      handleErrorGen.next(); // put(setAuthenticating(false))
      const statusEffect = handleErrorGen.next().value;
      expect(statusEffect).toEqual(put(setAuthStatus(
        expect.objectContaining({ success: false, isError: true, message: 'something broke' })
      )));
      expect(handleErrorGen.next().done).toBe(true);
      expect(gen.next().done).toBe(true);
    });
  });

  describe('SIGNIN_WITH_GOOGLE', () => {
    it('handles successful sign in', () => {
      const gen = authSaga({ type: SIGNIN_WITH_GOOGLE });
      runInitRequest(gen);
      expect(gen.next().value).toEqual(call(firebase.signInWithGoogle));
      expect(gen.next().done).toBe(true);
    });

    it('handles error', () => {
      const gen = authSaga({ type: SIGNIN_WITH_GOOGLE });
      runInitRequest(gen);
      gen.next();
      runHandleError(gen, 'auth/network-request-failed');
      expect(gen.next().done).toBe(true);
    });
  });

  describe('SIGNIN_WITH_FACEBOOK', () => {
    it('handles successful sign in', () => {
      const gen = authSaga({ type: SIGNIN_WITH_FACEBOOK });
      runInitRequest(gen);
      expect(gen.next().value).toEqual(call(firebase.signInWithFacebook));
      expect(gen.next().done).toBe(true);
    });

    it('handles error', () => {
      const gen = authSaga({ type: SIGNIN_WITH_FACEBOOK });
      runInitRequest(gen);
      gen.next();
      runHandleError(gen, 'auth/wrong-password');
      expect(gen.next().done).toBe(true);
    });
  });

  describe('SIGNIN_WITH_GITHUB', () => {
    it('handles successful sign in', () => {
      const gen = authSaga({ type: SIGNIN_WITH_GITHUB });
      runInitRequest(gen);
      expect(gen.next().value).toEqual(call(firebase.signInWithGithub));
      expect(gen.next().done).toBe(true);
    });

    it('handles error', () => {
      const gen = authSaga({ type: SIGNIN_WITH_GITHUB });
      runInitRequest(gen);
      gen.next();
      runHandleError(gen, 'auth/email-already-in-use');
      expect(gen.next().done).toBe(true);
    });
  });

  describe('SIGNUP', () => {
    const signupPayload = { email: 'test@test.com', password: '123', fullname: 'john doe' };

    it('handles successful sign up', () => {
      const gen = authSaga({ type: SIGNUP, payload: signupPayload });
      runInitRequest(gen);

      // call(firebase.createAccount, ...)
      const ref = { user: { uid: 'uid123', metadata: { creationTime: 100 } } };
      expect(gen.next().value).toEqual(call(firebase.createAccount, 'test@test.com', '123'));

      // createAccount returns ref, then saga computes fullname and calls addUser
      const addUserEffect = gen.next(ref).value;
      expect(addUserEffect).toEqual(call(firebase.addUser, 'uid123', expect.objectContaining({
        fullname: 'John Doe',
        email: 'test@test.com',
        role: 'USER'
      })));

      expect(gen.next().value).toEqual(put(setProfile(expect.objectContaining({ fullname: 'John Doe' }))));
      expect(gen.next().value).toEqual(put(setAuthenticating(false)));
      expect(gen.next().done).toBe(true);
    });

    it('handles sign up error', () => {
      const gen = authSaga({ type: SIGNUP, payload: signupPayload });
      runInitRequest(gen);
      gen.next(); // call(firebase.createAccount)
      runHandleError(gen, 'auth/email-already-in-use');
      expect(gen.next().done).toBe(true);
    });
  });

  describe('SIGNOUT', () => {
    it('handles successful sign out', () => {
      const gen = authSaga({ type: SIGNOUT });
      runInitRequest(gen);
      expect(gen.next().value).toEqual(call(firebase.signOut));
      expect(gen.next().value).toEqual(put(clearBasket()));
      expect(gen.next().value).toEqual(put(clearProfile()));
      expect(gen.next().value).toEqual(put(resetFilter()));
      expect(gen.next().value).toEqual(put(resetCheckout()));
      expect(gen.next().value).toEqual(put(signOutSuccess()));
      expect(gen.next().value).toEqual(put(setAuthenticating(false)));
      expect(gen.next().value).toEqual(call(history.push, ROUTE_SIGNIN));
      expect(gen.next().done).toBe(true);
    });

    it('handles sign out error', () => {
      const gen = authSaga({ type: SIGNOUT });
      runInitRequest(gen);
      gen.next(); // call(firebase.signOut)
      const error = new Error('signout failed');
      const catchEffect = gen.throw(error).value;
      expect(catchEffect).toEqual(put(setAuthenticating(false)));
      const statusEffect = gen.next().value;
      expect(statusEffect).toEqual(put(setAuthStatus(
        expect.objectContaining({ success: false, isError: true, message: 'signout failed' })
      )));
      expect(gen.next().done).toBe(true);
    });
  });

  describe('RESET_PASSWORD', () => {
    it('handles successful password reset', () => {
      const gen = authSaga({ type: RESET_PASSWORD, payload: 'test@test.com' });
      runInitRequest(gen);
      expect(gen.next().value).toEqual(call(firebase.passwordReset, 'test@test.com'));
      expect(gen.next().value).toEqual(put(setAuthStatus(
        expect.objectContaining({ success: true, type: 'reset' })
      )));
      expect(gen.next().value).toEqual(put(setAuthenticating(false)));
      expect(gen.next().done).toBe(true);
    });

    it('handles password reset error', () => {
      const gen = authSaga({ type: RESET_PASSWORD, payload: 'test@test.com' });
      runInitRequest(gen);
      gen.next(); // call(firebase.passwordReset)
      const handleErrorGen = gen.throw(new Error('reset failed')).value;
      expect(handleErrorGen.next().value).toEqual(put(setAuthenticating(false)));
      const statusEffect = handleErrorGen.next().value;
      expect(statusEffect).toEqual(put(setAuthStatus(
        expect.objectContaining({ success: false, type: 'auth', isError: true })
      )));
      expect(handleErrorGen.next().done).toBe(true);
      expect(gen.next().done).toBe(true);
    });
  });

  describe('ON_AUTHSTATE_SUCCESS', () => {
    const authUser = {
      uid: 'uid123',
      providerData: [{ providerId: 'password' }],
      displayName: 'John',
      photoURL: null,
      email: 'test@test.com',
      metadata: { creationTime: 100 }
    };

    it('sets profile for existing user', () => {
      const gen = authSaga({ type: ON_AUTHSTATE_SUCCESS, payload: authUser });
      const user = { basket: ['item1'], role: 'USER', fullname: 'John' };
      expect(gen.next().value).toEqual(call(firebase.getUser, 'uid123'));

      const snapshot = { data: () => user };
      expect(gen.next(snapshot).value).toEqual(put(setProfile(user)));
      expect(gen.next().value).toEqual(put(setBasketItems(user.basket)));
      expect(gen.next().value).toEqual(put(signInSuccess({
        id: 'uid123',
        role: 'USER',
        provider: 'password'
      })));
      expect(gen.next().value).toEqual(put(setAuthStatus(
        expect.objectContaining({ success: true, type: 'auth' })
      )));
      expect(gen.next().value).toEqual(put(setAuthenticating(false)));
      expect(gen.next().done).toBe(true);
    });

    it('creates user for new social login', () => {
      const socialUser = { ...authUser, providerData: [{ providerId: 'google.com' }] };
      const gen = authSaga({ type: ON_AUTHSTATE_SUCCESS, payload: socialUser });
      expect(gen.next().value).toEqual(call(firebase.getUser, 'uid123'));

      // snapshot.data() returns undefined (new user)
      const snapshot = { data: () => undefined };
      expect(gen.next(snapshot).value).toEqual(call(firebase.addUser, 'uid123',
        expect.objectContaining({ fullname: 'John', role: 'USER' })
      ));
      expect(gen.next().value).toEqual(put(setProfile(expect.objectContaining({ fullname: 'John' }))));
      expect(gen.next().value).toEqual(put(signInSuccess({
        id: 'uid123',
        role: 'USER',
        provider: 'google.com'
      })));
      expect(gen.next().value).toEqual(put(setAuthStatus(
        expect.objectContaining({ success: true })
      )));
      expect(gen.next().value).toEqual(put(setAuthenticating(false)));
      expect(gen.next().done).toBe(true);
    });

    it('handles missing displayName for new social user', () => {
      const socialUser = {
        ...authUser,
        displayName: null,
        providerData: [{ providerId: 'google.com' }]
      };
      const gen = authSaga({ type: ON_AUTHSTATE_SUCCESS, payload: socialUser });
      gen.next(); // call(firebase.getUser)
      const snapshot = { data: () => undefined };
      const addUserEffect = gen.next(snapshot).value; // call(firebase.addUser)

      // Verify addUser was called with default fullname 'User'
      expect(addUserEffect).toEqual(call(firebase.addUser, 'uid123',
        expect.objectContaining({ fullname: 'User' })
      ));
      expect(gen.next().value).toEqual(put(setProfile(
        expect.objectContaining({ fullname: 'User' })
      )));
      expect(gen.next().value).toEqual(put(signInSuccess({
        id: 'uid123',
        role: 'USER',
        provider: 'google.com'
      })));
      expect(gen.next().value).toEqual(put(setAuthStatus(
        expect.objectContaining({ success: true })
      )));
      expect(gen.next().value).toEqual(put(setAuthenticating(false)));
      expect(gen.next().done).toBe(true);
    });
  });

  describe('ON_AUTHSTATE_FAIL', () => {
    it('clears profile and signs out', () => {
      const gen = authSaga({ type: ON_AUTHSTATE_FAIL });
      expect(gen.next().value).toEqual(put(clearProfile()));
      expect(gen.next().value).toEqual(put(signOutSuccess()));
      expect(gen.next().done).toBe(true);
    });
  });

  describe('SET_AUTH_PERSISTENCE', () => {
    it('sets auth persistence successfully', () => {
      const gen = authSaga({ type: SET_AUTH_PERSISTENCE });
      expect(gen.next().value).toEqual(call(firebase.setAuthPersistence));
      expect(gen.next().done).toBe(true);
    });

    it('handles persistence error', () => {
      const gen = authSaga({ type: SET_AUTH_PERSISTENCE });
      gen.next(); // call(firebase.setAuthPersistence)
      const error = new Error('persistence failed');
      const statusEffect = gen.throw(error).value;
      expect(statusEffect).toEqual(put(setAuthStatus(
        expect.objectContaining({ success: false, isError: true, message: 'persistence failed' })
      )));
      expect(gen.next().done).toBe(true);
    });
  });

  describe('default', () => {
    it('throws on unexpected action type', () => {
      const gen = authSaga({ type: 'UNEXPECTED', payload: {} });
      expect(() => gen.next()).toThrow('Unexpected Action Type.');
    });
  });
});
