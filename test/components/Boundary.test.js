import React from 'react';
import { mount } from 'enzyme';
import Boundary from '@/components/common/Boundary';

const ProblemChild = () => {
  throw new Error('Test error');
};

describe('Boundary', () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('renders children normally when no error', () => {
    const wrapper = mount(
      <Boundary>
        <div className="child">Hello</div>
      </Boundary>
    );
    expect(wrapper.find('.child').text()).toBe('Hello');
    expect(wrapper.find('.loader').exists()).toBe(false);
  });

  it('catches errors and shows error message', () => {
    const wrapper = mount(
      <Boundary>
        <ProblemChild />
      </Boundary>
    );
    expect(wrapper.find('.loader').exists()).toBe(true);
    expect(wrapper.find('h3').text()).toBe(':( Something went wrong.');
  });

  it('does not render children after error', () => {
    const wrapper = mount(
      <Boundary>
        <ProblemChild />
      </Boundary>
    );
    expect(wrapper.find(ProblemChild).exists()).toBe(false);
  });
});
