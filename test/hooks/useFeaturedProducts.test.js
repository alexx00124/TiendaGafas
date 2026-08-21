import { renderHook } from '@testing-library/react-hooks';
import useFeaturedProducts from '@/hooks/useFeaturedProducts';
import firebase from '@/services/firebase';
import useProductCollection from '@/hooks/useProductCollection';

jest.mock('@/services/firebase');
jest.mock('@/hooks/useProductCollection');

describe('useFeaturedProducts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('delegates to useProductCollection with correct args', () => {
    const mockReturn = {
      products: [],
      fetchProducts: jest.fn(),
      isLoading: false,
      error: ''
    };
    useProductCollection.mockReturnValue(mockReturn);

    const { result } = renderHook(() => useFeaturedProducts(6));

    expect(useProductCollection).toHaveBeenCalledWith(
      expect.any(Function),
      6,
      'No featured products found.',
      'Failed to fetch featured products'
    );
    expect(result.current.featuredProducts).toBe(mockReturn.products);
    expect(result.current.fetchFeaturedProducts).toBe(mockReturn.fetchProducts);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('');
  });

  it('calls firebase.getFeaturedProducts when the fetch function is invoked', () => {
    useProductCollection.mockReturnValue({
      products: [],
      fetchProducts: jest.fn(),
      isLoading: false,
      error: ''
    });

    renderHook(() => useFeaturedProducts(10));

    // Get the fetchFn passed to useProductCollection
    const fetchFn = useProductCollection.mock.calls[0][0];
    const mockDocs = { empty: false, forEach: jest.fn() };
    fetchFn(10);

    expect(firebase.getFeaturedProducts).toHaveBeenCalledWith(10);
  });
});
