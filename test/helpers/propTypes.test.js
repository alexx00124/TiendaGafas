import { productShape, historyShape } from '@/helpers/propTypes';
import PropType from 'prop-types';

describe('propTypes', () => {
  it('productShape should be defined', () => {
    expect(productShape).toBeDefined();
  });

  it('historyShape should be defined', () => {
    expect(historyShape).toBeDefined();
  });

  it('productShape is a valid PropTypes checker', () => {
    expect(typeof productShape).toBe('function');
  });

  it('historyShape is a valid PropTypes checker', () => {
    expect(typeof historyShape).toBe('function');
  });

  it('productShape returns null for valid props via checkPropTypes', () => {
    const props = { product: { id: '1', name: 'Glasses' } };
    const propTypes = { product: productShape };
    const errors = {};
    PropType.checkPropTypes(propTypes, props, 'prop', 'TestComponent', () => {});
    expect(errors).toEqual({});
  });
});
