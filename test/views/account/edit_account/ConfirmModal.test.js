import React from 'react';
import { shallow } from 'enzyme';

jest.mock('formik', () => ({
  useFormikContext: jest.fn()
}));

jest.mock('@/components/common', () => ({
  Modal: ({ children, isOpen, onRequestClose }) => (
    isOpen ? <div className="mock-modal" onClick={onRequestClose}>{children}</div> : null
  )
}));

import ConfirmModal from '@/views/account/edit_account/ConfirmModal';
import { useFormikContext } from 'formik';

describe('ConfirmModal', () => {
  const defaultModal = {
    isOpenModal: true,
    onCloseModal: jest.fn()
  };
  const mockConfirmUpdate = jest.fn();

  beforeEach(() => {
    useFormikContext.mockReturnValue({
      values: { fullname: 'John', email: 'john@test.com' }
    });
    defaultModal.onCloseModal.mockClear();
    mockConfirmUpdate.mockClear();
  });

  it('renders without crashing', () => {
    const wrapper = shallow(
      <ConfirmModal onConfirmUpdate={mockConfirmUpdate} modal={defaultModal} />
    );
    expect(wrapper.exists()).toBe(true);
  });

  it('renders password input', () => {
    const wrapper = shallow(
      <ConfirmModal onConfirmUpdate={mockConfirmUpdate} modal={defaultModal} />
    );
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
  });

  it('renders Confirm button', () => {
    const wrapper = shallow(
      <ConfirmModal onConfirmUpdate={mockConfirmUpdate} modal={defaultModal} />
    );
    const buttons = wrapper.find('.button');
    const confirmBtn = buttons.filterWhere((b) => b.text().includes('Confirm'));
    expect(confirmBtn.length).toBeGreaterThan(0);
  });

  it('calls onConfirmUpdate and onCloseModal on confirm click', () => {
    const wrapper = shallow(
      <ConfirmModal onConfirmUpdate={mockConfirmUpdate} modal={defaultModal} />
    );
    const confirmBtn = wrapper.find('.d-flex-center .button');
    confirmBtn.simulate('click');
    expect(mockConfirmUpdate).toHaveBeenCalled();
    expect(defaultModal.onCloseModal).toHaveBeenCalled();
  });

  it('calls onCloseModal on cancel click', () => {
    const wrapper = shallow(
      <ConfirmModal onConfirmUpdate={mockConfirmUpdate} modal={defaultModal} />
    );
    wrapper.find('.modal-close-button').simulate('click');
    expect(defaultModal.onCloseModal).toHaveBeenCalled();
  });

  it('does not render modal when isOpenModal is false', () => {
    const closedModal = { isOpenModal: false, onCloseModal: jest.fn() };
    const wrapper = shallow(
      <ConfirmModal onConfirmUpdate={mockConfirmUpdate} modal={closedModal} />
    );
    expect(wrapper.find('.mock-modal').exists()).toBe(false);
  });
});
