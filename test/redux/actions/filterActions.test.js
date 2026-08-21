import {
  setTextFilter,
  setBrandFilter,
  setMinPriceFilter,
  setMaxPriceFilter,
  resetFilter,
  clearRecentSearch,
  removeSelectedRecent,
  applyFilter
} from '@/redux/actions/filterActions';
import * as types from '@/constants/constants';

describe('filterActions', () => {
  it('should create setTextFilter action', () => {
    expect(setTextFilter('rayban')).toEqual({
      type: types.SET_TEXT_FILTER,
      payload: 'rayban'
    });
  });

  it('should create setBrandFilter action', () => {
    expect(setBrandFilter('Oakley')).toEqual({
      type: types.SET_BRAND_FILTER,
      payload: 'Oakley'
    });
  });

  it('should create setMinPriceFilter action', () => {
    expect(setMinPriceFilter(20)).toEqual({
      type: types.SET_MIN_PRICE_FILTER,
      payload: 20
    });
  });

  it('should create setMaxPriceFilter action', () => {
    expect(setMaxPriceFilter(100)).toEqual({
      type: types.SET_MAX_PRICE_FILTER,
      payload: 100
    });
  });

  it('should create resetFilter action', () => {
    expect(resetFilter()).toEqual({ type: types.RESET_FILTER });
  });

  it('should create clearRecentSearch action', () => {
    expect(clearRecentSearch()).toEqual({ type: types.CLEAR_RECENT_SEARCH });
  });

  it('should create removeSelectedRecent action', () => {
    expect(removeSelectedRecent('rayban')).toEqual({
      type: types.REMOVE_SELECTED_RECENT,
      payload: 'rayban'
    });
  });

  it('should create applyFilter action', () => {
    const filters = { brand: 'Oakley', minPrice: 10, maxPrice: 50 };
    expect(applyFilter(filters)).toEqual({
      type: types.APPLY_FILTER,
      payload: filters
    });
  });
});
