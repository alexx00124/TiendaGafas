import React from 'react';
import { shallow } from 'enzyme';
import CustomTextarea from '@/components/formik/CustomTextarea';

describe('CustomTextarea', () => {
  const defaultProps = {
    field: { name: 'description', value: '', onChange: jest.fn(), onBlur: jest.fn() },
    form: { touched: {}, errors: {} },
    label: 'Description',
  };

  it('renders without crashing', () => {
    const wrapper = shallow(<CustomTextarea {...defaultProps} />);
    expect(wrapper.exists()).toBe(true);
  });

  it('renders label when no error', () => {
    const wrapper = shallow(<CustomTextarea {...defaultProps} />);
    expect(wrapper.find('label.label-input').text()).toBe('Description');
    expect(wrapper.find('.label-error').exists()).toBe(false);
  });

  it('renders error when touched and error present', () => {
    const props = {
      ...defaultProps,
      form: {
        touched: { description: true },
        errors: { description: 'Description is required' },
      },
    };
    const wrapper = shallow(<CustomTextarea {...props} />);
    expect(wrapper.find('.label-error').text()).toBe('Description is required');
    expect(wrapper.find('label.label-input').exists()).toBe(false);
  });

  it('adds input-error class when touched and error present', () => {
    const props = {
      ...defaultProps,
      form: {
        touched: { description: true },
        errors: { description: 'Description is required' },
      },
    };
    const wrapper = shallow(<CustomTextarea {...props} />);
    expect(wrapper.find('textarea').hasClass('input-error')).toBe(true);
  });

  it('passes field props to textarea', () => {
    const wrapper = shallow(<CustomTextarea {...defaultProps} />);
    expect(wrapper.find('textarea').prop('name')).toBe('description');
    expect(wrapper.find('textarea').prop('id')).toBe('description');
  });

  it('passes additional props to textarea', () => {
    const props = { ...defaultProps, rows: 6 };
    const wrapper = shallow(<CustomTextarea {...props} />);
    expect(wrapper.find('textarea').prop('rows')).toBe(6);
  });
});
