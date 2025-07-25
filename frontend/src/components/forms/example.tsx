import React, { useState } from 'react';
import { 
  Form, 
  FormGroup, 
  Input, 
  Textarea, 
  Select, 
  Checkbox, 
  RadioGroup, 
  ColorDropdown 
} from './index';

// Beispiel für die Verwendung der Form-Komponenten
export const ExampleForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: '',
    category: '',
    notifications: false,
    priority: 'medium',
    color: '#206bc4'
  });

  const handleSubmit = async (data: Record<string, any>) => {
    setLoading(true);
    
    // Simuliere API-Aufruf
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Formular-Daten:', data);
    setFormData({
      name: data.name ?? '',
      email: data.email ?? '',
      description: data.description ?? '',
      category: data.category ?? '',
      notifications: data.notifications ?? false,
      priority: data.priority ?? 'medium',
      color: data.color ?? '#206bc4'
    });
    setLoading(false);
  };

  const categoryOptions = [
    { value: 'bug', label: 'Bug Report' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'improvement', label: 'Improvement' },
    { value: 'other', label: 'Other' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Niedrig' },
    { value: 'medium', label: 'Mittel' },
    { value: 'high', label: 'Hoch' },
    { value: 'urgent', label: 'Dringend' }
  ];

  const colorOptions = [
    { value: '#206bc4', label: 'Blau' },
    { value: '#4299e1', label: 'Hellblau' },
    { value: '#2d3748', label: 'Grau' },
    { value: '#48bb78', label: 'Grün' },
    { value: '#ed8936', label: 'Orange' },
    { value: '#e53e3e', label: 'Rot' },
    { value: '#9f7aea', label: 'Lila' },
    { value: '#f6ad55', label: 'Gelb' }
  ];

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <i className="fas fa-edit me-2"></i>
                Beispiel-Formular
              </h3>
            </div>
            <div className="card-body">
              <Form 
                onSubmit={handleSubmit}
                loading={loading}
                initialValues={formData}
              >
                <FormGroup 
                  label="Name" 
                  htmlFor="name" 
                  required
                  helpText="Geben Sie Ihren vollständigen Namen ein"
                >
                  <Input
                    type="text"
                    name="name"
                    placeholder="Max Mustermann"
                    required
                  />
                </FormGroup>

                <FormGroup 
                  label="E-Mail" 
                  htmlFor="email" 
                  required
                >
                  <Input
                    type="email"
                    name="email"
                    placeholder="max@example.com"
                    required
                  />
                </FormGroup>

                <FormGroup 
                  label="Beschreibung" 
                  htmlFor="description"
                >
                  <Textarea
                    name="description"
                    placeholder="Beschreiben Sie Ihr Anliegen..."
                    rows={4}
                  />
                </FormGroup>

                <FormGroup 
                  label="Kategorie" 
                  htmlFor="category" 
                  required
                >
                  <Select
                    name="category"
                    options={categoryOptions}
                    placeholder="Kategorie auswählen"
                    required
                  />
                </FormGroup>

                <FormGroup 
                  label="Priorität" 
                  htmlFor="priority"
                >
                  <RadioGroup
                    name="priority"
                    options={priorityOptions}
                    inline
                  />
                </FormGroup>

                <FormGroup 
                  label="Farbe" 
                  htmlFor="color"
                >
                  <ColorDropdown
                    name="color"
                    value={formData.color}
                    onChange={(color) => setFormData(prev => ({ ...prev, color }))}
                    options={colorOptions}
                  />
                </FormGroup>

                <FormGroup>
                  <Checkbox
                    name="notifications"
                    label="E-Mail-Benachrichtigungen erhalten"
                  />
                </FormGroup>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 