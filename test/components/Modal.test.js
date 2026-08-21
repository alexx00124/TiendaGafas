import React from 'react';
import { shallow } from 'enzyme';

jest.mock('react-modal', () => {
  const FakeModal = ({ children, isOpen, onRequestClose }) => (
    isOpen ? <div className="fake-modal" onClick={onRequestClose}>{children}</div> : null
  );
  FakeModal.setAppElement = jest.fn();
  return FakeModal;
});

import AppModal from 'react-modal';
import Modal from '@/components/common/Modal';

describe('Modal', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(
      <Modal isOpen={false} onRequestClose={() => {}}>
        <div>Content</div>
      </Modal>
    );
    expect(wrapper.exists()).toBe(true);
  });

  it('passes isOpen to the react-modal', () => {
    const wrapper = shallow(
      <Modal isOpen={true} onRequestClose={() => {}}>
        <span>Child</span>
      </Modal>
    );
    expect(wrapper.prop('isOpen')).toBe(true);
  });

  it('passes false isOpen to the react-modal', () => {
    const wrapper = shallow(
      <Modal isOpen={false} onRequestClose={() => {}}>
        <span>Child</span>
      </Modal>
    );
    expect(wrapper.prop('isOpen')).toBe(false);
  });

  it('passes onRequestClose to the react-modal', () => {
    const onClose = jest.fn();
    const wrapper = shallow(
      <Modal isOpen={true} onRequestClose={onClose}>
        <span>Child</span>
      </Modal>
    );
    expect(wrapper.prop('onRequestClose')).toBe(onClose);
  });

  it('passes afterOpenModal to the react-modal', () => {
    const afterOpen = jest.fn();
    const wrapper = shallow(
      <Modal isOpen={true} onRequestClose={() => {}} afterOpenModal={afterOpen}>
        <span>Child</span>
      </Modal>
    );
    expect(wrapper.prop('onAfterOpen')).toBe(afterOpen);
  });

  it('passes children to the react-modal', () => {
    const wrapper = shallow(
      <Modal isOpen={true} onRequestClose={() => {}}>
        <div className="modal-child">Hello</div>
      </Modal>
    );
    expect(wrapper.prop('children')).toEqual(
      <div className="modal-child">Hello</div>
    );
  });

  it('calls setAppElement', () => {
    shallow(
      <Modal isOpen={true} onRequestClose={() => {}}>
        <span>Child</span>
      </Modal>
    );
    expect(AppModal.setAppElement).toHaveBeenCalledWith('#app');
  });

  it('applies default style', () => {
    const wrapper = shallow(
      <Modal isOpen={true} onRequestClose={() => {}}>
        <span>Child</span>
      </Modal>
    );
    const style = wrapper.prop('style');
    expect(style.content).toEqual(
      expect.objectContaining({
        position: 'fixed',
        padding: '50px 20px',
        zIndex: 9999
      })
    );
  });

  it('merges overrideStyle into default style', () => {
    const wrapper = shallow(
      <Modal isOpen={true} onRequestClose={() => {}} overrideStyle={{ color: 'red' }}>
        <span>Child</span>
      </Modal>
    );
    const style = wrapper.prop('style');
    expect(style.content).toEqual(
      expect.objectContaining({ color: 'red' })
    );
  });
});
