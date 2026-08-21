import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

jest.mock('@/views/account/components/UserTab', () => (
  ({ children }) => <div className="mock-user-tab">{children}</div>
));

jest.mock('@/views/account/components/UserAccountTab', () => () => (
  <div className="mock-account-tab" />
));

jest.mock('@/views/account/components/UserWishListTab', () => () => (
  <div className="mock-wishlist-tab" />
));

jest.mock('@/views/account/components/UserOrdersTab', () => () => (
  <div className="mock-orders-tab" />
));

jest.mock('@/hooks', () => ({
  useDocumentTitle: jest.fn(),
  useScrollTop: jest.fn()
}));

import UserAccount from '@/views/account/user_account';

// Lazy chunks may resolve over several event-loop turns under load;
// flush repeatedly until the tabs render (bounded to avoid hangs).
const mountWithTabsSettled = async () => {
  const wrapper = mount(<UserAccount />);
  for (let i = 0; i < 10 && !wrapper.find('.mock-orders-tab').exists(); i += 1) {
    /* eslint-disable no-await-in-loop */
    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
    });
    wrapper.update();
    /* eslint-enable no-await-in-loop */
  }
  return wrapper;
};

describe('User Account view', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the three account tabs with their labels', async () => {
    const wrapper = await mountWithTabsSettled();

    const labels = wrapper.find('.mock-user-tab > div').map((tab) => tab.prop('label'));
    expect(labels).toEqual(['Account', 'My Wish List', 'My Orders']);

    expect(wrapper.find('.mock-account-tab').exists()).toBe(true);
    expect(wrapper.find('.mock-wishlist-tab').exists()).toBe(true);
    expect(wrapper.find('.mock-orders-tab').exists()).toBe(true);
    wrapper.unmount();
  });
});
