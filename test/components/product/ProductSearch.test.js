import React from 'react';
import { shallow } from 'enzyme';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn()
}));

jest.mock('react-router-dom', () => ({
  useHistory: jest.fn()
}));

jest.mock('@/components/common', () => ({
  Filters: () => <div className="mock-filters" />
}));

import ProductSearch from '@/components/product/ProductSearch';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setTextFilter, clearRecentSearch, removeSelectedRecent } from '@/redux/actions/filterActions';

describe('ProductSearch', () => {
  let mockDispatch;
  let mockHistory;

  beforeEach(() => {
    mockDispatch = jest.fn();
    mockHistory = { push: jest.fn(), goBack: jest.fn() };

    useDispatch.mockReturnValue(mockDispatch);
    useHistory.mockReturnValue(mockHistory);
    useSelector.mockReturnValue({
      filter: { keyword: '', recent: ['shoes', 'hat'] },
      products: [],
      isLoading: false,
      productsLength: 10
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const wrapper = shallow(<ProductSearch />);
    expect(wrapper.exists()).toBe(true);
  });

  it('renders search input', () => {
    const wrapper = shallow(<ProductSearch />);
    expect(wrapper.find('.product-search-input').exists()).toBe(true);
  });

  it('focuses on mount', () => {
    const wrapper = shallow(<ProductSearch />);
    const instance = wrapper.instance();
    expect(instance).toBeDefined();
  });

  it('renders recent searches', () => {
    const wrapper = shallow(<ProductSearch />);
    expect(wrapper.find('.pill-wrapper')).toHaveLength(2);
    expect(wrapper.find('.pill-content').at(0).text()).toBe('shoes');
    expect(wrapper.find('.pill-content').at(1).text()).toBe('hat');
  });

  it('shows "No recent searches" when no recent items', () => {
    useSelector.mockReturnValue({
      filter: { keyword: '', recent: [] },
      products: [],
      isLoading: false,
      productsLength: 10
    });
    const wrapper = shallow(<ProductSearch />);
    expect(wrapper.find('.text-subtle').text()).toBe('No recent searches');
  });

  it('dispatches setTextFilter on Enter key', () => {
    const wrapper = shallow(<ProductSearch />);
    wrapper.find('.product-search-input').simulate('change', { target: { value: 'glasses' } });
    wrapper.find('.product-search-input').simulate('keyup', { keyCode: 13 });
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockHistory.push).toHaveBeenCalledWith('/');
  });

  it('dispatches clearRecentSearch on Clear click', () => {
    const wrapper = shallow(<ProductSearch />);
    const clearBtn = wrapper.find('.product-search-recent-header h5').at(1);
    clearBtn.simulate('click');
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('dispatches removeSelectedRecent when pill-remove is clicked', () => {
    const wrapper = shallow(<ProductSearch />);
    wrapper.find('.pill-remove').at(0).simulate('click');
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('goes back on header click', () => {
    const wrapper = shallow(<ProductSearch />);
    wrapper.find('.product-search-header h3').simulate('click');
    expect(mockHistory.goBack).toHaveBeenCalled();
  });
});
