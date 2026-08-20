import { renderHook } from '@testing-library/react-hooks';
import { useSelector } from 'react-redux';
import useProduct from '@/hooks/useProduct';
import firebase from '@/services/firebase';

jest.mock('react-redux');
jest.mock('@/services/firebase');

describe('useProduct', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns storeProduct when found in the store', () => {
    const storeProduct = { id: '1', name: 'Stored Product', price: 50 };
    useSelector.mockImplementation((selector) =>
      selector({ products: { items: [storeProduct] } })
    );

    const { result } = renderHook(() => useProduct('1'));

    expect(result.current.product).toEqual(storeProduct);
    expect(result.current.isLoading).toBe(false);
  });

  it('returns undefined product when product not in store (no fetch on first render due to didMount)', () => {
    useSelector.mockImplementation((selector) =>
      selector({ products: { items: [] } })
    );

    const { result } = renderHook(() => useProduct('nonexistent'));

    // Product is undefined since it's not in the store
    expect(result.current.product).toBeUndefined();
  });

  it('provides isLoading and error in return value', () => {
    useSelector.mockImplementation((selector) =>
      selector({ products: { items: [] } })
    );

    const { result } = renderHook(() => useProduct('1'));

    expect(result.current).toHaveProperty('product');
    expect(result.current).toHaveProperty('isLoading');
    expect(result.current).toHaveProperty('error');
  });
});
