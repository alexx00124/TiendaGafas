import {
  calculateTotal, displayDate, displayMoney
} from '@/helpers/utils';

describe('displayDate', () => {
  it('formats a timestamp into a human readable date', () => {
    const timestamp = new Date(2020, 4, 15).getTime();

    expect(displayDate(timestamp)).toBe('May 15, 2020');
  });
});

describe('displayMoney', () => {
  it('formats a number as USD currency', () => {
    expect(displayMoney(25.5)).toBe('$25.50');
    expect(displayMoney(0)).toBe('$0.00');
  });
});

describe('calculateTotal', () => {
  it('returns 0 for an empty array', () => {
    expect(calculateTotal([])).toBe(0);
  });

  it('returns 0 when no input is provided', () => {
    expect(calculateTotal()).toBe(0);
  });

  it('sums the array and returns a fixed two decimal string', () => {
    expect(calculateTotal([10, 20, 5.25])).toBe('35.25');
  });
});