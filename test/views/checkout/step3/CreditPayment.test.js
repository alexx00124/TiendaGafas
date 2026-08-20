import React from 'react';
import { shallow } from 'enzyme';

jest.mock('formik', () => ({
  useFormikContext: jest.fn(),
  Field: () => <input className="mock-field" />
}));

jest.mock('@/components/formik', () => ({
  CustomInput: () => <div className="mock-custom-input" />
}));

import CreditPayment from '@/views/checkout/step3/CreditPayment';
import { useFormikContext } from 'formik';

describe('CreditPayment', () => {
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
    const wrapper = shallow(<CreditPayment />);
    expect(wrapper.exists()).toBe(true);
  });

  it('renders payment heading', () => {
    const wrapper = shallow(<CreditPayment />);
    expect(wrapper.find('h3').text()).toBe('Payment');
  });

  it('renders credit card radio input', () => {
    const wrapper = shallow(<CreditPayment />);
    expect(wrapper.find('#modeCredit').exists()).toBe(true);
    expect(wrapper.find('#modeCredit').prop('type')).toBe('radio');
  });

  it('shows Credit Card label', () => {
    const wrapper = shallow(<CreditPayment />);
    expect(wrapper.find('label').text()).toContain('Credit Card');
  });

  it('applies is-selected-payment when credit is chosen', () => {
    const wrapper = shallow(<CreditPayment />);
    expect(wrapper.find('.is-selected-payment').exists()).toBe(true);
  });
});
