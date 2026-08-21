import { renderHook, act } from '@testing-library/react-hooks';
import { useSelector, useDispatch } from 'react-redux';
import useBasket from '@/hooks/useBasket';
import { displayActionMessage } from '@/helpers/utils';
import { addToBasket as dispatchAddToBasket, removeFromBasket } from '@/redux/actions/basketActions';

jest.mock('react-redux');
jest.mock('@/helpers/utils');
jest.mock('@/redux/actions/basketActions');

describe('useBasket', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
  });

  describe('isItemOnBasket', () => {
    it('returns true when item is in basket', () => {
      const basket = [{ id: '1', name: 'Glasses' }];
      useSelector.mockImplementation((selector) => selector({ basket }));

      const { result } = renderHook(() => useBasket());
      expect(result.current.isItemOnBasket('1')).toBe(true);
    });

    it('returns false when item is not in basket', () => {
      const basket = [{ id: '2', name: 'Sunglasses' }];
      useSelector.mockImplementation((selector) => selector({ basket }));

      const { result } = renderHook(() => useBasket());
      expect(result.current.isItemOnBasket('1')).toBe(false);
    });
  });

  describe('addToBasket', () => {
    it('dispatches addToBasket when item is not in basket', () => {
      const basket = [];
      useSelector.mockImplementation((selector) => selector({ basket }));

      const { result } = renderHook(() => useBasket());
      const product = { id: '1', name: 'Glasses' };

      act(() => {
        result.current.addToBasket(product);
      });

      expect(dispatchAddToBasket).toHaveBeenCalledWith(product);
      expect(displayActionMessage).toHaveBeenCalledWith('Item added to basket', 'success');
    });

    it('dispatches removeFromBasket when item is already in basket', () => {
      const basket = [{ id: '1', name: 'Glasses' }];
      useSelector.mockImplementation((selector) => selector({ basket }));

      const { result } = renderHook(() => useBasket());
      const product = { id: '1', name: 'Glasses' };

      act(() => {
        result.current.addToBasket(product);
      });

      expect(removeFromBasket).toHaveBeenCalledWith('1');
      expect(displayActionMessage).toHaveBeenCalledWith('Item removed from basket', 'info');
    });
  });
});
