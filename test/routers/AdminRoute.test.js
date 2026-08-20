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

import AdminRoute from '@/routers/AdminRoute';

const DummyComponent = () => <div className="dummy-component" />;

describe('AdminRoute', () => {
  it('renders component when authenticated and admin', () => {
    const wrapper = mount(<AdminRoute isAuth role="ADMIN" component={DummyComponent} />);
    expect(wrapper.find(DummyComponent).exists()).toBe(true);
    expect(wrapper.find('.mock-admin-nav').exists()).toBe(true);
    expect(wrapper.find('.mock-admin-sidebar').exists()).toBe(true);
  });

  it('renders Redirect to / when not admin', () => {
    const wrapper = mount(<AdminRoute isAuth role="USER" component={DummyComponent} />);
    expect(wrapper.find('.mock-redirect').exists()).toBe(true);
    expect(wrapper.find('.mock-redirect').prop('data-to')).toBe('/');
  });

  it('renders Redirect to / when not authenticated', () => {
    const wrapper = mount(<AdminRoute isAuth={false} role="" component={DummyComponent} />);
    expect(wrapper.find('.mock-redirect').exists()).toBe(true);
    expect(wrapper.find('.mock-redirect').prop('data-to')).toBe('/');
  });
});
