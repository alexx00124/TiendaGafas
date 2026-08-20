import { renderHook } from '@testing-library/react-hooks';
import useRecommendedProducts from '@/hooks/useRecommendedProducts';
import firebase from '@/services/firebase';
import useProductCollection from '@/hooks/useProductCollection';

jest.mock('@/services/firebase');
jest.mock('@/hooks/useProductCollection');

describe('useRecommendedProducts', () => {
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

    const { result } = renderHook(() => useRecommendedProducts(6));

    expect(useProductCollection).toHaveBeenCalledWith(
      expect.any(Function),
      6,
      'No recommended products found.',
      'Failed to fetch recommended products'
    );
    expect(result.current.recommendedProducts).toBe(mockReturn.products);
    expect(result.current.fetchRecommendedProducts).toBe(mockReturn.fetchProducts);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('');
  });

  it('calls firebase.getRecommendedProducts when the fetch function is invoked', () => {
    useProductCollection.mockReturnValue({
      products: [],
      fetchProducts: jest.fn(),
      isLoading: false,
      error: ''
    });

    renderHook(() => useRecommendedProducts(10));

    const fetchFn = useProductCollection.mock.calls[0][0];
    fetchFn(10);

    expect(firebase.getRecommendedProducts).toHaveBeenCalledWith(10);
  });
});
