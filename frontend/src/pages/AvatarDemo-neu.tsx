import React from 'react';
import { Avatar, Badge } from '../components-new/ui';

const AvatarDemoNeu: React.FC = () => (
  <div style={{ display: 'flex', gap: 24 }}>
    <Avatar fallback="MM" alt="Max Mustermann" />
    <Avatar fallback="EM" src="https://randomuser.me/api/portraits/women/44.jpg" alt="Erika Musterfrau" />
    <Avatar fallback="A" size="lg" alt="Admin" />
    <Avatar fallback="G" size="sm" alt="Gast" />
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <Avatar fallback="MB" alt="Mit Badge" />
      <Badge variant="success" style={{ position: 'absolute', top: -5, right: -5 }}>Neu</Badge>
    </div>
  </div>
);

export default AvatarDemoNeu; 