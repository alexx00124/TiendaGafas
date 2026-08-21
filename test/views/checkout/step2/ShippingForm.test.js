import React from 'react';
import { mount } from 'enzyme';

let mockSetValues;
let mockFieldMeta;
let mockFieldValue;

jest.mock('formik', () => ({
  useFormikContext: jest.fn(),
  Field: ({ name, children }) => (
    children
      ? children({
        field: { name, value: mockFieldValue },
        form: { values: {}, setValues: mockSetValues },
        meta: mockFieldMeta
      })
      : <div className="mock-field" data-name={name} />
  )
}));

jest.mock('@/components/formik', () => ({
  CustomInput: () => <div className="mock-custom-input" />,
  CustomMobileInput: (props) => <div className="mock-custom-mobile" defaultValue={props.defaultValue} />
}));

import ShippingForm from '@/views/checkout/step2/ShippingForm';
import { useFormikContext } from 'formik';

describe('ShippingForm', () => {
  beforeEach(() => {
    mockSetValues = jest.fn();
    mockFieldMeta = { touched: false, error: '', value: false };
    mockFieldValue = false;
    useFormikContext.mockReturnValue({
      values: { mobile: { dialCode: '+54', value: '555' } }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders fullname, email and address fields', () => {
    const wrapper = mount(<ShippingForm />);
    const names = wrapper.find('.mock-field').map((f) => f.prop('data-name'));
    expect(names).toEqual(['fullname', 'email', 'address']);
  });

  it('passes mobile value from formik context to CustomMobileInput', () => {
    const wrapper = mount(<ShippingForm />);
    expect(wrapper.find('.mock-custom-mobile').prop('defaultValue'))
      .toEqual({ dialCode: '+54', value: '555' });
  });

  it('shows shipping option label when isInternational has no error', () => {
    const wrapper = mount(<ShippingForm />);
    expect(wrapper.find('label.label-input').text()).toContain('Shipping Option');
    expect(wrapper.find('span.label-error').exists()).toBe(false);
  });

  it('shows error label when isInternational was touched with error', () => {
    mockFieldMeta = { touched: true, error: 'Select a shipping option', value: false };
    const wrapper = mount(<ShippingForm />);
    expect(wrapper.find('span.label-error').text()).toBe('Select a shipping option');
    expect(wrapper.find('label.label-input').exists()).toBe(false);
  });

  it('toggles international shipping through form.setValues on checkbox change', () => {
    const wrapper = mount(<ShippingForm />);
    const checkbox = wrapper.find('input[type="checkbox"]');
    expect(checkbox.exists()).toBe(true);

    checkbox.simulate('change', { target: { checked: true } });
    expect(mockSetValues).toHaveBeenCalledWith({ isInternational: true });

    checkbox.simulate('change', { target: { checked: false } });
    expect(mockSetValues).toHaveBeenLastCalledWith({ isInternational: false });
  });
});
