import React from 'react';
import { mount } from 'enzyme';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(() => mockDispatch)
}));

jest.mock('@/components/common', () => ({
  Boundary: ({ children }) => <div>{children}</div>,
  ImageLoader: ({ src, className }) => <img className={className} src={src} alt="mock" />
}));

jest.mock('@/hooks', () => ({
  useDocumentTitle: jest.fn(),
  useScrollTop: jest.fn(),
  useFileHandler: jest.fn(() => ({
    imageFile: { banner: {}, avatar: {} },
    isFileLoading: false,
    onFileChange: jest.fn()
  })),
  useModal: jest.fn(() => ({
    isOpenModal: false,
    onOpenModal: mockOpenModal,
    onCloseModal: mockCloseModal
  }))
}));

jest.mock('@/redux/actions/miscActions', () => ({
  setLoading: jest.fn((payload) => ({ type: 'SET_LOADING', payload }))
}));

jest.mock('@/redux/actions/profileActions', () => ({
  updateProfile: jest.fn((payload) => ({ type: 'UPDATE_PROFILE', payload }))
}));

jest.mock('@/views/account/edit_account/EditForm', () => (
  ({ authProvider }) => <div className="mock-edit-form" data-provider={authProvider} />
));

jest.mock('@/views/account/edit_account/ConfirmModal', () => (
  ({ onConfirmUpdate }) => (
    <div
      className="mock-confirm-modal"
      onClick={() => onConfirmUpdate && onConfirmUpdate({ email: 'new@test.com' }, 'secret-pass')}
    />
  )
));

import EditProfile from '@/views/account/edit_account';
import { Formik } from 'formik';
import { useSelector } from 'react-redux';
import { setLoading } from '@/redux/actions/miscActions';
import { updateProfile } from '@/redux/actions/profileActions';

const mockOpenModal = jest.fn();
const mockCloseModal = jest.fn();

const profileFixture = {
  fullname: 'Jane Doe',
  email: 'jane@test.com',
  address: 'Fake Street 123',
  avatar: 'avatar.jpg',
  banner: 'banner.jpg',
  mobile: { value: '+54 555' }
};

const render = (overrides = {}) => {
  useSelector.mockImplementation((selector) => selector({
    profile: profileFixture,
    auth: { provider: 'password' },
    app: { loading: false },
    ...overrides
  }));
  return mount(<EditProfile />);
};

const formPayload = {
  fullname: 'Jane Doe',
  email: 'jane@test.com',
  address: 'Fake Street 123',
  // Same reference as the seeded initialValues: the component compares with !==
  mobile: profileFixture.mobile
};

describe('Edit Account view', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the edit form with the auth provider and confirm modal', () => {
    const wrapper = render();
    expect(wrapper.find('.mock-edit-form').prop('data-provider')).toBe('password');
    expect(wrapper.find('.mock-confirm-modal').exists()).toBe(true);
  });

  it('seeds formik initial values from the profile', () => {
    const wrapper = render();
    expect(wrapper.find(Formik).prop('initialValues')).toEqual({
      fullname: 'Jane Doe',
      email: 'jane@test.com',
      address: 'Fake Street 123',
      mobile: { value: '+54 555' }
    });
  });

  it('dispatches updateProfile when fields changed without email change', () => {
    const wrapper = render();
    wrapper.find(Formik).prop('onSubmit')({
      ...formPayload,
      fullname: 'Jane Updated'
    });

    expect(updateProfile).toHaveBeenCalledTimes(1);
    expect(mockOpenModal).not.toHaveBeenCalled();
    const payload = updateProfile.mock.calls[0][0];
    expect(payload.updates).toMatchObject({ fullname: 'Jane Updated', email: 'jane@test.com' });
    expect(payload.files).toEqual({ bannerFile: undefined, avatarFile: undefined });
    expect(payload.credentials).toEqual({});
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_PROFILE',
      payload: expect.objectContaining({ updates: expect.objectContaining({ fullname: 'Jane Updated' }) })
    });
  });

  it('opens the confirmation modal instead of updating when the email changes', () => {
    const wrapper = render();
    wrapper.find(Formik).prop('onSubmit')({
      ...formPayload,
      email: 'new@test.com'
    });

    expect(mockOpenModal).toHaveBeenCalledTimes(1);
    expect(updateProfile).not.toHaveBeenCalled();
  });

  it('does nothing when nothing changed and there are no files', () => {
    const wrapper = render();
    wrapper.find(Formik).prop('onSubmit')(formPayload);

    expect(updateProfile).not.toHaveBeenCalled();
    expect(mockOpenModal).not.toHaveBeenCalled();
  });

  it('updates with credentials when the confirm modal passes a password', () => {
    const wrapper = render();
    wrapper.find('.mock-confirm-modal').simulate('click');

    expect(updateProfile).toHaveBeenCalledTimes(1);
    const payload = updateProfile.mock.calls[0][0];
    expect(payload.credentials).toEqual({ email: 'new@test.com', password: 'secret-pass' });
  });

  it('resets loading state on unmount', () => {
    const wrapper = render();
    wrapper.unmount();
    expect(setLoading).toHaveBeenCalledWith(false);
  });
});
