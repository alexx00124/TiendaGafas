import { renderHook, act } from '@testing-library/react-hooks';
import useProductCollection from '@/hooks/useProductCollection';

jest.mock('@/services/firebase', () => ({
  getFeaturedProducts: jest.fn(),
  getRecommendedProducts: jest.fn()
}));

describe('useProductCollection', () => {
  let mockFetchFn;

  const mockDocs = {
    empty: false,
    forEach: (cb) => {
      cb({ id: '1', data: () => ({ name: 'Product 1' }) });
      cb({ id: '2', data: () => ({ name: 'Product 2' }) });
    }
  };

  const emptyDocs = { empty: true, forEach: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchFn = jest.fn();
  });

  it('returns initial state with loading false', () => {
    let resolvePromise;
    const neverResolves = new Promise((resolve) => { resolvePromise = resolve; });
    mockFetchFn.mockReturnValue(neverResolves);
    const { result, unmount } = renderHook(() =>
      useProductCollection(mockFetchFn, 6, 'No items', 'Failed')
    );
    expect(result.current.products).toEqual([]);
    expect(result.current.error).toBe('');
    resolvePromise(mockDocs);
    unmount();
  });

  it('fetches products and updates state', async () => {
    mockFetchFn.mockResolvedValue(mockDocs);
    const { result, waitForNextUpdate } = renderHook(() =>
      useProductCollection(mockFetchFn, 6, 'No items', 'Failed')
    );
    await act(async () => {
      await waitForNextUpdate();
    });
    expect(result.current.products).toEqual([
      { id: '1', name: 'Product 1' },
      { id: '2', name: 'Product 2' }
    ]);
    expect(result.current.isLoading).toBe(false);
  });

  it('sets error when docs are empty', async () => {
    mockFetchFn.mockResolvedValue(emptyDocs);
    const { result, waitForNextUpdate } = renderHook(() =>
      useProductCollection(mockFetchFn, 6, 'No items found', 'Failed')
    );
    await act(async () => {
      await waitForNextUpdate();
    });
    expect(result.current.error).toBe('No items found');
    expect(result.current.products).toEqual([]);
  });

  it('sets error on fetch failure', async () => {
    mockFetchFn.mockRejectedValue(new Error('Network error'));
    const { result, waitForNextUpdate } = renderHook(() =>
      useProductCollection(mockFetchFn, 6, 'No items', 'Failed to fetch')
    );
    await act(async () => {
      await waitForNextUpdate();
    });
    expect(result.current.error).toBe('Failed to fetch');
  });

  it('calls fetchFn with itemsCount', async () => {
    mockFetchFn.mockResolvedValue(mockDocs);
    const { waitForNextUpdate } = renderHook(() =>
      useProductCollection(mockFetchFn, 10, 'No items', 'Failed')
    );
    await act(async () => {
      await waitForNextUpdate();
    });
    expect(mockFetchFn).toHaveBeenCalledWith(10);
  });
});
