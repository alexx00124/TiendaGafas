import React from 'react';
import { shallow } from 'enzyme';

jest.mock('formik', () => ({
  useFormikContext: jest.fn()
}));

import ShippingTotal from '@/views/checkout/step2/ShippingTotal';
import { useFormikContext } from 'formik';

describe('ShippingTotal', () => {
  beforeEach(() => {
    useFormikContext.mockReturnValue({
      values: { isInternational: false }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const wrapper = shallow(<ShippingTotal subtotal={100} />);
    expect(wrapper.exists()).toBe(true);
  });

  it('displays subtotal', () => {
    const wrapper = shallow(<ShippingTotal subtotal={200} />);
    expect(wrapper.html()).toContain('Subtotal');
  });

  it('shows $0.00 shipping for domestic', () => {
    const wrapper = shallow(<ShippingTotal subtotal={100} />);
    expect(wrapper.html()).toContain('$0.00');
  });

  it('shows $50.00 shipping for international', () => {
    useFormikContext.mockReturnValue({
      values: { isInternational: true }
    });
    const wrapper = shallow(<ShippingTotal subtotal={100} />);
    expect(wrapper.html()).toContain('$50.00');
  });
});
