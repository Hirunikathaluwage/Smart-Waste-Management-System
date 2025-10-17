import React from 'react';

const SimpleTest = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ color: 'red', fontSize: '32px' }}>🚨 SIMPLE TEST PAGE 🚨</h1>
      <p style={{ fontSize: '18px', color: 'blue' }}>If you can see this, React is working!</p>
      <div style={{ marginTop: '20px', padding: '20px', backgroundColor: 'white', border: '2px solid green' }}>
        <h2>Bin Simulation Test</h2>
        <p>Current time: {new Date().toLocaleString()}</p>
        <p>Random number: {Math.random()}</p>
        <div style={{ marginTop: '10px' }}>
          <button 
            onClick={() => alert('Button works!')}
            style={{ padding: '10px 20px', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '5px' }}
          >
            Test Button
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleTest;

