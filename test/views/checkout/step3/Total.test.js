import React from 'react';
import { shallow } from 'enzyme';

jest.mock('formik', () => ({
  useFormikContext: jest.fn()
}));

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(() => jest.fn())
}));

jest.mock('react-router-dom', () => ({
  useHistory: jest.fn(() => ({ push: jest.fn() }))
}));

jest.mock('@/redux/actions/checkoutActions', () => ({
  setPaymentDetails: jest.fn((payload) => ({ type: 'SET_CHECKOUT_PAYMENT_DETAILS', payload }))
}));

import Total from '@/views/checkout/step3/Total';
import { useFormikContext } from 'formik';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setPaymentDetails } from '@/redux/actions/checkoutActions';
import { CHECKOUT_STEP_2 } from '@/constants/routes';
import { displayMoney } from '@/helpers/utils';

describe('Total', () => {
  beforeEach(() => {
    useFormikContext.mockReturnValue({
      values: { type: 'credit', name: 'John', cardnumber: '4242424242424242', ccv: '123', expiry: '12/25' },
      submitForm: jest.fn()
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const wrapper = shallow(<Total isInternational={false} subtotal={100} />);
    expect(wrapper.exists()).toBe(true);
  });

  it('displays total amount', () => {
    const wrapper = shallow(<Total isInternational={false} subtotal={100} />);
    expect(wrapper.find('.basket-total-amount').exists()).toBe(true);
  });

  it('renders Confirm button', () => {
    const wrapper = shallow(<Total isInternational={false} subtotal={100} />);
    expect(wrapper.find('.button').last().text()).toContain('Confirm');
  });

  it('renders Go Back button', () => {
    const wrapper = shallow(<Total isInternational={false} subtotal={100} />);
    expect(wrapper.find('.button-muted').text()).toContain('Go Back');
  });

  it('adds international shipping fee to the displayed total', () => {
    const wrapper = shallow(<Total isInternational={true} subtotal={100} />);
    expect(wrapper.find('.basket-total-amount').text()).toBe(displayMoney(150));
  });

  it('shows domestic total without fee', () => {
    const wrapper = shallow(<Total isInternational={false} subtotal={100} />);
    expect(wrapper.find('.basket-total-amount').text()).toBe(displayMoney(100));
  });

  it('saves payment details without sensitive fields and goes back to step 2', () => {
    const dispatchSpy = jest.fn();
    const pushSpy = jest.fn();
    useDispatch.mockReturnValue(dispatchSpy);
    useHistory.mockReturnValue({ push: pushSpy });

    const wrapper = shallow(<Total isInternational={false} subtotal={100} />);
    wrapper.find('.button-muted').simulate('click');

    expect(setPaymentDetails).toHaveBeenCalledTimes(1);
    const payload = setPaymentDetails.mock.calls[0][0];
    expect(payload.name).toBe('John');
    expect(payload.cardnumber).toBeUndefined();
    expect(payload.ccv).toBeUndefined();
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'SET_CHECKOUT_PAYMENT_DETAILS',
      payload
    });
    expect(pushSpy).toHaveBeenCalledWith(CHECKOUT_STEP_2);
  });

  it('confirms the order through formik submitForm', () => {
    const submitForm = jest.fn();
    useFormikContext.mockReturnValue({
      values: { type: 'credit' },
      submitForm
    });
    const wrapper = shallow(<Total isInternational={false} subtotal={100} />);
    wrapper.find('.button').last().simulate('click');
    expect(submitForm).toHaveBeenCalledTimes(1);
  });
});
