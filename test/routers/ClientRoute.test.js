import React from 'react';
import { mount } from 'enzyme';

jest.mock('react-redux', () => ({
  connect: () => (Component) => Component
}));

jest.mock('@/components/common', () => ({
  AdminNavigation: () => <div className="mock-admin-nav" />,
  AdminSideBar: () => <div className="mock-admin-sidebar" />
}));

jest.mock('react-router-dom', () => ({
  Route: ({ component: Comp, render: RenderFn, ...rest }) => {
    if (Comp) return <Comp {...rest} />;
    if (RenderFn) return <RenderFn {...rest} />;
    return null;
  },
  Redirect: ({ to }) => <div className="mock-redirect" data-to={typeof to === 'string' ? to : JSON.stringify(to)} />
}));

import ClientRoute from '@/routers/ClientRoute';

const DummyComponent = () => <div className="dummy-component" />;

describe('ClientRoute', () => {
  it('renders component when authenticated as USER', () => {
    const wrapper = mount(<ClientRoute isAuth role="USER" component={DummyComponent} />);
    expect(wrapper.find(DummyComponent).exists()).toBe(true);
  });

  it('renders Redirect to /admin/dashboard when authenticated as ADMIN', () => {
    const wrapper = mount(<ClientRoute isAuth role="ADMIN" component={DummyComponent} />);
    expect(wrapper.find('.mock-redirect').exists()).toBe(true);
    expect(wrapper.find('.mock-redirect').prop('data-to')).toBe('/admin/dashboard');
  });

  it('renders Redirect to /signin when not authenticated', () => {
    const wrapper = mount(<ClientRoute isAuth={false} role="" component={DummyComponent} />);
    expect(wrapper.find('.mock-redirect').exists()).toBe(true);
    const to = JSON.parse(wrapper.find('.mock-redirect').prop('data-to'));
    expect(to.pathname).toBe('/signin');
  });
});
