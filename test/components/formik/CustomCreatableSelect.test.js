import React from 'react';
import { shallow } from 'enzyme';

const setValue = jest.fn();

jest.mock('formik', () => ({
  useField: jest.fn()
}));

jest.mock('react-select/creatable', () => {
  const MockCreatableSelect = () => <div className="mock-creatable-select" />;
  return MockCreatableSelect;
});

import { useField } from 'formik';
import CustomCreatableSelect from '@/components/formik/CustomCreatableSelect';

describe('CustomCreatableSelect', () => {
  const field = { name: 'keyword', value: '', onChange: jest.fn(), onBlur: jest.fn() };
  const helpers = { setValue };

  const shallowComponent = ({
    props = {},
    touched = false,
    error = null
  } = {}) => {
    useField.mockReturnValue([field, { touched, error }, helpers]);
    return shallow(
      <CustomCreatableSelect
        label="Keyword"
        defaultValue={{ value: 'blue', label: 'Blue' }}
        {...props}
      />
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls formik useField with the component props', () => {
    shallowComponent({ props: { name: 'keyword', iid: 'select-1' } });
    expect(useField).toHaveBeenCalledWith(expect.objectContaining({
      name: 'keyword',
      iid: 'select-1'
    }));
  });

  it('renders label when not touched or without error', () => {
    const wrapper = shallowComponent();
    expect(wrapper.find('label.label-input').text()).toBe('Keyword');
    expect(wrapper.find('label.label-input').prop('htmlFor')).toBe('keyword');
    expect(wrapper.find('.label-error').exists()).toBe(false);
  });

  it('renders error message when touched and error present', () => {
    const wrapper = shallowComponent({ touched: true, error: 'Keyword is required' });
    expect(wrapper.find('.label-error').text()).toBe('Keyword is required');
    expect(wrapper.find('label.label-input').exists()).toBe(false);
  });

  it('passes select configuration to CreatableSelect', () => {
    const options = [{ value: 'blue', label: 'Blue' }];
    const wrapper = shallowComponent({
      props: {
        name: 'keyword',
        placeholder: 'Pick one',
        options,
        isMulti: true,
        iid: 'select-1'
      }
    });
    const select = wrapper.find('MockCreatableSelect');
    expect(select.prop('name')).toBe('keyword');
    expect(select.prop('placeholder')).toBe('Pick one');
    expect(select.prop('options')).toEqual(options);
    expect(select.prop('defaultValue')).toEqual({ value: 'blue', label: 'Blue' });
    expect(select.prop('isMulti')).toBe(true);
    expect(select.prop('instanceId')).toBe('select-1');
  });

  it('sets single value on change', () => {
    const wrapper = shallowComponent();
    wrapper.find('MockCreatableSelect').prop('onChange')({ value: 'blue', label: 'Blue' });
    expect(setValue).toHaveBeenCalledTimes(1);
    expect(setValue).toHaveBeenCalledWith('blue');
  });

  it('maps multi selection to an array of values on change', () => {
    const wrapper = shallowComponent({ props: { isMulti: true } });
    wrapper.find('MockCreatableSelect').prop('onChange')([
      { value: 'blue', label: 'Blue' },
      { value: 'red', label: 'Red' }
    ]);
    expect(setValue).toHaveBeenCalledWith(['blue', 'red']);
  });

  it('prevents non-digit keys when type is number', () => {
    const wrapper = shallowComponent({ props: { type: 'number' } });
    const preventDefault = jest.fn();
    wrapper.find('MockCreatableSelect').prop('onKeyDown')({
      nativeEvent: { key: 'a' },
      preventDefault
    });
    expect(preventDefault).toHaveBeenCalled();
  });

  it('allows digit keys when type is number', () => {
    const wrapper = shallowComponent({ props: { type: 'number' } });
    const preventDefault = jest.fn();
    wrapper.find('MockCreatableSelect').prop('onKeyDown')({
      nativeEvent: { key: '5' },
      preventDefault
    });
    expect(preventDefault).not.toHaveBeenCalled();
  });

  it('allows Backspace key when type is number', () => {
    const wrapper = shallowComponent({ props: { type: 'number' } });
    const preventDefault = jest.fn();
    wrapper.find('MockCreatableSelect').prop('onKeyDown')({
      nativeEvent: { key: 'Backspace' },
      preventDefault
    });
    expect(preventDefault).not.toHaveBeenCalled();
  });

  it('does not filter keys for non-number types', () => {
    const wrapper = shallowComponent();
    const preventDefault = jest.fn();
    wrapper.find('MockCreatableSelect').prop('onKeyDown')({
      nativeEvent: { key: 'a' },
      preventDefault
    });
    expect(preventDefault).not.toHaveBeenCalled();
  });

  it('merges custom menu and container styles over provided styles', () => {
    const wrapper = shallowComponent();
    const styles = wrapper.find('MockCreatableSelect').prop('styles');
    expect(styles.menu({ color: 'red' })).toEqual({ color: 'red', zIndex: 10 });
    expect(styles.container({ width: 5 })).toEqual({ width: 5, marginBottom: '1.2rem' });
  });

  it('highlights control border red when touched and error present', () => {
    const wrapper = shallowComponent({ touched: true, error: 'Required' });
    const styles = wrapper.find('MockCreatableSelect').prop('styles');
    expect(styles.control({ border: 'none', color: 'blue' })).toEqual({
      border: '1px solid red',
      color: 'blue'
    });
  });

  it('keeps default control border when no error', () => {
    const wrapper = shallowComponent();
    const styles = wrapper.find('MockCreatableSelect').prop('styles');
    expect(styles.control({ border: 'none', color: 'blue' })).toEqual({
      border: '1px solid #cacaca',
      color: 'blue'
    });
  });
});
