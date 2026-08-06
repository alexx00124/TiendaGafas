import { selectFilter, selectMax, selectMin } from '@/selectors/selector';

const products = [
  { id: 1, name: 'Ray-Ban', price: 100, brand: 'rayban', keywords: ['classic'], description: 'sunglasses' },
  { id: 2, name: 'Oakley', price: 50, brand: 'oakley', keywords: ['sport'], description: 'lens' }
];

describe('selectFilter', () => {
  it('returns [] for empty / null products', () => {
    expect(selectFilter([], {})).toEqual([]);
    expect(selectFilter(null, {})).toEqual([]);
  });

  it('filters by keyword from keywords', () => {
    const filter = { keyword: 'SPORT', minPrice: 0, maxPrice: 0, brand: '', sortBy: '' };
    const result = selectFilter(products, filter);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Oakley');
  });

  it('filters by brand', () => {
    const filter = { keyword: '', minPrice: 0, maxPrice: 0, brand: 'rayban', sortBy: '' };
    const result = selectFilter(products, filter);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Ray-Ban');
  });

  it('filters by price range (isInRange with maxPrice)', () => {
    const filter = { keyword: '', minPrice: 80, maxPrice: 120, brand: '', sortBy: '' };
    const result = selectFilter(products, filter);
    expect(result).toEqual([{ id: 1, name: 'Ray-Ban', price: 100, brand: 'rayban', keywords: ['classic'], description: 'sunglasses' }]);
  });

  it('sorts by price ascending when no sortBy (default sort)', () => {
    const filter = { keyword: '', minPrice: 0, maxPrice: 0, brand: '', sortBy: '' };
    const result = selectFilter(products, filter);
    expect(result[0].name).toBe('Oakley');
  });

  it('sorts by name ascending', () => {
    const filter = { keyword: '', minPrice: 0, maxPrice: 0, brand: '', sortBy: 'name-asc' };
    const result = selectFilter(products, filter);
    expect(result[0].name).toBe('Oakley');
    expect(result[1].name).toBe('Ray-Ban');
  });

  it('sorts by name descending', () => {
    const filter = { keyword: '', minPrice: 0, maxPrice: 0, brand: '', sortBy: 'name-desc' };
    const result = selectFilter(products, filter);
    expect(result[0].name).toBe('Ray-Ban');
  });

  it('sorts by price descending', () => {
    const filter = { keyword: '', minPrice: 0, maxPrice: 0, brand: '', sortBy: 'price-desc' };
    const result = selectFilter(products, filter);
    expect(result[0].name).toBe('Ray-Ban');
  });

  it('matches keyword via description when no keywords field', () => {
    const noKw = { id: 3, name: 'Prada', price: 200, brand: 'prada', description: 'luxury lens' };
    const filter = { keyword: 'luxury', minPrice: 0, maxPrice: 0, brand: '', sortBy: '' };
    const result = selectFilter([noKw], filter);
    expect(result).toHaveLength(1);
  });

  it('treats product without brand as matching brand filter', () => {
    const noBrand = { id: 4, name: 'Generic', price: 10, keywords: ['g'], description: 'basic' };
    const filter = { keyword: '', minPrice: 0, maxPrice: 0, brand: 'xyz', sortBy: '' };
    const result = selectFilter([noBrand], filter);
    expect(result).toHaveLength(1);
  });
});

describe('selectMax / selectMin', () => {
  it('returns 0 for empty products', () => {
    expect(selectMax([])).toBe(0);
    expect(selectMin(null)).toBe(0);
  });

  it('returns highest / lowest price', () => {
    expect(selectMax(products)).toBe(100);
    expect(selectMin(products)).toBe(50);
  });
});