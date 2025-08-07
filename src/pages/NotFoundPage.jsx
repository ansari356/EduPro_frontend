import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css'; // Import global styles for CSS variables and classes

const NotFoundPage = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: 'var(--color-background)',
      color: 'var(--color-primary-dark)',
      textAlign: 'center',
      padding: 'var(--spacing-xl)',
    }}>
      <h1 style={{
        fontSize: 'var(--font-size-3xl)',
        fontWeight: '700',
        marginBottom: 'var(--spacing-md)',
        color: 'var(--color-primary)',
      }}>
        404
      </h1>
      <h2 style={{
        fontSize: 'var(--font-size-xxl)',
        fontWeight: '600',
        marginBottom: 'var(--spacing-lg)',
        color: 'var(--color-secondary)',
      }}>
        Page Not Found
      </h2>
      <p style={{
        fontSize: 'var(--font-size-lg)',
        marginBottom: 'var(--spacing-xl)',
        color: 'var(--color-text-muted)',
      }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/" style={{
        backgroundColor: 'var(--color-primary-light)',
        color: 'var(--color-card-background)',
        fontWeight: '600',
        borderRadius: 'var(--border-radius-md)',
        padding: 'var(--spacing-sm) var(--spacing-xl)',
        border: '1px solid var(--color-border)',
        cursor: 'pointer',
        transition: 'all var(--transition-fast)',
        fontSize: 'var(--font-size-base)',
        textDecoration: 'none',
      }}>
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;
