import { ProductSection } from '@/components/common';
import { useDocumentTitle, useRecommendedProducts, useScrollTop } from '@/hooks';
import bannerImg from '@/images/banner-girl-1.png';
import React from 'react';

const RecommendedProducts = () => {
  useDocumentTitle('Recommended Products | Salinaka');
  useScrollTop();

  const {
    recommendedProducts,
    fetchRecommendedProducts,
    isLoading,
    error
  } = useRecommendedProducts();

  return (
    <main className="content">
      <div className="featured">
        <div className="banner">
          <div className="banner-desc">
            <h1>Recommended Products</h1>
          </div>
          <div className="banner-img">
            <img src={bannerImg} alt="" />
          </div>
        </div>
        <ProductSection
          error={error}
          isLoading={isLoading}
          products={recommendedProducts}
          fetchProducts={fetchRecommendedProducts}
        />
      </div>
    </main>
  );
};

export default RecommendedProducts;
