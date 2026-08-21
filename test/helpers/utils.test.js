import {
  calculateTotal, displayDate, displayMoney, displayActionMessage
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

describe('displayActionMessage', () => {
  let appendChildSpy;
  let removeChildSpy;
  let querySelectorSpy;

  beforeEach(() => {
    appendChildSpy = jest.spyOn(document.body, 'appendChild').mockImplementation(() => {});
    removeChildSpy = jest.spyOn(document.body, 'removeChild').mockImplementation(() => {});
    querySelectorSpy = jest.spyOn(document, 'querySelector').mockReturnValue(null);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it('creates a toast div with info class by default', () => {
    jest.useFakeTimers();
    displayActionMessage('Hello');

    const divArg = appendChildSpy.mock.calls[0][0];
    expect(divArg.className).toBe('toast toast-info');
    expect(divArg.querySelector('.toast-msg').textContent).toBe('Hello');
  });

  it('creates a toast with success class', () => {
    jest.useFakeTimers();
    displayActionMessage('Done', 'success');

    const divArg = appendChildSpy.mock.calls[0][0];
    expect(divArg.className).toBe('toast toast-success');
  });

  it('creates a toast with error class for unknown status', () => {
    jest.useFakeTimers();
    displayActionMessage('Oops', 'error');

    const divArg = appendChildSpy.mock.calls[0][0];
    expect(divArg.className).toBe('toast toast-error');
  });

  it('removes existing toast before appending a new one', () => {
    jest.useFakeTimers();
    const fakeToast = document.createElement('div');
    querySelectorSpy.mockReturnValue(fakeToast);

    displayActionMessage('Update');

    expect(removeChildSpy).toHaveBeenCalledWith(fakeToast);
    expect(appendChildSpy).toHaveBeenCalledTimes(1);
  });

  it('removes toast after 3 seconds', () => {
    jest.useFakeTimers();
    displayActionMessage('Temp');

    const divArg = appendChildSpy.mock.calls[0][0];
    jest.advanceTimersByTime(3000);

    expect(removeChildSpy).toHaveBeenCalledWith(divArg);
  });

  it('does not throw if toast already removed before timeout', () => {
    jest.useFakeTimers();
    removeChildSpy.mockImplementation(() => { throw new Error('not found'); });

    displayActionMessage('Temp');

    jest.advanceTimersByTime(3000);
  });
});