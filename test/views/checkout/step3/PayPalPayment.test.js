import React from 'react';
import { shallow } from 'enzyme';

jest.mock('formik', () => ({
  useFormikContext: jest.fn()
}));

import PayPalPayment from '@/views/checkout/step3/PayPalPayment';
import { useFormikContext } from 'formik';

describe('PayPalPayment', () => {
  beforeEach(() => {
    useFormikContext.mockReturnValue({
      values: { type: 'credit' },
      setValues: jest.fn()
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const wrapper = shallow(<PayPalPayment />);
    expect(wrapper.exists()).toBe(true);
  });

  it('renders PayPal radio input', () => {
    const wrapper = shallow(<PayPalPayment />);
    expect(wrapper.find('#modePayPal').exists()).toBe(true);
    expect(wrapper.find('#modePayPal').prop('type')).toBe('radio');
  });

  it('shows PayPal label', () => {
    const wrapper = shallow(<PayPalPayment />);
    expect(wrapper.find('label').text()).toContain('PayPal');
  });

  it('applies is-selected-payment when paypal is chosen', () => {
    useFormikContext.mockReturnValue({
      values: { type: 'paypal' },
      setValues: jest.fn()
    });
    const wrapper = shallow(<PayPalPayment />);
    expect(wrapper.find('.is-selected-payment').exists()).toBe(true);
  });

  it('selects paypal through setValues when radio is checked', () => {
    const setValues = jest.fn();
    useFormikContext.mockReturnValue({ values: { type: 'credit' }, setValues });
    const wrapper = shallow(<PayPalPayment />);

    wrapper.find('#modePayPal').simulate('change', { target: { checked: true } });
    expect(setValues).toHaveBeenCalledWith({ type: 'paypal' });
  });

  it('ignores radio change when unchecked', () => {
    const setValues = jest.fn();
    useFormikContext.mockReturnValue({ values: { type: 'credit' }, setValues });
    const wrapper = shallow(<PayPalPayment />);

    wrapper.find('#modePayPal').simulate('change', { target: { checked: false } });
    expect(setValues).not.toHaveBeenCalled();
  });
});
