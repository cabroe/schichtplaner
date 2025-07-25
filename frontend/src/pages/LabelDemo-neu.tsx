import React from 'react';
import { Label } from '../components-new/ui';

const LabelDemoNeu: React.FC = () => (
  <div>
    <Label htmlFor="input1">Standard Label</Label>
    <input id="input1" type="text" />
    <br />
    <Label htmlFor="input2" required>Pflichtfeld</Label>
    <input id="input2" type="text" />
  </div>
);

export default LabelDemoNeu; 