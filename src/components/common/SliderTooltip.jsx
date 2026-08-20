import PropType from 'prop-types';
import React from 'react';

const tooltipWrapperStyle = (percent) => ({
  left: `${percent}%`,
  position: 'absolute',
  marginLeft: '-11px',
  marginTop: '-35px'
});

const SliderTooltip = ({ percent, value }) => (
  <div style={tooltipWrapperStyle(percent)}>
    <div className="tooltip">
      <span className="tooltiptext">
        Value:
        {value}
      </span>
    </div>
  </div>
);

SliderTooltip.propTypes = {
  percent: PropType.number.isRequired,
  value: PropType.number.isRequired
};

export default SliderTooltip;
