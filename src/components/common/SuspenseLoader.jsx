import { LoadingOutlined } from '@ant-design/icons';
import React from 'react';

const SuspenseLoader = () => (
  <div className="loader" style={{ minHeight: '80vh' }}>
    <h6>Loading ... </h6>
    <br />
    <LoadingOutlined />
  </div>
);

export default SuspenseLoader;
