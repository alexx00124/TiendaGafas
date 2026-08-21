import React from 'react';
import { mount } from 'enzyme';

jest.mock('react-redux', () => ({
  connect: () => (Component) => Component
}));

jest.mock('@/components/common', () => ({
  AdminNavigation: () => <div className="mock-admin-nav" />,
  AdminSideBar: () => <div className="mock-admin-sidebar" />
}));

jest.mock('react-router-dom', () => {
  const Redirect = ({ to }) => <div className="mock-redirect" data-to={typeof to === 'string' ? to : JSON.stringify(to)} />;
  const Route = ({ component: Comp, render: RenderFn, ...rest }) => {
    // PublicRoute spreads { location } into Route via ...rest
    // AdminRoute/ClientRoute use component prop
    const routeProps = { location: rest.location || { pathname: '/', state: null }, match: {}, history: {} };
    if (Comp) return <Comp {...rest} />;
    if (RenderFn) return <RenderFn {...routeProps} />;
    return null;
  };
  return { Route, Redirect };
});

import PublicRoute from '@/routers/PublicRoute';

const DummyComponent = () => <div className="dummy-component" />;

describe('PublicRoute', () => {
  it('renders component when not authenticated', () => {
    const wrapper = mount(<PublicRoute isAuth={false} role="" component={DummyComponent} path="/signin" />);
    expect(wrapper.find(DummyComponent).exists()).toBe(true);
  });

  it('renders Redirect to admin dashboard when authenticated as ADMIN', () => {
    const wrapper = mount(<PublicRoute isAuth role="ADMIN" component={DummyComponent} path="/signin" />);
    expect(wrapper.find('.mock-redirect').exists()).toBe(true);
    expect(wrapper.find('.mock-redirect').prop('data-to')).toBe('/admin/dashboard');
  });

  it('renders Redirect to "from" location when authenticated as USER on /signin', () => {
    const from = { pathname: '/shop' };
    const wrapper = mount(
      <PublicRoute
        isAuth
        role="USER"
        component={DummyComponent}
        path="/signin"
        location={{ state: { from } }}
      />
    );
    expect(wrapper.find('.mock-redirect').exists()).toBe(true);
    expect(wrapper.find('.mock-redirect').prop('data-to')).toEqual(JSON.stringify(from));
  });

  it('renders component when authenticated as USER on unrestricted path', () => {
    const wrapper = mount(<PublicRoute isAuth role="USER" component={DummyComponent} path="/about" />);
    expect(wrapper.find(DummyComponent).exists()).toBe(true);
  });
});
