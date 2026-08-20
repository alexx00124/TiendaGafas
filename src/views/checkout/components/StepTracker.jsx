import PropType from 'prop-types';
import React from 'react';

const StepTracker = ({ current }) => {
  const getClassName = (step) => {
    if (current === step) return 'is-active-step';
    if (step < current) return 'is-done-step';
    return '';
  };

  return (
    <div className="checkout-header">
      <ul className="checkout-header-menu">
        <li className={`checkout-header-list ${getClassName(1)}`}>
          <div className="checkout-header-item">
            <div className="checkout-header-icon">
              <h4 className="checkout-header-step">1</h4>
            </div>
            <h6 className="checkout-header-subtitle">Order Summary</h6>
          </div>
        </li>
        <li className={`checkout-header-list ${getClassName(2)}`}>
          <div className="checkout-header-item">
            <div className="checkout-header-icon">
              <h4 className="checkout-header-step">2</h4>
            </div>
            <h6 className="checkout-header-subtitle">Shipping Details</h6>
          </div>
        </li>
        <li className={`checkout-header-list ${getClassName(3)}`}>
          <div className="checkout-header-item">
            <div className="checkout-header-icon">
              <h4 className="checkout-header-step">3</h4>
            </div>
            <h6 className="checkout-header-subtitle">Payment</h6>
          </div>
        </li>
      </ul>
    </div>
  );
};

StepTracker.propTypes = {
  current: PropType.number.isRequired
};

export default StepTracker;
