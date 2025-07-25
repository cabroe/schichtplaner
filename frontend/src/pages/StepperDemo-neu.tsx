import React, { useState } from 'react';
import { Stepper, Button } from '../components-new/ui';

const steps = [
  { id: 'step1', title: 'Schritt 1', description: 'Beschreibung 1' },
  { id: 'step2', title: 'Schritt 2', description: 'Beschreibung 2' },
  { id: 'step3', title: 'Schritt 3', description: 'Beschreibung 3' },
];

const StepperDemoNeu: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  return (
    <div className="container-fluid">
      <h2>Stepper Demo</h2>
      <Stepper 
        steps={steps} 
        currentStep={currentStep}
        onStepClick={handleStepClick}
        allowStepNavigation={true}
      />
      <div className="mt-3 d-flex gap-2">
        <Button 
          onClick={() => setCurrentStep(s => Math.max(0, s - 1))} 
          disabled={currentStep === 0}
        >
          Zurück
        </Button>
        <Button 
          onClick={() => setCurrentStep(s => Math.min(steps.length - 1, s + 1))} 
          disabled={currentStep === steps.length - 1}
        >
          Weiter
        </Button>
      </div>
    </div>
  );
};

export default StepperDemoNeu; 