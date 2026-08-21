import React from 'react';
import { mount } from 'enzyme';


jest.mock('@/views/checkout/hoc/withCheckout', () => ({
  __esModule: true,
  default: jest.fn((Component) => Component)
}));

jest.mock('@/views/checkout/components', () => ({
  StepTracker: ({ current }) => <div className="mock-tracker" data-current={current} />
}));

jest.mock('@/views/checkout/step3/CreditPayment', () => () => <div className="mock-credit-payment" />);

jest.mock('@/views/checkout/step3/PayPalPayment', () => () => <div className="mock-paypal-payment" />);

jest.mock('@/views/checkout/step3/Total', () => (
  ({ isInternational, subtotal }) => (
    <div className="mock-total" data-international={isInternational} data-subtotal={subtotal} />
  )
));

jest.mock('@/helpers/utils', () => ({
  displayActionMessage: jest.fn()
}));

jest.mock('react-router-dom', () => ({
  Redirect: ({ to }) => <div className="mock-redirect" data-to={to} />
}));

jest.mock('@/hooks', () => ({
  useDocumentTitle: jest.fn(),
  useScrollTop: jest.fn()
}));

import Payment from '@/views/checkout/step3';
import { displayActionMessage } from '@/helpers/utils';
import { CHECKOUT_STEP_1 } from '@/constants/routes';

const doneShipping = { isDone: true, isInternational: false };
const emptyPayment = { type: 'paypal', name: '', cardnumber: '', expiry: '', ccv: '' };

const render = (extra = {}) => mount(
  <Payment
    shipping={doneShipping}
    payment={emptyPayment}
    subtotal={250}
    {...extra}
  />
);

describe('Checkout Step 3 - Payment', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redirects back to step 1 when shipping was not completed', () => {
    const wrapper = render({ shipping: { isDone: false, isInternational: false } });
    expect(wrapper.find('.mock-redirect').prop('data-to')).toBe(CHECKOUT_STEP_1);
    expect(wrapper.find('.mock-tracker').exists()).toBe(false);
  });

  it('redirects back to step 1 when shipping state is missing entirely', () => {
    const wrapper = render({ shipping: undefined });
    expect(wrapper.find('.mock-redirect').prop('data-to')).toBe(CHECKOUT_STEP_1);
  });

  it('renders step tracker on step 3 with both payment options and total', () => {
    const wrapper = render();
    expect(wrapper.find('.mock-tracker').prop('data-current')).toBe(3);
    expect(wrapper.find('.mock-credit-payment').exists()).toBe(true);
    expect(wrapper.find('.mock-paypal-payment').exists()).toBe(true);
    expect(wrapper.find('.mock-total').props()).toMatchObject({
      'data-international': false,
      'data-subtotal': 250
    });
  });

  it('passes international flag through to Total', () => {
    const wrapper = render({ shipping: { isDone: true, isInternational: true } });
    expect(wrapper.find('.mock-total').prop('data-international')).toBe(true);
  });

  it('notifies that paypal is not ready when validating with paypal mode', () => {
    const wrapper = render();
    wrapper.find('Formik').prop('validate')({ type: 'paypal' });
    expect(displayActionMessage).toHaveBeenCalledWith('Feature not ready yet :)', 'info');
  });

  it('does not notify when validating with credit mode', () => {
    const wrapper = render();
    wrapper.find('Formik').prop('validate')({ type: 'credit' });
    expect(displayActionMessage).not.toHaveBeenCalled();
  });

  it('shows feature-not-ready message on confirm submit', () => {
    const wrapper = render();
    wrapper.find('Formik').prop('onSubmit')();
    expect(displayActionMessage).toHaveBeenCalledWith('Feature not ready yet :)', 'info');
  });
});
