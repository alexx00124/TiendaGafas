import { renderHook } from '@testing-library/react-hooks';
import useScrollTop from '@/hooks/useScrollTop';

describe('useScrollTop', () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should call window.scrollTo on mount', () => {
    renderHook(() => useScrollTop());
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('should only call scrollTo once on mount', () => {
    renderHook(() => useScrollTop());
    expect(window.scrollTo).toHaveBeenCalledTimes(1);
  });
});
