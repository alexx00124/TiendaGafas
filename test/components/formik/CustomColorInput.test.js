import React from 'react';
import { shallow } from 'enzyme';
import InputColor from '@/components/formik/CustomColorInput';

describe('CustomColorInput', () => {
  const defaultProps = {
    name: 'availableColors',
    form: {
      values: { availableColors: ['#000', '#fff'] },
      touched: {},
      errors: {},
    },
    push: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const wrapper = shallow(<InputColor {...defaultProps} />);
    expect(wrapper.exists()).toBe(true);
  });

  it('renders label when no error', () => {
    const wrapper = shallow(<InputColor {...defaultProps} />);
    expect(wrapper.find('label.label-input').text()).toBe('Available Colors');
    expect(wrapper.find('.label-error').exists()).toBe(false);
  });

  it('renders error when touched and error present', () => {
    const props = {
      ...defaultProps,
      form: {
        ...defaultProps.form,
        touched: { availableColors: true },
        errors: { availableColors: 'Select a color' },
      },
    };
    const wrapper = shallow(<InputColor {...props} />);
    expect(wrapper.find('.label-error').text()).toBe('Select a color');
    expect(wrapper.find('label.label-input').exists()).toBe(false);
  });

  it('changes selectedColor on input change', () => {
    const wrapper = shallow(<InputColor {...defaultProps} />);
    wrapper.find('input[type="color"]').simulate('change', {
      target: { value: '#ff0000' },
    });
    expect(wrapper.find('.color-item').first().prop('style')).toEqual({
      background: '#ff0000',
    });
  });

  it('adds color via push when clicking Add Selected Color', () => {
    const wrapper = shallow(<InputColor {...defaultProps} />);
    wrapper.find('input[type="color"]').simulate('change', {
      target: { value: '#ff0000' },
    });
    wrapper.find('.text-link').simulate('click');
    expect(defaultProps.push).toHaveBeenCalledWith('#ff0000');
  });

  it('does not push duplicate color', () => {
    const props = {
      ...defaultProps,
      form: {
        ...defaultProps.form,
        values: { availableColors: ['#000'] },
      },
    };
    const wrapper = shallow(<InputColor {...props} />);
    wrapper.find('input[type="color"]').simulate('change', {
      target: { value: '#000' },
    });
    wrapper.find('.text-link').simulate('click');
    expect(defaultProps.push).not.toHaveBeenCalled();
  });

  it('removes color via remove', () => {
    const wrapper = shallow(<InputColor {...defaultProps} />);
    wrapper.find('.color-item-deletable').at(0).simulate('click');
    expect(defaultProps.remove).toHaveBeenCalledWith(0);
  });

  it('renders color items from form values', () => {
    const wrapper = shallow(<InputColor {...defaultProps} />);
    const items = wrapper.find('.color-item-deletable');
    expect(items.length).toBe(2);
  });
});
