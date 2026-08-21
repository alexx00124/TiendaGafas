import React from 'react';
import { mount, shallow } from 'enzyme';

jest.mock('formik', () => ({
  useFormikContext: jest.fn(),
  Field: ({ inputRef, label, component, ...rest }) => (
    <input ref={inputRef} className="mock-field" {...rest} />
  )
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

describe('CreditPayment interactions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('focuses the card name input when credit mode is active on mount', () => {
    const focusSpy = jest.spyOn(HTMLInputElement.prototype, 'focus');
    useFormikContext.mockReturnValue({ values: { type: 'credit' }, setValues: jest.fn() });

    const wrapper = mount(<CreditPayment />);
    expect(focusSpy).toHaveBeenCalled();
    focusSpy.mockRestore();
    wrapper.unmount();
  });

  it('collapses and blurs when another payment mode is active', () => {
    const blurSpy = jest.spyOn(HTMLInputElement.prototype, 'blur');
    useFormikContext.mockReturnValue({ values: { type: 'paypal' }, setValues: jest.fn() });
    const wrapper = mount(<CreditPayment />);

    expect(blurSpy).toHaveBeenCalled();
    expect(wrapper.find('.is-selected-payment').exists()).toBe(false);
    blurSpy.mockRestore();
    wrapper.unmount();
  });

  it('selects credit mode through setValues when radio is checked', () => {
    const setValues = jest.fn();
    useFormikContext.mockReturnValue({ values: { type: 'paypal' }, setValues });
    const wrapper = mount(<CreditPayment />);

    wrapper.find('#modeCredit').simulate('change', { target: { checked: true } });
    expect(setValues).toHaveBeenCalledWith({ type: 'credit' });
    wrapper.unmount();
  });

  it('ignores radio change when unchecked', () => {
    const setValues = jest.fn();
    useFormikContext.mockReturnValue({ values: { type: 'credit' }, setValues });
    const wrapper = mount(<CreditPayment />);

    wrapper.find('#modeCredit').simulate('change', { target: { checked: false } });
    expect(setValues).not.toHaveBeenCalled();
    wrapper.unmount();
  });

  it('blocks non-numeric keys on numeric card fields', () => {
    useFormikContext.mockReturnValue({ values: { type: 'credit' }, setValues: jest.fn() });
    const wrapper = mount(<CreditPayment />);
    const cardNumberInput = wrapper.find('input.mock-field').at(1);

    const preventDefault = jest.fn();
    cardNumberInput.prop('onKeyDown')({ nativeEvent: { key: 'a' }, preventDefault });
    expect(preventDefault).toHaveBeenCalledTimes(1);

    cardNumberInput.prop('onKeyDown')({ nativeEvent: { key: '4' }, preventDefault });
    cardNumberInput.prop('onKeyDown')({ nativeEvent: { key: 'Backspace' }, preventDefault });
    expect(preventDefault).toHaveBeenCalledTimes(1);
    wrapper.unmount();
  });
});
