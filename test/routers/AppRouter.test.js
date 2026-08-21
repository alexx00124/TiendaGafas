import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

jest.mock('@/views', () => ({
  Home: () => <div className="mock-view-home" />,
  Search: () => <div className="mock-view-search" />,
  Shop: () => <div className="mock-view-shop" />,
  FeaturedProducts: () => <div className="mock-view-featured" />,
  RecommendedProducts: () => <div className="mock-view-recommended" />,
  SignUp: () => <div className="mock-view-signup" />,
  SignIn: () => <div className="mock-view-signin" />,
  ForgotPassword: () => <div className="mock-view-forgot-password" />,
  ViewProduct: () => <div className="mock-view-product" />,
  UserAccount: () => <div className="mock-view-user-account" />,
  EditAccount: () => <div className="mock-view-edit-account" />,
  CheckOutStep1: () => <div className="mock-view-checkout-1" />,
  CheckOutStep2: () => <div className="mock-view-checkout-2" />,
  CheckOutStep3: () => <div className="mock-view-checkout-3" />,
  Dashboard: () => <div className="mock-view-dashboard" />,
  Products: () => <div className="mock-view-admin-products" />,
  AddProduct: () => <div className="mock-view-add-product" />,
  EditProduct: () => <div className="mock-view-edit-product" />,
  PageNotFound: () => <div className="mock-view-not-found" />
}));

jest.mock('@/components/common', () => ({
  Navigation: () => <div className="mock-navigation" />,
  Footer: () => <div className="mock-footer" />,
  AdminNavigation: () => <div className="mock-admin-nav" />,
  AdminSideBar: () => <div className="mock-admin-sidebar" />
}));

jest.mock('@/components/basket', () => ({
  Basket: () => <div className="mock-basket" />
}));

import AppRouter, { history } from '@/routers/AppRouter';

const mountedWrappers = [];

const renderAppAtPath = (path, auth = null) => {
  history.push(path);
  const store = createStore(() => ({ auth }));
  const wrapper = mount(
    <Provider store={store}>
      <AppRouter />
    </Provider>
  );
  wrapper.update();
  mountedWrappers.push(wrapper);
  return wrapper;
};

describe('AppRouter', () => {
  afterEach(() => {
    while (mountedWrappers.length) {
      mountedWrappers.pop().unmount();
    }
  });

  it('renders navigation, basket and footer chrome around the routes', () => {
    const wrapper = renderAppAtPath('/');
    expect(wrapper.find('.mock-navigation').exists()).toBe(true);
    expect(wrapper.find('.mock-basket').exists()).toBe(true);
    expect(wrapper.find('.mock-footer').exists()).toBe(true);
  });

  it('renders Home view at root path', () => {
    const wrapper = renderAppAtPath('/');
    expect(wrapper.find('.mock-view-home').exists()).toBe(true);
  });

  it('renders Shop view at /shop', () => {
    const wrapper = renderAppAtPath('/shop');
    expect(wrapper.find('.mock-view-shop').exists()).toBe(true);
  });

  it('renders Search view for /search/:searchKey', () => {
    const wrapper = renderAppAtPath('/search/glasses');
    expect(wrapper.find('.mock-view-search').exists()).toBe(true);
  });

  it('renders ViewProduct view for /product/:id', () => {
    const wrapper = renderAppAtPath('/product/abc123');
    expect(wrapper.find('.mock-view-product').exists()).toBe(true);
  });

  it('renders SignIn view for unauthenticated user at /signin', () => {
    const wrapper = renderAppAtPath('/signin');
    expect(wrapper.find('.mock-view-signin').exists()).toBe(true);
  });

  it('redirects unauthenticated user from /account to /signin', () => {
    const wrapper = renderAppAtPath('/account');
    expect(wrapper.find('.mock-view-user-account').exists()).toBe(false);
    expect(wrapper.find('.mock-view-signin').exists()).toBe(true);
  });

  it('renders UserAccount view for authenticated USER at /account', () => {
    const wrapper = renderAppAtPath('/account', { role: 'USER' });
    expect(wrapper.find('.mock-view-user-account').exists()).toBe(true);
  });

  it('redirects authenticated USER visiting /signin back to where they came from', () => {
    const wrapper = renderAppAtPath('/signin', { role: 'USER' });
    expect(wrapper.find('.mock-view-signin').exists()).toBe(false);
    expect(wrapper.find('.mock-view-home').exists()).toBe(true);
  });

  it('redirects authenticated ADMIN from /account to admin dashboard', () => {
    const wrapper = renderAppAtPath('/account', { role: 'ADMIN' });
    expect(wrapper.find('.mock-view-user-account').exists()).toBe(false);
    expect(wrapper.find('.mock-view-dashboard').exists()).toBe(true);
  });

  it('renders admin Products view with admin chrome for authenticated ADMIN at /admin/products', () => {
    const wrapper = renderAppAtPath('/admin/products', { role: 'ADMIN' });
    expect(wrapper.find('.mock-view-admin-products').exists()).toBe(true);
    expect(wrapper.find('.mock-admin-nav').exists()).toBe(true);
    expect(wrapper.find('.mock-admin-sidebar').exists()).toBe(true);
  });

  it('renders EditProduct view with product id param for authenticated ADMIN', () => {
    const wrapper = renderAppAtPath('/admin/edit/42', { role: 'ADMIN' });
    expect(wrapper.find('.mock-view-edit-product').exists()).toBe(true);
  });

  it('renders PageNotFound view for unknown paths', () => {
    const wrapper = renderAppAtPath('/does-not-exist');
    expect(wrapper.find('.mock-view-not-found').exists()).toBe(true);
  });
});
