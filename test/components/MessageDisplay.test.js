import React from 'react';
import { shallow } from 'enzyme';
import MessageDisplay from '@/components/common/MessageDisplay';

describe('MessageDisplay', () => {
  it('renders the provided message', () => {
    const wrapper = shallow(
      <MessageDisplay message="Hello World" />
    );
    expect(wrapper.find('h2').text()).toBe('Hello World');
  });

  it('renders "Message" as fallback when message is empty', () => {
    const wrapper = shallow(
      <MessageDisplay message="" />
    );
    expect(wrapper.find('h2').text()).toBe('Message');
  });

  it('renders description when provided', () => {
    const wrapper = shallow(
      <MessageDisplay message="Error" description="Something broke" />
    );
    expect(wrapper.find('span').text()).toBe('Something broke');
  });

  it('does not render description when not provided', () => {
    const wrapper = shallow(
      <MessageDisplay message="Error" />
    );
    expect(wrapper.find('span').exists()).toBe(false);
  });

  it('renders button when action is provided', () => {
    const action = jest.fn();
    const wrapper = shallow(
      <MessageDisplay message="Oops" action={action} />
    );
    expect(wrapper.find('button').exists()).toBe(true);
  });

  it('does not render button when action is not provided', () => {
    const wrapper = shallow(
      <MessageDisplay message="Oops" />
    );
    expect(wrapper.find('button').exists()).toBe(false);
  });

  it('calls action when button is clicked', () => {
    const action = jest.fn();
    const wrapper = shallow(
      <MessageDisplay message="Oops" action={action} />
    );
    wrapper.find('button').simulate('click');
    expect(action).toHaveBeenCalledTimes(1);
  });

  it('uses default button label "Okay"', () => {
    const wrapper = shallow(
      <MessageDisplay message="Oops" action={() => {}} />
    );
    expect(wrapper.find('button').text()).toBe('Okay');
  });

  it('uses custom button label when provided', () => {
    const wrapper = shallow(
      <MessageDisplay message="Oops" action={() => {}} buttonLabel="Confirm" />
    );
    expect(wrapper.find('button').text()).toBe('Confirm');
  });

  it('renders the loader div wrapper', () => {
    const wrapper = shallow(
      <MessageDisplay message="Test" />
    );
    expect(wrapper.find('.loader').exists()).toBe(true);
  });
});
