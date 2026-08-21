import React from 'react';
import { shallow } from 'enzyme';
import ColorChooser from '@/components/common/ColorChooser';

describe('ColorChooser', () => {
  const colors = ['#ff0000', '#00ff00', '#0000ff'];

  it('renders without crashing', () => {
    const wrapper = shallow(
      <ColorChooser availableColors={colors} onSelectedColorChange={() => {}} />
    );
    expect(wrapper.exists()).toBe(true);
  });

  it('renders a color item for each color', () => {
    const wrapper = shallow(
      <ColorChooser availableColors={colors} onSelectedColorChange={() => {}} />
    );
    expect(wrapper.find('.color-item').length).toBe(3);
  });

  it('applies correct backgroundColor style', () => {
    const wrapper = shallow(
      <ColorChooser availableColors={colors} onSelectedColorChange={() => {}} />
    );
    expect(wrapper.find('.color-item').at(0).prop('style')).toEqual({ backgroundColor: '#ff0000' });
    expect(wrapper.find('.color-item').at(1).prop('style')).toEqual({ backgroundColor: '#00ff00' });
    expect(wrapper.find('.color-item').at(2).prop('style')).toEqual({ backgroundColor: '#0000ff' });
  });

  it('calls onSelectedColorChange when a color is clicked', () => {
    const onChange = jest.fn();
    const wrapper = shallow(
      <ColorChooser availableColors={colors} onSelectedColorChange={onChange} />
    );
    wrapper.find('.color-item').at(1).simulate('click');
    expect(onChange).toHaveBeenCalledWith('#00ff00');
  });

  it('adds selected class to clicked color', () => {
    const wrapper = shallow(
      <ColorChooser availableColors={colors} onSelectedColorChange={() => {}} />
    );
    wrapper.find('.color-item').at(0).simulate('click');
    expect(wrapper.find('.color-item').at(0).hasClass('color-item-selected')).toBe(true);
  });

  it('does not have selected class on unselected colors', () => {
    const wrapper = shallow(
      <ColorChooser availableColors={colors} onSelectedColorChange={() => {}} />
    );
    wrapper.find('.color-item').at(0).simulate('click');
    expect(wrapper.find('.color-item').at(1).hasClass('color-item-selected')).toBe(false);
  });

  it('renders the color-chooser wrapper', () => {
    const wrapper = shallow(
      <ColorChooser availableColors={colors} onSelectedColorChange={() => {}} />
    );
    expect(wrapper.find('.color-chooser').exists()).toBe(true);
  });
});
