import React from 'react';
import '../../index.css'; // Import global styles for CSS variables and classes

const MainLoader = ({ text = "Page is loading..." }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh', // Take full viewport height
      backgroundColor: 'var(--color-background)', // Use background color from theme
      width: '100%',
      position: 'fixed', // Fixed position to cover the entire screen
      top: 0,
      left: 0,
      zIndex: 9999, // Ensure it's on top of other content
    }}>
      <div className="loading-spinner"></div>
      <p style={{
        marginTop: 'var(--spacing-md)',
        fontSize: 'var(--font-size-lg)',
        color: 'var(--color-primary-dark)',
        fontWeight: '600'
      }}>{text}</p>
    </div>
  );
};

export default MainLoader;
