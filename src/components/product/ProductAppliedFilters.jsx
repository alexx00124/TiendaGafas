import { CloseCircleOutlined } from '@ant-design/icons';
import PropType from 'prop-types';
import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { applyFilter } from '@/redux/actions/filterActions';

const SORT_LABELS = {
  'price-desc': 'Price High - Low',
  'price-asc': 'Price Low - High',
  'name-desc': 'Name Z - A',
  'name-asc': 'Name A - Z'
};

const ProductAppliedFilters = ({ filteredProductsCount }) => {
  const filter = useSelector((state) => state.filter, shallowEqual);
  const fields = ['brand', 'minPrice', 'maxPrice', 'sortBy', 'keyword'];
  const isFiltered = fields.some((key) => !!filter[key]);
  const dispatch = useDispatch();

  const onRemoveKeywordFilter = () => {
    dispatch(applyFilter({ keyword: '' }));
  };

  const onRemovePriceRangeFilter = () => {
    dispatch(applyFilter({ minPrice: 0, maxPrice: 0 }));
  };

  const onRemoveBrandFilter = () => {
    dispatch(applyFilter({ brand: '' }));
  };

  const onRemoveSortFilter = () => {
    dispatch(applyFilter({ sortBy: '' }));
  };

  return !isFiltered ? null : (
    <>
      <div className="product-list-header">
        <div className="product-list-header-title">
          <h5>
            {filteredProductsCount > 0
              && `Found ${filteredProductsCount} ${filteredProductsCount > 1 ? 'products' : 'product'}`}
          </h5>
        </div>
      </div>
      <div className="product-applied-filters">
        {filter.keyword && (
          <div className="pill-wrapper">
            <span className="d-block">Keyword</span>
            <div className="pill padding-right-l">
              <h5 className="pill-content margin-0">{filter.keyword}</h5>
              <button className="pill-remove" onClick={onRemoveKeywordFilter} type="button">
                <span className="margin-0 text-subtle">
                  <CloseCircleOutlined />
                </span>
              </button>
            </div>
          </div>
        )}
        {filter.brand && (
          <div className="pill-wrapper">
            <span className="d-block">Brand</span>
            <div className="pill padding-right-l">
              <h5 className="pill-content margin-0">{filter.brand}</h5>
              <button className="pill-remove" onClick={onRemoveBrandFilter} type="button">
                <span className="margin-0 text-subtle">
                  <CloseCircleOutlined />
                </span>
              </button>
            </div>
          </div>
        )}
        {(!!filter.minPrice || !!filter.maxPrice) && (
          <div className="pill-wrapper">
            <span className="d-block">Price Range</span>
            <div className="pill padding-right-l">
              <h5 className="pill-content margin-0">
                $
                {filter.minPrice}
                - $
                {filter.maxPrice}
              </h5>
              <button
                className="pill-remove"
                onClick={onRemovePriceRangeFilter}
                type="button"
              >
                <span className="margin-0 text-subtle">
                  <CloseCircleOutlined />
                </span>
              </button>
            </div>
          </div>
        )}
        {filter.sortBy && (
          <div className="pill-wrapper">
            <span className="d-block">Sort By</span>
            <div className="pill padding-right-l">
              <h5 className="pill-content margin-0">
                {SORT_LABELS[filter.sortBy] || 'Name A - Z'}
              </h5>
              <button
                className="pill-remove"
                onClick={onRemoveSortFilter}
                type="button"
              >
                <span className="margin-0 text-subtle">
                  <CloseCircleOutlined />
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

ProductAppliedFilters.defaultProps = {
  filteredProductsCount: 0
};

ProductAppliedFilters.propTypes = {
  filteredProductsCount: PropType.number
};

export default ProductAppliedFilters;
