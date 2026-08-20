import {
  registerUser,
  getUser,
  addUser,
  editUser,
  deleteUser
} from '@/redux/actions/userActions';
import * as types from '@/constants/constants';

describe('userActions', () => {
  it('should create registerUser action', () => {
    const user = { name: 'John', email: 'j@b.com' };
    expect(registerUser(user)).toEqual({
      type: types.REGISTER_USER,
      payload: user
    });
  });

  it('should create getUser action', () => {
    expect(getUser('uid-123')).toEqual({
      type: types.GET_USER,
      payload: 'uid-123'
    });
  });

  it('should create addUser action', () => {
    const user = { name: 'Jane', email: 'jane@b.com' };
    expect(addUser(user)).toEqual({
      type: types.ADD_USER,
      payload: user
    });
  });

  it('should create editUser action', () => {
    const updates = { name: 'Updated' };
    expect(editUser(updates)).toEqual({
      type: types.EDIT_USER,
      payload: updates
    });
  });

  it('should create deleteUser action', () => {
    expect(deleteUser('id-1')).toEqual({
      type: types.DELETE_USER,
      payload: 'id-1'
    });
  });
});
