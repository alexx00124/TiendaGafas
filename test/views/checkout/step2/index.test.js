import React from 'react';
import { mount } from 'enzyme';

const mockDispatch = jest.fn();
const mockPush = jest.fn();

jest.mock('@/views/checkout/hoc/withCheckout', () => ({
  __esModule: true,
  default: jest.fn((Component) => Component)
}));

jest.mock('@/views/checkout/components', () => ({
  StepTracker: ({ current }) => <div className="mock-tracker" data-current={current} />
}));

jest.mock('@/views/checkout/step2/ShippingForm', () => () => <div className="mock-shipping-form" />);

jest.mock('@/views/checkout/step2/ShippingTotal', () => (
  ({ subtotal }) => <div className="mock-shipping-total" data-subtotal={subtotal} />
));

jest.mock('@/components/common', () => ({
  Boundary: ({ children }) => <div>{children}</div>
}));

jest.mock('@/hooks', () => ({
  useDocumentTitle: jest.fn(),
  useScrollTop: jest.fn()
}));

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(() => mockDispatch)
}));

jest.mock('react-router-dom', () => ({
  useHistory: jest.fn(() => ({ push: mockPush }))
}));

jest.mock('@/redux/actions/checkoutActions', () => ({
  setShippingDetails: jest.fn((payload) => ({ type: 'SET_CHECKOUT_SHIPPING_DETAILS', payload }))
}));

import ShippingDetails from '@/views/checkout/step2';
import { setShippingDetails } from '@/redux/actions/checkoutActions';
import { CHECKOUT_STEP_1, CHECKOUT_STEP_3 } from '@/constants/routes';

const emptyShipping = {};
const filledProfile = {
  fullname: 'Profile Name',
  email: 'profile@mail.com',
  address: 'Profile Address',
  mobile: { dialCode: '+54', value: '555' }
};

const render = (extra = {}) => mount(
  <ShippingDetails
    profile={filledProfile}
    shipping={emptyShipping}
    subtotal={250}
    {...extra}
  />
);

describe('Checkout Step 2 - ShippingDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders step tracker on step 2 with shipping form and total', () => {
    const wrapper = render();
    expect(wrapper.find('.mock-tracker').prop('data-current')).toBe(2);
    expect(wrapper.find('.mock-shipping-form').exists()).toBe(true);
    expect(wrapper.find('.mock-shipping-total').prop('data-subtotal')).toBe(250);
  });

  it('prefers saved shipping details over profile for initial values', () => {
    const wrapper = render({
      shipping: { fullname: 'Ship Name', email: 'ship@mail.com', address: 'Ship Address' }
    });
    const initialValues = wrapper.find('Formik').prop('initialValues');
    expect(initialValues.fullname).toBe('Ship Name');
    expect(initialValues.email).toBe('ship@mail.com');
    expect(initialValues.address).toBe('Ship Address');
    expect(initialValues.isDone).toBe(false);
  });

  it('falls back to profile details when shipping is empty', () => {
    const wrapper = render();
    const initialValues = wrapper.find('Formik').prop('initialValues');
    expect(initialValues.fullname).toBe('Profile Name');
    expect(initialValues.email).toBe('profile@mail.com');
    expect(initialValues.address).toBe('Profile Address');
    expect(initialValues.mobile).toEqual(filledProfile.mobile);
  });

  it('dispatches shipping details marked as done and advances to step 3 on submit', () => {
    const wrapper = render();
    wrapper.find('Formik').prop('onSubmit')({
      fullname: 'Jane Doe',
      email: 'jane@mail.com',
      address: 'Fake Street 123',
      mobile: { dialCode: '+1', value: '5551234' },
      isInternational: true
    });

    expect(setShippingDetails).toHaveBeenCalledTimes(1);
    expect(setShippingDetails).toHaveBeenCalledWith({
      fullname: 'Jane Doe',
      email: 'jane@mail.com',
      address: 'Fake Street 123',
      mobile: { dialCode: '+1', value: '5551234' },
      isInternational: true,
      isDone: true
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_CHECKOUT_SHIPPING_DETAILS',
      payload: expect.objectContaining({ isDone: true })
    });
    expect(mockPush).toHaveBeenCalledWith(CHECKOUT_STEP_3);
  });

  it('goes back to step 1 when Go Back is clicked', () => {
    const wrapper = render();
    wrapper.find('.button-muted').simulate('click');
    expect(mockPush).toHaveBeenCalledWith(CHECKOUT_STEP_1);
  });
});
