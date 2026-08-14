import firebase from '@/services/firebase';
import useProductCollection from './useProductCollection';

const useFeaturedProducts = (itemsCount) => {
  const {
    products: featuredProducts,
    fetchProducts: fetchFeaturedProducts,
    isLoading,
    error
  } = useProductCollection(
    (count) => firebase.getFeaturedProducts(count),
    itemsCount,
    'No featured products found.',
    'Failed to fetch featured products'
  );

  return {
    featuredProducts, fetchFeaturedProducts, isLoading, error
  };
};

export default useFeaturedProducts;
