import { renderHook, act } from '@testing-library/react-hooks';
import useBasket from '@/hooks/useBasket';
import useDidMount from '@/hooks/useDidMount';
import useDocumentTitle from '@/hooks/useDocumentTitle';
import useFileHandler from '@/hooks/useFileHandler';
import useFeaturedProducts from '@/hooks/useFeaturedProducts';
import useModal from '@/hooks/useModal';
import useProduct from '@/hooks/useProduct';
import useRecommendedProducts from '@/hooks/useRecommendedProducts';
import useScrollTop from '@/hooks/useScrollTop';
import useProductCollection from '@/hooks/useProductCollection';

jest.mock('@/services/firebase', () => ({
  getSingleProduct: jest.fn(),
  getFeaturedProducts: jest.fn(),
  getRecommendedProducts: jest.fn()
}));

jest.mock('react-redux', () => ({
  useSelector: (selector) => selector({
    basket: [{ id: 'b1' }],
    products: { items: [{ id: 'p1', name: 'P1' }] }
  }),
  useDispatch: () => jest.fn()
}));

jest.mock('@/helpers/utils', () => ({
  displayActionMessage: jest.fn()
}));

import * as utils from '@/helpers/utils';
import firebase from '@/services/firebase';

describe('useDidMount', () => {
  it('returns true after mount', () => {
    const { result } = renderHook(() => useDidMount());
    expect(result.current).toBe(true);
  });

  it('initializes with provided value', () => {
    const { result } = renderHook(() => useDidMount(true));
    expect(result.current).toBe(true);
  });
});

describe('useScrollTop', () => {
  it('scrolls to top on mount', () => {
    window.scrollTo = jest.fn();
    renderHook(() => useScrollTop());
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });
});

describe('useDocumentTitle', () => {
  it('sets title when provided', () => {
    renderHook(() => useDocumentTitle('My Title'));
    expect(document.title).toBe('My Title');
  });

  it('sets default title when not provided', () => {
    renderHook(() => useDocumentTitle(null));
    expect(document.title).toBe('Salinaka - eCommerce React App');
  });
});

describe('useModal', () => {
  it('opens and closes modal', () => {
    const { result } = renderHook(() => useModal());
    expect(result.current.isOpenModal).toBe(false);
    act(() => result.current.onOpenModal());
    expect(result.current.isOpenModal).toBe(true);
    act(() => result.current.onCloseModal());
    expect(result.current.isOpenModal).toBe(false);
  });
});

describe('useBasket', () => {
  it('returns basket and check functions', () => {
    const { result } = renderHook(() => useBasket());
    expect(result.current.basket).toEqual([{ id: 'b1' }]);
    expect(result.current.isItemOnBasket('b1')).toBe(true);
    expect(result.current.isItemOnBasket('nope')).toBe(false);
  });

  it('addToBasket removes item when present', () => {
    const { result } = renderHook(() => useBasket());
    act(() => result.current.addToBasket({ id: 'b1' }));
    expect(utils.displayActionMessage).toHaveBeenCalledWith('Item removed from basket', 'info');
  });

  it('addToBasket adds item when absent', () => {
    const { result } = renderHook(() => useBasket());
    act(() => result.current.addToBasket({ id: 'b2' }));
    expect(utils.displayActionMessage).toHaveBeenCalledWith('Item added to basket', 'success');
  });
});

describe('useProduct', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches product that exists in doc', async () => {
    firebase.getSingleProduct.mockResolvedValue({
      exists: true,
      id: 'pX',
      data: () => ({ name: 'Product A' })
    });
    const { result, waitForNextUpdate } = renderHook(() => useProduct('pX'));
    await act(async () => {
      await waitForNextUpdate();
    });
    expect(result.current.product).toEqual({ name: 'Product A', id: 'pX' });
    expect(result.current.isLoading).toBe(false);
  });

  it('sets error when product not found', async () => {
    firebase.getSingleProduct.mockResolvedValue({
      exists: false,
      data: () => null
    });
    const { result, waitForNextUpdate } = renderHook(() => useProduct('missing'));
    await act(async () => {
      await waitForNextUpdate();
    });
    expect(result.current.error).toBe('Product not found.');
  });

  it('sets error on fetch failure', async () => {
    firebase.getSingleProduct.mockRejectedValue(new Error('Network error'));
    const { result, waitForNextUpdate } = renderHook(() => useProduct('pX'));
    await act(async () => {
      await waitForNextUpdate();
    });
    expect(result.current.error).toBe('Network error');
    expect(result.current.isLoading).toBe(false);
  });
});

describe('useFeaturedProducts / useRecommendedProducts', () => {
  const docs = {
    empty: false,
    forEach: (cb) => cb({ id: 'f1', data: () => ({ name: 'F1' }) })
  };

  beforeEach(() => {
    jest.clearAllMocks();
    firebase.getFeaturedProducts.mockResolvedValue(docs);
    firebase.getRecommendedProducts.mockResolvedValue(docs);
  });

  it('featured returns products', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useFeaturedProducts(4));
    await act(async () => {
      await waitForNextUpdate();
    });
    expect(result.current.featuredProducts).toEqual([{ id: 'f1', name: 'F1' }]);
    expect(firebase.getFeaturedProducts).toHaveBeenCalledWith(4);
  });

  it('recommended returns products', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useRecommendedProducts(4));
    await act(async () => {
      await waitForNextUpdate();
    });
    expect(result.current.recommendedProducts).toEqual([{ id: 'f1', name: 'F1' }]);
    expect(firebase.getRecommendedProducts).toHaveBeenCalledWith(4);
  });
});

describe('useFileHandler', () => {
  let originalFileReader;

  beforeAll(() => {
    originalFileReader = global.FileReader;
    global.FileReader = class {
      constructor() {
        this.listeners = {};
      }

      addEventListener(type, cb) {
        this.listeners[type] = cb;
      }

      readAsDataURL() {
        setTimeout(() => this.listeners.load && this.listeners.load({ target: { result: 'data:image/png;base64,xx' } }), 0);
      }
    };
  });

  afterAll(() => {
    global.FileReader = originalFileReader;
  });

  it('initializes state', () => {
    const { result } = renderHook(() => useFileHandler({ images: [] }));
    expect(result.current.imageFile).toEqual({ images: [] });
    expect(result.current.isFileLoading).toBe(false);
  });

  it('removeImage filters items', () => {
    const { result } = renderHook(() => useFileHandler({ images: [{ id: 'a' }, { id: 'b' }] }));
    act(() => result.current.removeImage({ id: 'a', name: 'images' }));
    expect(result.current.imageFile.images).toEqual([{ id: 'b' }]);
  });

  it('onFileChange rejects wrong file type', () => {
    const { result } = renderHook(() => useFileHandler({ images: [] }));
    act(() => result.current.onFileChange({
      target: { value: 'file.gif', files: [{ size: 0.1 }] }
    }, { name: 'images', type: 'single' }));
    expect(utils.displayActionMessage).toHaveBeenCalledWith('File type must be JPEG or PNG', 'error');
    expect(result.current.isFileLoading).toBe(false);
  });

  it('onFileChange rejects oversized file', () => {
    const { result } = renderHook(() => useFileHandler({ images: [] }));
    act(() => result.current.onFileChange({
      target: { value: 'file.jpg', files: [{ size: 2 * 1024 * 1024 }] }
    }, { name: 'images', type: 'single' }));
    expect(utils.displayActionMessage).toHaveBeenCalledWith(
      'File size exceeded 500kb, consider optimizing your image',
      'error'
    );
  });

  it('onFileChange handles single file load', async () => {
    const { result } = renderHook(() => useFileHandler({ image: null }));
    act(() => result.current.onFileChange({
      target: { value: 'file.jpg', files: [{ size: 0.1 }] }
    }, { name: 'image', type: 'single' }));
    expect(result.current.isFileLoading).toBe(true);
    await act(async () => {
      await new Promise((r) => setTimeout(r, 10));
    });
    expect(result.current.imageFile.image).toEqual({
      file: { size: 0.1 },
      url: 'data:image/png;base64,xx'
    });
    expect(result.current.isFileLoading).toBe(false);
  });

  it('onFileChange handles multiple files', async () => {
    const { result } = renderHook(() => useFileHandler({ images: [] }));
    act(() => result.current.onFileChange({
      target: { value: 'file.jpg', files: [{ size: 0.1 }, { size: 0.2 }] }
    }, { name: 'images', type: 'multiple' }));
    await act(async () => {
      await new Promise((r) => setTimeout(r, 20));
    });
    expect(result.current.imageFile.images).toHaveLength(2);
    const sizes = result.current.imageFile.images.map((i) => i.file.size).sort();
    expect(sizes).toEqual([0.1, 0.2]);
  });
});

describe('useProductCollection helper functions', () => {
  it('fetchProducts exists', () => {
    const { result } = renderHook(() => useProductCollection(jest.fn(), 6, 'no', 'fail'));
    expect(typeof result.current.fetchProducts).toBe('function');
  });
});
