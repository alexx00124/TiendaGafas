import { renderHook, act } from '@testing-library/react-hooks';
import useModal from '@/hooks/useModal';

describe('useModal', () => {
  it('should return false initially', () => {
    const { result } = renderHook(() => useModal());
    expect(result.current.isOpenModal).toBe(false);
  });

  it('should set isOpenModal to true when onOpenModal is called', () => {
    const { result } = renderHook(() => useModal());
    act(() => {
      result.current.onOpenModal();
    });
    expect(result.current.isOpenModal).toBe(true);
  });

  it('should set isOpenModal to false when onCloseModal is called', () => {
    const { result } = renderHook(() => useModal());
    act(() => {
      result.current.onOpenModal();
    });
    expect(result.current.isOpenModal).toBe(true);

    act(() => {
      result.current.onCloseModal();
    });
    expect(result.current.isOpenModal).toBe(false);
  });
});
