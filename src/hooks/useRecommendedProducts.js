import firebase from '@/services/firebase';
import useProductCollection from './useProductCollection';

const useRecommendedProducts = (itemsCount) => {
  const {
    products: recommendedProducts,
    fetchProducts: fetchRecommendedProducts,
    isLoading,
    error
  } = useProductCollection(
    (count) => firebase.getRecommendedProducts(count),
    itemsCount,
    'No recommended products found.',
    'Failed to fetch recommended products'
  );

  return {
    recommendedProducts, fetchRecommendedProducts, isLoading, error
  };
};

export default useRecommendedProducts;
