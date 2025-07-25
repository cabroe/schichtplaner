import React from 'react';
import { LoadingSpinner } from '../components-new/ui';

const LoadingSpinnerDemoNeu: React.FC = () => (
  <div style={{ display: 'flex', gap: 24 }}>
    <LoadingSpinner />
    <LoadingSpinner size="sm" />
    <LoadingSpinner size="lg" />
    <LoadingSpinner color="primary" />
    <LoadingSpinner color="danger" />
  </div>
);

export default LoadingSpinnerDemoNeu; 