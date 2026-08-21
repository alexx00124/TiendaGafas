import {
  setLoading,
  setAuthenticating,
  setRequestStatus,
  setAuthStatus
} from '@/redux/actions/miscActions';
import * as types from '@/constants/constants';

describe('miscActions', () => {
  it('should create setLoading action with default true', () => {
    expect(setLoading()).toEqual({
      type: types.LOADING,
      payload: true
    });
  });

  it('should create setLoading action with explicit value', () => {
    expect(setLoading(false)).toEqual({
      type: types.LOADING,
      payload: false
    });
  });

  it('should create setAuthenticating action with default true', () => {
    expect(setAuthenticating()).toEqual({
      type: types.IS_AUTHENTICATING,
      payload: true
    });
  });

  it('should create setAuthenticating action with explicit value', () => {
    expect(setAuthenticating(false)).toEqual({
      type: types.IS_AUTHENTICATING,
      payload: false
    });
  });

  it('should create setRequestStatus action', () => {
    expect(setRequestStatus('success')).toEqual({
      type: types.SET_REQUEST_STATUS,
      payload: 'success'
    });
  });

  it('should create setAuthStatus action with default null', () => {
    expect(setAuthStatus()).toEqual({
      type: types.SET_AUTH_STATUS,
      payload: null
    });
  });

  it('should create setAuthStatus action with explicit status', () => {
    expect(setAuthStatus('authenticated')).toEqual({
      type: types.SET_AUTH_STATUS,
      payload: 'authenticated'
    });
  });
});
