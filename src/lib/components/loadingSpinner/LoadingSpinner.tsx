import { FC } from 'react';
import styles from './loadingSpinner.module.css';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: FC<LoadingSpinnerProps> = ({ 
  size = 'md',
  className = ''
}) => {
  return (
    <div 
      className={`${styles.spinner} ${styles[size]} ${className}`}
      role="progressbar"
      aria-label="Loading"
    >
      <div className={styles.bounce1}></div>
      <div className={styles.bounce2}></div>
      <div className={styles.bounce3}></div>
    </div>
  );
}; 