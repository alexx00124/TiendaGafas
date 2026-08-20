import { renderHook, act } from '@testing-library/react-hooks';
import useFileHandler from '@/hooks/useFileHandler';
import { displayActionMessage } from '@/helpers/utils';

jest.mock('@/helpers/utils');

describe('useFileHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('removeImage', () => {
    it('removes an image by id from the collection', () => {
      const initState = { image: [{ id: 'img1', url: 'http://img1.jpg', name: 'image' }] };
      const { result } = renderHook(() => useFileHandler(initState));

      act(() => {
        result.current.removeImage({ id: 'img1', name: 'image' });
      });

      expect(result.current.imageFile.image).toEqual([]);
    });
  });

  describe('onFileChange', () => {
    it('shows error for wrong file extension', () => {
      const initState = { image: [] };
      const { result } = renderHook(() => useFileHandler(initState));

      const event = {
        target: {
          value: 'file.txt',
          files: [{ size: 1000, name: 'file.txt' }]
        }
      };

      act(() => {
        result.current.onFileChange(event, { name: 'image', type: 'single' });
      });

      expect(displayActionMessage).toHaveBeenCalledWith(
        'File type must be JPEG or PNG',
        'error'
      );
    });

    it('shows error for oversized file', () => {
      const initState = { image: [] };
      const { result } = renderHook(() => useFileHandler(initState));

      const event = {
        target: {
          value: 'big.png',
          files: [{ size: 1024 * 1024 * 0.6, name: 'big.png' }] // > 0.5 MB
        }
      };

      act(() => {
        result.current.onFileChange(event, { name: 'image', type: 'single' });
      });

      expect(displayActionMessage).toHaveBeenCalledWith(
        'File size exceeded 500kb, consider optimizing your image',
        'error'
      );
    });
  });
});
