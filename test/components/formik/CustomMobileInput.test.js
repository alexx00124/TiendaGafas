import React from 'react';
import { shallow } from 'enzyme';

const setValue = jest.fn();

jest.mock('formik', () => ({
  useField: jest.fn()
}));

jest.mock('react-phone-input-2', () => {
  const MockPhoneInput = () => <div className="mock-phone-input" />;
  return MockPhoneInput;
});

import { useField } from 'formik';
import CustomMobileInput from '@/components/formik/CustomMobileInput';

describe('CustomMobileInput', () => {
  const field = { name: 'mobile' };
  const helpers = { setValue };
  const defaultValue = { value: '09254461351' };

  const shallowComponent = ({
    props = {},
    touched = false,
    error = null
  } = {}) => {
    useField.mockReturnValue([field, { touched, error }, helpers]);
    return shallow(
      <CustomMobileInput name="mobile" defaultValue={defaultValue} {...props} />
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls formik useField with the component props', () => {
    shallowComponent({ props: { label: 'Phone' } });
    expect(useField).toHaveBeenCalledWith(expect.objectContaining({
      name: 'mobile',
      label: 'Phone'
    }));
  });

  it('renders default label when not touched or without error', () => {
    const wrapper = shallowComponent();
    expect(wrapper.find('label.label-input').text()).toBe('Mobile Number');
    expect(wrapper.find('label.label-input').prop('htmlFor')).toBe('mobile');
    expect(wrapper.find('.label-error').exists()).toBe(false);
  });

  it('renders custom label when provided', () => {
    const wrapper = shallowComponent({ props: { label: 'Phone' } });
    expect(wrapper.find('label.label-input').text()).toBe('Phone');
  });

  it('renders error.value when touched and error present', () => {
    const wrapper = shallowComponent({
      touched: true,
      error: { value: 'Mobile number is required' }
    });
    expect(wrapper.find('.label-error').text()).toBe('Mobile number is required');
    expect(wrapper.find('label.label-input').exists()).toBe(false);
  });

  it('falls back to error.dialCode when error has no value', () => {
    const wrapper = shallowComponent({
      touched: true,
      error: { dialCode: 'Dial code is required' }
    });
    expect(wrapper.find('.label-error').text()).toBe('Dial code is required');
  });

  it('passes phone input configuration to PhoneInput', () => {
    const wrapper = shallowComponent({ props: { placeholder: '09171234567' } });
    const phoneInput = wrapper.find('MockPhoneInput');
    expect(phoneInput.prop('name')).toBe('mobile');
    expect(phoneInput.prop('country')).toBe('ph');
    expect(phoneInput.prop('inputClass')).toBe('input-form d-block');
    expect(phoneInput.prop('placeholder')).toBe('09171234567');
    expect(phoneInput.prop('value')).toBe('09254461351');
    expect(phoneInput.prop('inputExtraProps')).toEqual({ required: true });
  });

  it('highlights phone input border red when touched and error present', () => {
    const wrapper = shallowComponent({
      touched: true,
      error: { value: 'Required' }
    });
    expect(wrapper.find('MockPhoneInput').prop('style')).toEqual({
      border: '1px solid red'
    });
  });

  it('keeps default border when no error', () => {
    const wrapper = shallowComponent();
    expect(wrapper.find('MockPhoneInput').prop('style')).toEqual({
      border: '1px solid #cacaca'
    });
  });

  it('builds the mobile object and sets its value on change', () => {
    const wrapper = shallowComponent();
    wrapper.find('MockPhoneInput').prop('onChange')(
      '09251234567',
      { dialCode: '63', countryCode: 'ph', name: 'Philippines' }
    );
    expect(setValue).toHaveBeenCalledTimes(1);
    expect(setValue).toHaveBeenCalledWith({
      dialCode: '63',
      countryCode: 'ph',
      country: 'Philippines',
      value: '09251234567'
    });
  });
});
