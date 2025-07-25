import React from 'react';
import { Icon } from '../components-new/ui';

const IconDemoNeu: React.FC = () => (
  <div style={{ display: 'flex', gap: 16 }}>
    <Icon name="fas fa-user" />
    <Icon name="fas fa-cog" />
    <Icon name="fas fa-check" color="green" />
    <Icon name="fas fa-times" color="red" />
    <Icon name="fas fa-star" color="gold" size={32} />
  </div>
);

export default IconDemoNeu; 