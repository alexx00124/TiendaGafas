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
  setPaymentDetails: jest.fn()
}));

import Total from '@/views/checkout/step3/Total';
import { useFormikContext } from 'formik';

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
});
