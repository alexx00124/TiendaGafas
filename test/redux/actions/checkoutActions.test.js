import {
  setShippingDetails,
  setPaymentDetails,
  resetCheckout
} from '@/redux/actions/checkoutActions';
import * as types from '@/constants/constants';

describe('checkoutActions', () => {
  it('should create setShippingDetails action', () => {
    const details = { address: '123 Main St', city: 'Buenos Aires' };
    expect(setShippingDetails(details)).toEqual({
      type: types.SET_CHECKOUT_SHIPPING_DETAILS,
      payload: details
    });
  });

  it('should create setPaymentDetails action', () => {
    const details = { card: '4111111111111111', expiry: '12/25' };
    expect(setPaymentDetails(details)).toEqual({
      type: types.SET_CHECKOUT_PAYMENT_DETAILS,
      payload: details
    });
  });

  it('should create resetCheckout action', () => {
    expect(resetCheckout()).toEqual({ type: types.RESET_CHECKOUT });
  });
});
