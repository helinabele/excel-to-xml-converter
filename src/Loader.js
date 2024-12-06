import React from 'react';

const Loader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
    <div
      style={{
        width: '40px',
        height: '40px',
        border: '5px solid lightgray',
        borderTop: '5px solid #4CAF50',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}
    ></div>
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>
);

export default Loader;
