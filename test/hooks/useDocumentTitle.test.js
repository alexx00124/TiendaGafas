import { renderHook } from '@testing-library/react-hooks';
import useDocumentTitle from '@/hooks/useDocumentTitle';

describe('useDocumentTitle', () => {
  afterEach(() => {
    document.title = 'Salinaka - eCommerce React App';
  });

  it('should set document.title to the provided title', () => {
    renderHook(() => useDocumentTitle('My Custom Title'));
    expect(document.title).toBe('My Custom Title');
  });

  it('should set document.title to the default title when title is not provided', () => {
    renderHook(() => useDocumentTitle(''));
    expect(document.title).toBe('Salinaka - eCommerce React App');
  });

  it('should set default title when called with no arguments', () => {
    renderHook(() => useDocumentTitle());
    expect(document.title).toBe('Salinaka - eCommerce React App');
  });
});
