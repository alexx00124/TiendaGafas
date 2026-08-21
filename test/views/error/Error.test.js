import React from 'react';
import { shallow } from 'enzyme';
import Error from '@/views/error/Error';

jest.mock('@/hooks', () => ({
  useScrollTop: jest.fn()
}));

describe('Error', () => {
  const mockHistory = { push: jest.fn() };

  beforeEach(() => {
    mockHistory.push.mockClear();
  });

  it('renders error message', () => {
    const wrapper = shallow(<Error history={mockHistory} />);
    expect(wrapper.find('h1').text()).toContain('An error has occured');
  });

  it('renders a try again button', () => {
    const wrapper = shallow(<Error history={mockHistory} />);
    expect(wrapper.find('.button').exists()).toBe(true);
    expect(wrapper.find('.button').text()).toBe('Try Again');
  });

  it('calls history.push("/") on button click', () => {
    const wrapper = shallow(<Error history={mockHistory} />);
    wrapper.find('.button').simulate('click');
    expect(mockHistory.push).toHaveBeenCalledWith('/');
  });
});
