import React from 'react';
import { shallow } from 'enzyme';
import PageNotFound from '@/views/error/PageNotFound';

jest.mock('@/hooks', () => ({
  useScrollTop: jest.fn()
}));

describe('PageNotFound', () => {
  const mockHistory = { goBack: jest.fn() };

  beforeEach(() => {
    mockHistory.goBack.mockClear();
  });

  it('renders not found message', () => {
    const wrapper = shallow(<PageNotFound history={mockHistory} />);
    expect(wrapper.find('h1').text()).toContain("doesn't exists");
  });

  it('renders a go back button', () => {
    const wrapper = shallow(<PageNotFound history={mockHistory} />);
    expect(wrapper.find('.button').exists()).toBe(true);
    expect(wrapper.find('.button').text()).toBe('Go back');
  });

  it('calls history.goBack on button click', () => {
    const wrapper = shallow(<PageNotFound history={mockHistory} />);
    wrapper.find('.button').simulate('click');
    expect(mockHistory.goBack).toHaveBeenCalledTimes(1);
  });
});
