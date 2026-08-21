import React from 'react';
import { shallow } from 'enzyme';
import CustomInput from '@/components/formik/CustomInput';

describe('CustomInput', () => {
  const defaultProps = {
    field: { name: 'email', value: '', onChange: jest.fn(), onBlur: jest.fn() },
    form: { touched: {}, errors: {} },
    label: 'Email',
  };

  it('renders without crashing', () => {
    const wrapper = shallow(<CustomInput {...defaultProps} />);
    expect(wrapper.exists()).toBe(true);
  });

  it('renders label when no error', () => {
    const wrapper = shallow(<CustomInput {...defaultProps} />);
    expect(wrapper.find('label.label-input').text()).toBe('Email');
    expect(wrapper.find('.label-error').exists()).toBe(false);
  });

  it('renders error when touched and error present', () => {
    const props = {
      ...defaultProps,
      form: {
        touched: { email: true },
        errors: { email: 'Email is required' },
      },
    };
    const wrapper = shallow(<CustomInput {...props} />);
    expect(wrapper.find('.label-error').text()).toBe('Email is required');
    expect(wrapper.find('label.label-input').exists()).toBe(false);
  });

  it('adds input-error class when touched and error present', () => {
    const props = {
      ...defaultProps,
      form: {
        touched: { email: true },
        errors: { email: 'Email is required' },
      },
    };
    const wrapper = shallow(<CustomInput {...props} />);
    expect(wrapper.find('input').hasClass('input-error')).toBe(true);
  });

  it('passes field props to input', () => {
    const wrapper = shallow(<CustomInput {...defaultProps} />);
    expect(wrapper.find('input').prop('name')).toBe('email');
    expect(wrapper.find('input').prop('id')).toBe('email');
  });

  it('passes additional props to input', () => {
    const props = { ...defaultProps, placeholder: 'Enter email' };
    const wrapper = shallow(<CustomInput {...props} />);
    expect(wrapper.find('input').prop('placeholder')).toBe('Enter email');
  });

  it('passes inputRef to input element', () => {
    const ref = React.createRef();
    const props = { ...defaultProps, inputRef: ref };
    const wrapper = shallow(<CustomInput {...props} />);
    expect(wrapper.find('input').exists()).toBe(true);
    expect(wrapper.find('input').hasClass('input-form')).toBe(true);
  });
});
