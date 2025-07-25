import React from 'react';
import { Divider } from '../components-new/ui';

const DividerDemoNeu: React.FC = () => (
  <div>
    <div>Abschnitt 1</div>
    <Divider />
    <div>Abschnitt 2</div>
    <Divider dashed />
    <div>Abschnitt 3</div>
  </div>
);

export default DividerDemoNeu; 