import React from 'react';
import { shallow } from 'enzyme';

jest.mock('@/hooks', () => ({
  useDocumentTitle: jest.fn(),
  useScrollTop: jest.fn()
}));

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(() => jest.fn())
}));

jest.mock('react-router-dom', () => ({
  useHistory: jest.fn(() => ({ push: jest.fn() }))
}));

jest.mock('@/views/checkout/hoc/withCheckout', () => {
  const React = require('react');
  return (Component) => {
    const Wrapped = (props) => (
      <Component {...props} basket={[{ id: '1', name: 'Shades', price: 50, quantity: 1 }]} subtotal={50} />
    );
    Wrapped.displayName = 'WithCheckout';
    return Wrapped;
  };
});

jest.mock('@/views/checkout/components', () => {
  const React = require('react');
  return {
    StepTracker: ({ current }) => <div className="step-tracker" data-current={current} />
  };
});

jest.mock('@/components/basket', () => {
  const React = require('react');
  return {
    BasketItem: () => <div className="mock-basket-item" />
  };
});

import Step1 from '@/views/checkout/step1/index';

describe('Checkout Step 1 - OrderSummary', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<Step1 />);
    expect(wrapper.exists()).toBe(true);
  });

  it('renders StepTracker after diving through HOC', () => {
    const wrapper = shallow(<Step1 />);
    const inner = wrapper.dive();
    expect(inner.find('StepTracker').exists()).toBe(true);
  });

  it('renders Order Summary heading after diving through HOC', () => {
    const wrapper = shallow(<Step1 />);
    const inner = wrapper.dive();
    expect(inner.find('h3').text()).toContain('Order Summary');
  });
});
