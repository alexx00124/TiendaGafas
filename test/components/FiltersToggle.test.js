import React from 'react';
import { shallow } from 'enzyme';

jest.mock('@/hooks', () => ({
  useModal: jest.fn()
}));

import { useModal } from '@/hooks';
import FiltersToggle from '@/components/common/FiltersToggle';

describe('FiltersToggle', () => {
  let mockOnOpenModal;
  let mockOnCloseModal;

  beforeEach(() => {
    mockOnOpenModal = jest.fn();
    mockOnCloseModal = jest.fn();
    useModal.mockReturnValue({
      isOpenModal: false,
      onOpenModal: mockOnOpenModal,
      onCloseModal: mockOnCloseModal
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const wrapper = shallow(
      <FiltersToggle>
        <span>Filter</span>
      </FiltersToggle>
    );
    expect(wrapper.exists()).toBe(true);
  });

  it('renders children inside the filters-toggle div', () => {
    const wrapper = shallow(
      <FiltersToggle>
        <span className="filter-label">Filter</span>
      </FiltersToggle>
    );
    expect(wrapper.find('.filters-toggle').find('.filter-label').exists()).toBe(true);
  });

  it('calls onOpenModal when filters-toggle is clicked', () => {
    const wrapper = shallow(
      <FiltersToggle>
        <span>Filter</span>
      </FiltersToggle>
    );
    wrapper.find('.filters-toggle').simulate('click');
    expect(mockOnOpenModal).toHaveBeenCalledTimes(1);
  });

  it('passes isOpenModal to Modal', () => {
    const wrapper = shallow(
      <FiltersToggle>
        <span>Filter</span>
      </FiltersToggle>
    );
    expect(wrapper.find('Modal').prop('isOpen')).toBe(false);
  });

  it('passes onRequestClose to Modal', () => {
    const wrapper = shallow(
      <FiltersToggle>
        <span>Filter</span>
      </FiltersToggle>
    );
    expect(wrapper.find('Modal').prop('onRequestClose')).toBe(mockOnCloseModal);
  });

  it('renders Modal with close button', () => {
    const wrapper = shallow(
      <FiltersToggle>
        <span>Filter</span>
      </FiltersToggle>
    );
    expect(wrapper.find('.modal-close-button').exists()).toBe(true);
  });

  it('calls onCloseModal when close button is clicked', () => {
    const wrapper = shallow(
      <FiltersToggle>
        <span>Filter</span>
      </FiltersToggle>
    );
    wrapper.find('.modal-close-button').simulate('click');
    expect(mockOnCloseModal).toHaveBeenCalledTimes(1);
  });
});
