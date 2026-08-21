import * as ACTION from '@/constants/constants';
import { takeLatest } from 'redux-saga/effects';
import authSaga from '@/redux/sagas/authSaga';
import productSaga from '@/redux/sagas/productSaga';
import profileSaga from '@/redux/sagas/profileSaga';
import rootSaga from '@/redux/sagas/rootSaga';

describe('rootSaga', () => {
  let gen;

  beforeAll(() => {
    gen = rootSaga();
  });

  it('yields takeLatest for auth actions with authSaga', () => {
    const { value } = gen.next();
    expect(value).toEqual(takeLatest(
      [
        ACTION.SIGNIN,
        ACTION.SIGNUP,
        ACTION.SIGNOUT,
        ACTION.SIGNIN_WITH_GOOGLE,
        ACTION.SIGNIN_WITH_FACEBOOK,
        ACTION.SIGNIN_WITH_GITHUB,
        ACTION.ON_AUTHSTATE_CHANGED,
        ACTION.ON_AUTHSTATE_SUCCESS,
        ACTION.ON_AUTHSTATE_FAIL,
        ACTION.SET_AUTH_PERSISTENCE,
        ACTION.RESET_PASSWORD
      ],
      authSaga
    ));
  });

  it('yields takeLatest for product actions with productSaga', () => {
    const { value } = gen.next();
    expect(value).toEqual(takeLatest(
      [
        ACTION.ADD_PRODUCT,
        ACTION.SEARCH_PRODUCT,
        ACTION.REMOVE_PRODUCT,
        ACTION.EDIT_PRODUCT,
        ACTION.GET_PRODUCTS
      ],
      productSaga
    ));
  });

  it('yields takeLatest for profile actions with profileSaga', () => {
    const { value } = gen.next();
    expect(value).toEqual(takeLatest(
      [
        ACTION.UPDATE_EMAIL,
        ACTION.UPDATE_PROFILE
      ],
      profileSaga
    ));
  });

  it('completes after all three takeLatest yields', () => {
    const { done } = gen.next();
    expect(done).toBe(true);
  });

  it('saga is a generator function', () => {
    expect(typeof rootSaga).toBe('function');
    const testGen = rootSaga();
    expect(typeof testGen.next).toBe('function');
    expect(typeof testGen.throw).toBe('function');
  });
});
