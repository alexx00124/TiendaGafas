import React from 'react';
import { shallow } from 'enzyme';
import AuthStatus from '@/components/common/AuthStatus';

describe('AuthStatus', () => {
  it('renders children when authStatus is null', () => {
    const wrapper = shallow(
      <AuthStatus authStatus={null}>
        <div className="child">Form content</div>
      </AuthStatus>
    );
    expect(wrapper.find('.child').exists()).toBe(true);
  });

  it('renders success message when authStatus.success is true', () => {
    const wrapper = shallow(
      <AuthStatus authStatus={{ success: true, message: 'Signed in!' }}>
        <div className="child">Form content</div>
      </AuthStatus>
    );
    expect(wrapper.find('.toast-success').exists()).toBe(true);
    expect(wrapper.find('.toast-success').text()).toContain('Signed in!');
  });

  it('does not render children when authStatus.success is true', () => {
    const wrapper = shallow(
      <AuthStatus authStatus={{ success: true, message: 'Done' }}>
        <div className="child">Form content</div>
      </AuthStatus>
    );
    expect(wrapper.find('.child').exists()).toBe(false);
  });

  it('renders error message when authStatus has message and success is false', () => {
    const wrapper = shallow(
      <AuthStatus authStatus={{ success: false, message: 'Invalid credentials' }}>
        <div className="child">Form content</div>
      </AuthStatus>
    );
    expect(wrapper.find('.toast-error').exists()).toBe(true);
    expect(wrapper.find('.toast-error').text()).toContain('Invalid credentials');
  });

  it('renders children when authStatus.success is false', () => {
    const wrapper = shallow(
      <AuthStatus authStatus={{ success: false, message: 'Error' }}>
        <div className="child">Form content</div>
      </AuthStatus>
    );
    expect(wrapper.find('.child').exists()).toBe(true);
  });

  it('applies input-error class when authStatus has message and is not success', () => {
    const wrapper = shallow(
      <AuthStatus authStatus={{ success: false, message: 'Error' }}>
        <div className="child">Form</div>
      </AuthStatus>
    );
    expect(wrapper.find('.auth').hasClass('input-error')).toBe(true);
  });

  it('does not apply input-error class when authStatus has no message', () => {
    const wrapper = shallow(
      <AuthStatus authStatus={{ success: false }}>
        <div className="child">Form</div>
      </AuthStatus>
    );
    expect(wrapper.find('.auth').hasClass('input-error')).toBe(false);
  });

  it('renders an icon in success state', () => {
    const wrapper = shallow(
      <AuthStatus authStatus={{ success: true, message: 'Done' }}>
        <div>Form</div>
      </AuthStatus>
    );
    const successDiv = wrapper.find('.toast-success');
    expect(successDiv.children().length).toBeGreaterThanOrEqual(1);
  });

  it('renders auth-content wrapper', () => {
    const wrapper = shallow(
      <AuthStatus authStatus={null}>
        <div>Form</div>
      </AuthStatus>
    );
    expect(wrapper.find('.auth-content').exists()).toBe(true);
  });

  it('renders loader div when success', () => {
    const wrapper = shallow(
      <AuthStatus authStatus={{ success: true, message: 'OK' }}>
        <div>Form</div>
      </AuthStatus>
    );
    expect(wrapper.find('.loader').exists()).toBe(true);
  });

  it('does not render .auth when success', () => {
    const wrapper = shallow(
      <AuthStatus authStatus={{ success: true, message: 'OK' }}>
        <div>Form</div>
      </AuthStatus>
    );
    expect(wrapper.find('.auth').exists()).toBe(false);
  });
});
