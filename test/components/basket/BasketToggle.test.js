import React from 'react';
import { shallow } from 'enzyme';
import BasketToggle from '@/components/basket/BasketToggle';

describe('BasketToggle', () => {
  afterEach(() => {
    document.body.classList.remove('is-basket-open');
  });

  it('renders children with onClickToggle', () => {
    const child = jest.fn();
    shallow(<BasketToggle>{child}</BasketToggle>);
    expect(child).toHaveBeenCalledWith(
      expect.objectContaining({ onClickToggle: expect.any(Function) })
    );
  });

  it('adds is-basket-open class when toggled off', () => {
    const child = jest.fn();
    shallow(<BasketToggle>{child}</BasketToggle>);
    const { onClickToggle } = child.mock.calls[0][0];
    onClickToggle();
    expect(document.body.classList.contains('is-basket-open')).toBe(true);
  });

  it('removes is-basket-open class when toggled on', () => {
    const child = jest.fn();
    shallow(<BasketToggle>{child}</BasketToggle>);
    const { onClickToggle } = child.mock.calls[0][0];
    onClickToggle();
    onClickToggle();
    expect(document.body.classList.contains('is-basket-open')).toBe(false);
  });
});
