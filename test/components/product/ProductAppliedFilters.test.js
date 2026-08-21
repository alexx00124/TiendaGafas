import React from 'react';
import { shallow } from 'enzyme';
import ProductAppliedFilters from '@/components/product/ProductAppliedFilters';
import * as reactRedux from 'react-redux';
import { applyFilter } from '@/redux/actions/filterActions';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
  shallowEqual: jest.requireActual('react-redux').shallowEqual
}));

const mockDispatch = jest.fn();
reactRedux.useDispatch.mockReturnValue(mockDispatch);

describe('ProductAppliedFilters', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
  });

  it('returns null when no filters are applied', () => {
    reactRedux.useSelector.mockReturnValue({
      keyword: '', brand: '', minPrice: 0, maxPrice: 0, sortBy: ''
    });
    const wrapper = shallow(<ProductAppliedFilters filteredProductsCount={0} />);
    expect(wrapper.isEmptyRender()).toBe(true);
  });

  it('renders keyword filter pill', () => {
    reactRedux.useSelector.mockReturnValue({
      keyword: 'ray-ban', brand: '', minPrice: 0, maxPrice: 0, sortBy: ''
    });
    const wrapper = shallow(<ProductAppliedFilters filteredProductsCount={3} />);
    expect(wrapper.text()).toContain('ray-ban');
    expect(wrapper.text()).toContain('Keyword');
  });

  it('renders brand filter pill', () => {
    reactRedux.useSelector.mockReturnValue({
      keyword: '', brand: 'Ray-Ban', minPrice: 0, maxPrice: 0, sortBy: ''
    });
    const wrapper = shallow(<ProductAppliedFilters filteredProductsCount={2} />);
    expect(wrapper.text()).toContain('Ray-Ban');
    expect(wrapper.text()).toContain('Brand');
  });

  it('renders sort filter pill', () => {
    reactRedux.useSelector.mockReturnValue({
      keyword: '', brand: '', minPrice: 0, maxPrice: 0, sortBy: 'price-desc'
    });
    const wrapper = shallow(<ProductAppliedFilters filteredProductsCount={1} />);
    expect(wrapper.text()).toContain('Price High - Low');
    expect(wrapper.text()).toContain('Sort By');
  });

  it('renders price range filter pill', () => {
    reactRedux.useSelector.mockReturnValue({
      keyword: '', brand: '', minPrice: 50, maxPrice: 200, sortBy: ''
    });
    const wrapper = shallow(<ProductAppliedFilters filteredProductsCount={5} />);
    expect(wrapper.text()).toContain('$50');
    expect(wrapper.text()).toContain('$200');
  });

  it('dispatches applyFilter when keyword remove button is clicked', () => {
    reactRedux.useSelector.mockReturnValue({
      keyword: 'ray-ban', brand: '', minPrice: 0, maxPrice: 0, sortBy: ''
    });
    const wrapper = shallow(<ProductAppliedFilters filteredProductsCount={1} />);
    wrapper.find('.pill-remove').at(0).simulate('click');
    expect(mockDispatch).toHaveBeenCalledWith(applyFilter({ keyword: '' }));
  });

  it('dispatches applyFilter when brand remove button is clicked', () => {
    reactRedux.useSelector.mockReturnValue({
      keyword: '', brand: 'Ray-Ban', minPrice: 0, maxPrice: 0, sortBy: ''
    });
    const wrapper = shallow(<ProductAppliedFilters filteredProductsCount={1} />);
    wrapper.find('.pill-remove').at(0).simulate('click');
    expect(mockDispatch).toHaveBeenCalledWith(applyFilter({ brand: '' }));
  });

  it('dispatches applyFilter when sort remove button is clicked', () => {
    reactRedux.useSelector.mockReturnValue({
      keyword: '', brand: '', minPrice: 0, maxPrice: 0, sortBy: 'name-asc'
    });
    const wrapper = shallow(<ProductAppliedFilters filteredProductsCount={1} />);
    wrapper.find('.pill-remove').at(0).simulate('click');
    expect(mockDispatch).toHaveBeenCalledWith(applyFilter({ sortBy: '' }));
  });

  it('dispatches applyFilter when price range remove button is clicked', () => {
    reactRedux.useSelector.mockReturnValue({
      keyword: '', brand: '', minPrice: 10, maxPrice: 50, sortBy: ''
    });
    const wrapper = shallow(<ProductAppliedFilters filteredProductsCount={1} />);
    wrapper.find('.pill-remove').at(0).simulate('click');
    expect(mockDispatch).toHaveBeenCalledWith(applyFilter({ minPrice: 0, maxPrice: 0 }));
  });
});
