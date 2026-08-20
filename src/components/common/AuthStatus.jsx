import { LoadingOutlined } from '@ant-design/icons';
import PropType from 'prop-types';
import React from 'react';

const AuthStatus = ({ authStatus, children }) => (
  <div className="auth-content">
    {authStatus?.success && (
      <div className="loader">
        <h3 className="toast-success auth-success">
          {authStatus.message}
          <LoadingOutlined />
        </h3>
      </div>
    )}
    {!authStatus?.success && (
      <>
        {authStatus?.message && (
          <h5 className="text-center toast-error">
            {authStatus?.message}
          </h5>
        )}
        <div className={`auth ${authStatus?.message && (!authStatus?.success && 'input-error')}`}>
          {children}
        </div>
      </>
    )}
  </div>
);

AuthStatus.propTypes = {
  authStatus: PropType.shape({
    success: PropType.bool,
    message: PropType.string
  }),
  children: PropType.node.isRequired
};

AuthStatus.defaultProps = {
  authStatus: null
};

export default AuthStatus;
