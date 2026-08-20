import { call, put, select } from 'redux-saga/effects';
import profileSaga from '@/redux/sagas/profileSaga';
import firebase from '@/services/firebase';
import { history } from '@/routers/AppRouter';
import { UPDATE_EMAIL, UPDATE_PROFILE } from '@/constants/constants';
import { ACCOUNT } from '@/constants/routes';
import { setLoading } from '@/redux/actions/miscActions';
import { updateProfileSuccess } from '@/redux/actions/profileActions';
import { displayActionMessage } from '@/helpers/utils';

describe('profileSaga', () => {
  describe('UPDATE_EMAIL', () => {
    it('updates email successfully', () => {
      const gen = profileSaga({
        type: UPDATE_EMAIL,
        payload: { password: 'pass123', newEmail: 'new@test.com' }
      });

      // 1. setLoading(false)
      expect(gen.next().value).toEqual(put(setLoading(false)));
      // 2. call(firebase.updateEmail, ...)
      expect(gen.next().value).toEqual(call(firebase.updateEmail, 'pass123', 'new@test.com'));
      // 3. setLoading(false) again
      expect(gen.next().value).toEqual(put(setLoading(false)));
      // 4. history.push
      expect(gen.next().value).toEqual(call(history.push, '/profile'));
      // 5. displayActionMessage
      expect(gen.next().value).toEqual(call(displayActionMessage, 'Email Updated Successfully!', 'success'));
      // done
      expect(gen.next().done).toBe(true);
    });

    it('handles email update error', () => {
      const gen = profileSaga({
        type: UPDATE_EMAIL,
        payload: { password: 'pass123', newEmail: 'new@test.com' }
      });

      gen.next(); // setLoading(false)
      // throw at call(firebase.updateEmail)
      const setLoadingEffect = gen.throw(new Error('email update failed')).value;
      expect(setLoadingEffect).toEqual(put(setLoading(false)));
      expect(gen.next().value).toEqual(call(displayActionMessage,
        'Failed to update email: email update failed', 'error'));
      expect(gen.next().done).toBe(true);
    });
  });

  describe('UPDATE_PROFILE', () => {
    it('updates profile without email change or files', () => {
      const payload = {
        credentials: { email: null, password: null },
        files: { avatarFile: null, bannerFile: null },
        updates: { fullname: 'John Doe', address: '123 Main St' }
      };
      const state = { profile: { email: 'old@test.com' }, auth: { id: 'uid1' } };

      const gen = profileSaga({ type: UPDATE_PROFILE, payload });
      expect(gen.next().value).toEqual(select()); // 1. select
      expect(gen.next(state).value).toEqual(put(setLoading(true))); // 2. setLoading(true)
      // email is null → skip updateEmail
      // files are null → else branch
      expect(gen.next().value).toEqual(call(firebase.updateProfile, 'uid1', payload.updates)); // 3. updateProfile
      expect(gen.next().value).toEqual(put(updateProfileSuccess(payload.updates))); // 4. updateProfileSuccess
      expect(gen.next().value).toEqual(put(setLoading(false))); // 5. setLoading(false)
      expect(gen.next().value).toEqual(call(history.push, ACCOUNT)); // 6. history.push
      expect(gen.next().value).toEqual(call(displayActionMessage, 'Profile Updated Successfully!', 'success')); // 7
      expect(gen.next().done).toBe(true); // done
    });

    it('updates email when email/password provided and email changed', () => {
      const payload = {
        credentials: { email: 'new@test.com', password: 'pass123' },
        files: { avatarFile: null, bannerFile: null },
        updates: { fullname: 'John' }
      };
      const state = { profile: { email: 'old@test.com' }, auth: { id: 'uid1' } };

      const gen = profileSaga({ type: UPDATE_PROFILE, payload });
      gen.next(); // 1. select
      gen.next(state); // 2. setLoading(true)
      gen.next(); // 3. call(firebase.updateEmail, 'pass123', 'new@test.com')
      // files null → else branch
      gen.next(); // 4. call(firebase.updateProfile, 'uid1', ...)
      gen.next(); // 5. put(updateProfileSuccess)
      gen.next(); // 6. put(setLoading(false))
      gen.next(); // 7. call(history.push, ACCOUNT)
      gen.next(); // 8. call(displayActionMessage, ...)
      expect(gen.next().done).toBe(true);
    });

    it('uploads avatar and banner when files provided', () => {
      const payload = {
        credentials: { email: null, password: null },
        files: {
          avatarFile: { name: 'avatar.jpg', type: 'image/jpeg' },
          bannerFile: { name: 'banner.jpg', type: 'image/jpeg' }
        },
        updates: { fullname: 'John', avatar: 'old.jpg', banner: 'old.jpg' }
      };
      const state = { profile: { email: 'test@test.com' }, auth: { id: 'uid1' } };

      const gen = profileSaga({ type: UPDATE_PROFILE, payload });
      gen.next(); // 1. select
      gen.next(state); // 2. setLoading(true)
      // email null → skip updateEmail
      // bannerFile exists → call(storeImage, 'uid1', 'banner', bannerFile)
      gen.next(); // 3. call(storeImage, banner)
      // avatarFile exists → call(storeImage, 'uid1', 'avatar', avatarFile)
      gen.next('bannerUrl'); // 4. call(storeImage, avatar)
      gen.next('avatarUrl'); // 5. call(firebase.updateProfile, 'uid1', updates with new URLs)
      gen.next(); // 6. put(updateProfileSuccess)
      gen.next(); // 7. put(setLoading(false))
      gen.next(); // 8. call(history.push, ACCOUNT)
      gen.next(); // 9. call(displayActionMessage, ...)
      expect(gen.next().done).toBe(true);
    });

    it('uploads only avatar when only avatarFile provided', () => {
      const payload = {
        credentials: { email: null, password: null },
        files: { avatarFile: { name: 'avatar.jpg' }, bannerFile: null },
        updates: { fullname: 'John', avatar: 'old.jpg', banner: 'old.jpg' }
      };
      const state = { profile: { email: 'test@test.com' }, auth: { id: 'uid1' } };

      const gen = profileSaga({ type: UPDATE_PROFILE, payload });
      gen.next(); // select
      gen.next(state); // setLoading(true)
      gen.next(); // bannerURL = payload.updates.banner (bannerFile is null)
      gen.next(); // call(storeImage, avatar)
      gen.next('avatarUrl'); // call(updateProfile)
      gen.next(); // put(updateProfileSuccess)
      gen.next(); // setLoading(false)
      gen.next(); // history.push
      gen.next(); // displayActionMessage
      expect(gen.next().done).toBe(true);
    });

    it('uploads only banner when only bannerFile provided', () => {
      const payload = {
        credentials: { email: null, password: null },
        files: { avatarFile: null, bannerFile: { name: 'banner.jpg' } },
        updates: { fullname: 'John', avatar: 'old.jpg', banner: 'old.jpg' }
      };
      const state = { profile: { email: 'test@test.com' }, auth: { id: 'uid1' } };

      const gen = profileSaga({ type: UPDATE_PROFILE, payload });
      gen.next(); // select
      gen.next(state); // setLoading(true)
      gen.next(); // call(storeImage, banner)
      gen.next('bannerUrl'); // avatarURL = payload.updates.avatar (avatarFile is null)
      gen.next(); // call(updateProfile)
      gen.next(); // put(updateProfileSuccess)
      gen.next(); // setLoading(false)
      gen.next(); // history.push
      gen.next(); // displayActionMessage
      expect(gen.next().done).toBe(true);
    });

    it('handles wrong-password error', () => {
      const payload = {
        credentials: { email: 'new@test.com', password: 'wrong' },
        files: { avatarFile: null, bannerFile: null },
        updates: { fullname: 'John' }
      };
      const state = { profile: { email: 'old@test.com' }, auth: { id: 'uid1' } };

      const gen = profileSaga({ type: UPDATE_PROFILE, payload });
      gen.next(); // select
      gen.next(state); // setLoading(true)
      gen.next(); // advances past setLoading(true) → yields call(updateEmail)
      // throw at call(updateEmail)
      const setLoadingEffect = gen.throw({ code: 'auth/wrong-password', message: 'Wrong password' }).value;
      expect(setLoadingEffect).toEqual(put(setLoading(false)));
      expect(gen.next().value).toEqual(call(displayActionMessage,
        'Wrong password, profile update failed :(', 'error'));
      expect(gen.next().done).toBe(true);
    });

    it('handles generic error with message', () => {
      const payload = {
        credentials: { email: null, password: null },
        files: { avatarFile: null, bannerFile: null },
        updates: { fullname: 'John' }
      };
      const state = { profile: { email: 'test@test.com' }, auth: { id: 'uid1' } };

      const gen = profileSaga({ type: UPDATE_PROFILE, payload });
      gen.next(); // select
      gen.next(state); // setLoading(true)
      gen.next(); // advances → yields call(updateProfile) [email null, files null]
      // throw at call(updateProfile)
      const setLoadingEffect = gen.throw(new Error('Server error')).value;
      expect(setLoadingEffect).toEqual(put(setLoading(false)));
      expect(gen.next().value).toEqual(call(displayActionMessage,
        expect.stringContaining('Server error'), 'error'));
      expect(gen.next().done).toBe(true);
    });

    it('handles error without message property', () => {
      const payload = {
        credentials: { email: null, password: null },
        files: { avatarFile: null, bannerFile: null },
        updates: { fullname: 'John' }
      };
      const state = { profile: { email: 'test@test.com' }, auth: { id: 'uid1' } };

      const gen = profileSaga({ type: UPDATE_PROFILE, payload });
      gen.next(); // select
      gen.next(state); // setLoading(true)
      gen.next(); // advances → yields call(updateProfile)
      // throw error without message
      const setLoadingEffect = gen.throw({ code: 'unknown' }).value;
      expect(setLoadingEffect).toEqual(put(setLoading(false)));
      expect(gen.next().value).toEqual(call(displayActionMessage,
        expect.stringContaining('Failed to update profile'), 'error'));
      expect(gen.next().done).toBe(true);
    });
  });

  describe('default', () => {
    it('throws on unexpected action type', () => {
      const gen = profileSaga({ type: 'UNKNOWN', payload: {} });
      expect(() => gen.next()).toThrow('Unexpected action type.');
    });
  });
});
