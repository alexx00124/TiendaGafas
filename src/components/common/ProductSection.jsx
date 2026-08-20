import { ProductShowcaseGrid } from '@/components/product';
import PropType from 'prop-types';
import React from 'react';
import MessageDisplay from './MessageDisplay';

const ProductSection = ({
  error, isLoading, products, fetchProducts, skeletonCount
}) => (
  <div className="display">
    <div className="product-display-grid">
      {(error && !isLoading) ? (
        <MessageDisplay
          message={error}
          action={fetchProducts}
          buttonLabel="Try Again"
        />
      ) : (
        <ProductShowcaseGrid
          products={products}
          skeletonCount={skeletonCount}
        />
      )}
    </div>
  </div>
);

ProductSection.propTypes = {
  error: PropType.string,
  isLoading: PropType.bool.isRequired,
  products: PropType.arrayOf(PropType.shape({})).isRequired,
  fetchProducts: PropType.func.isRequired,
  skeletonCount: PropType.number
};

ProductSection.defaultProps = {
  error: '',
  skeletonCount: 6
};

export default ProductSection;
