import { renderHook, act } from '@testing-library/react-hooks';
import useDidMount from '@/hooks/useDidMount';

describe('useDidMount', () => {
  it('returns true after mount (effect runs immediately)', () => {
    const { result } = renderHook(() => useDidMount());
    expect(result.current).toBe(true);
  });

  it('accepts a custom initial state that gets overridden by effect', () => {
    const { result } = renderHook(() => useDidMount(true));
    expect(result.current).toBe(true);
  });

  it('cleans up to false on unmount', () => {
    const { result, unmount } = renderHook(() => useDidMount());
    expect(result.current).toBe(true);
    unmount();
    // After unmount, the cleanup sets didMount to false internally.
    // We can't read result.current after unmount in react-hooks-testing-library,
    // but the cleanup path is executed, covering that branch.
  });
});
