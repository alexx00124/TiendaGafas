import React from 'react';
import { mount } from 'enzyme';

jest.mock('react-redux', () => ({
  useSelector: jest.fn()
}));

jest.mock('react-router-dom', () => ({
  withRouter: (C) => C,
  Redirect: ({ to }) => <div className="mock-redirect" data-to={to} />
}));

import { useSelector } from 'react-redux';
import withCheckout from '@/views/checkout/hoc/withCheckout';
import { HOME, SIGNIN } from '@/constants/routes';

const Dummy = () => <div className="dummy-component" />;

const buildStore = ({ auth = {}, basket = [], shipping = {}, payment = {}, profile = {} } = {}) => ({
  auth,
  basket,
  checkout: { shipping, payment },
  profile
});

const renderHOC = (store) => {
  useSelector.mockImplementation((selector) => selector(store));
  const Wrapped = withCheckout(Dummy);
  return mount(<Wrapped />);
};

describe('withCheckout HOC', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redirects to SIGNIN when user is not authenticated', () => {
    const wrapper = renderHOC(buildStore({ auth: { id: '' } }));
    expect(wrapper.find('.mock-redirect').prop('data-to')).toBe(SIGNIN);
  });

  it('treats user as unauthenticated when auth.id exists but role is missing', () => {
    const wrapper = renderHOC(buildStore({ auth: { id: 'abc', role: '' } }));
    expect(wrapper.find('.mock-redirect').prop('data-to')).toBe(SIGNIN);
  });

  it('redirects to home when authenticated but basket is empty', () => {
    const wrapper = renderHOC(buildStore({
      auth: { id: 'abc', role: 'USER' },
      basket: []
    }));
    expect(wrapper.find('.mock-redirect').prop('data-to')).toBe(HOME);
  });

  it('renders wrapped component with checkout props when authenticated with items', () => {
    const shippingState = { fullname: 'Jane', isInternational: false };
    const paymentState = { type: 'paypal' };
    const profileState = { fullname: 'Jane Doe' };
    const basketState = [{ price: 100, quantity: 2 }];
    const wrapper = renderHOC(buildStore({
      auth: { id: 'abc', role: 'USER' },
      basket: basketState,
      shipping: shippingState,
      payment: paymentState,
      profile: profileState
    }));

    expect(wrapper.find('.dummy-component').exists()).toBe(true);
    const props = wrapper.find(Dummy).props();
    expect(props.basket).toEqual(basketState);
    expect(props.shipping).toEqual(shippingState);
    expect(props.payment).toEqual(paymentState);
    expect(props.profile).toEqual(profileState);
  });

  it('computes subtotal without fee for domestic shipping', () => {
    const wrapper = renderHOC(buildStore({
      auth: { id: 'abc', role: 'USER' },
      basket: [
        { price: 100, quantity: 2 },
        { price: 50, quantity: 1 }
      ],
      shipping: { isInternational: false }
    }));
    expect(wrapper.find(Dummy).prop('subtotal')).toBe(250);
  });

  it('adds international shipping fee to subtotal', () => {
    const wrapper = renderHOC(buildStore({
      auth: { id: 'abc', role: 'USER' },
      basket: [
        { price: 100, quantity: 2 },
        { price: 50, quantity: 1 }
      ],
      shipping: { isInternational: true }
    }));
    expect(wrapper.find(Dummy).prop('subtotal')).toBe(300);
  });
});
