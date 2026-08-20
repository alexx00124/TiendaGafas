import {
  clearProfile,
  setProfile,
  updateEmail,
  updateProfile,
  updateProfileSuccess
} from '@/redux/actions/profileActions';
import * as types from '@/constants/constants';

describe('profileActions', () => {
  it('should create clearProfile action', () => {
    expect(clearProfile()).toEqual({ type: types.CLEAR_PROFILE });
  });

  it('should create setProfile action', () => {
    const user = { uid: '123', displayName: 'John' };
    expect(setProfile(user)).toEqual({
      type: types.SET_PROFILE,
      payload: user
    });
  });

  it('should create updateEmail action', () => {
    expect(updateEmail('oldpass', 'new@b.com')).toEqual({
      type: types.UPDATE_EMAIL,
      payload: { password: 'oldpass', newEmail: 'new@b.com' }
    });
  });

  it('should create updateProfile action', () => {
    const newProfile = {
      updates: { displayName: 'Jane' },
      files: [],
      credentials: { password: 'pass' }
    };
    expect(updateProfile(newProfile)).toEqual({
      type: types.UPDATE_PROFILE,
      payload: {
        updates: newProfile.updates,
        files: newProfile.files,
        credentials: newProfile.credentials
      }
    });
  });

  it('should create updateProfileSuccess action', () => {
    const updates = { displayName: 'Jane' };
    expect(updateProfileSuccess(updates)).toEqual({
      type: types.UPDATE_PROFILE_SUCCESS,
      payload: updates
    });
  });
});
