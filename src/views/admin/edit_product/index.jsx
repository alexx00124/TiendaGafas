import SuspenseLoader from '@/components/common/SuspenseLoader';
import { useDocumentTitle, useProduct, useScrollTop } from '@/hooks';
import PropType from 'prop-types';
import React, { lazy, Suspense } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';
import { editProduct } from '@/redux/actions/productActions';

const ProductForm = lazy(() => import('../components/ProductForm'));

const EditProduct = ({ match }) => {
  useDocumentTitle('Edit Product | Salinaka');
  useScrollTop();
  const { product, error, isLoading } = useProduct(match.params.id);
  const dispatch = useDispatch();

  const onSubmitForm = (updates) => {
    dispatch(editProduct(product.id, updates));
  };

  return (
    <div className="product-form-container">
      {error && <Redirect to="/dashboard/products" />}
      <h2>Edit Product</h2>
      {product && (
        <Suspense fallback={<SuspenseLoader />}>
          <ProductForm
            isLoading={isLoading}
            onSubmit={onSubmitForm}
            product={product}
          />
        </Suspense>
      )}
    </div>
  );
};

EditProduct.propTypes = {
  match: PropType.shape({
    params: PropType.shape({
      id: PropType.string
    })
  }).isRequired
};

export default withRouter(EditProduct);
