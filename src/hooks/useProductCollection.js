import { useCallback, useEffect, useState } from 'react';
import useDidMount from './useDidMount';

const useProductCollection = (fetchFn, itemsCount, emptyMsg, failMsg) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const didMount = useDidMount(true);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const docs = await fetchFn(itemsCount);

      if (docs.empty) {
        if (didMount) {
          setError(emptyMsg);
          setLoading(false);
        }
      } else {
        const items = [];

        docs.forEach((snap) => {
          const data = snap.data();
          items.push({ id: snap.id, ...data });
        });

        if (didMount) {
          setProducts(items);
          setLoading(false);
        }
      }
    } catch (e) {
      if (didMount) {
        setError(failMsg);
        setLoading(false);
      }
    }
  }, [didMount, fetchFn, itemsCount, emptyMsg, failMsg]);

  useEffect(() => {
    if (products.length === 0 && didMount) {
      fetchProducts();
    }
  }, [didMount, fetchProducts, products.length]);

  return {
    products, fetchProducts, isLoading, error
  };
};

export default useProductCollection;
