import React from 'react';
import { shallow } from 'enzyme';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

jest.mock('react-router-dom', () => ({
  useHistory: jest.fn()
}));

import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import SearchBar from '@/components/common/SearchBar';

describe('SearchBar', () => {
  let mockDispatch;
  let mockHistory;

  beforeEach(() => {
    mockDispatch = jest.fn();
    mockHistory = { push: jest.fn() };
    useDispatch.mockReturnValue(mockDispatch);
    useHistory.mockReturnValue(mockHistory);
    useSelector.mockImplementation((selector) =>
      selector({
        filter: { recent: [] },
        app: { loading: false }
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const wrapper = shallow(<SearchBar />);
    expect(wrapper.exists()).toBe(true);
  });

  it('renders the searchbar div', () => {
    const wrapper = shallow(<SearchBar />);
    expect(wrapper.find('.searchbar').exists()).toBe(true);
  });

  it('renders the search input', () => {
    const wrapper = shallow(<SearchBar />);
    expect(wrapper.find('.searchbar-input').exists()).toBe(true);
  });

  it('renders the SearchOutlined icon', () => {
    const wrapper = shallow(<SearchBar />);
    expect(wrapper.find('.searchbar-icon').exists()).toBe(true);
  });

  it('updates searchInput on change', () => {
    const wrapper = shallow(<SearchBar />);
    wrapper.find('.searchbar-input').simulate('change', { target: { value: 'shoes' } });
    expect(wrapper.find('.searchbar-input').prop('value')).toBe('shoes');
  });

  it('renders recent searches when filter.recent has items', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        filter: { recent: ['shoes', 'hat'] },
        app: { loading: false }
      })
    );
    const wrapper = shallow(<SearchBar />);
    expect(wrapper.find('.searchbar-recent').exists()).toBe(true);
    expect(wrapper.find('.searchbar-recent-keyword').length).toBe(2);
  });

  it('does not render recent searches when filter.recent is empty', () => {
    const wrapper = shallow(<SearchBar />);
    expect(wrapper.find('.searchbar-recent').exists()).toBe(false);
  });

  it('sets input as readOnly when loading', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        filter: { recent: [] },
        app: { loading: true }
      })
    );
    const wrapper = shallow(<SearchBar />);
    expect(wrapper.find('.searchbar-input').prop('readOnly')).toBe(true);
  });
});
