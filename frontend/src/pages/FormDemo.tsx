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
} from '../components/forms';

interface FormData {
  name: string;
  email: string;
  phone: string;
  description: string;
  category: string;
  priority: string;
  color: string;
  notifications: boolean;
  newsletter: boolean;
  terms: boolean;
}

const FormDemo: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    description: '',
    category: '',
    priority: 'medium',
    color: '#206bc4',
    notifications: false,
    newsletter: false,
    terms: false
  });



  const handleSubmit = async (data: Record<string, any>) => {
    setLoading(true);
    
    // Simuliere API-Aufruf
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Formular-Daten:', data);
    
    // Aktualisiere den State mit den neuen Daten
    setFormData({
      name: data.name ?? '',
      email: data.email ?? '',
      phone: data.phone ?? '',
      description: data.description ?? '',
      category: data.category ?? '',
      priority: data.priority ?? 'medium',
      color: data.color ?? '#206bc4',
      notifications: data.notifications ?? false,
      newsletter: data.newsletter ?? false,
      terms: data.terms ?? false
    });
    
    setLoading(false);
    
    // Zeige Erfolgsmeldung
    alert('Formular erfolgreich gesendet!');
  };

  const handleFormSubmit = async (data: Record<string, any>) => {
    // Browser-eigene Validierung wird automatisch durchgeführt
    // durch die HTML5-Attribute (required, pattern, etc.)
    await handleSubmit(data);
  };

  const categoryOptions = [
    { value: 'bug', label: 'Bug Report' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'improvement', label: 'Verbesserungsvorschlag' },
    { value: 'question', label: 'Frage' },
    { value: 'other', label: 'Sonstiges' }
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
    { value: '#f6ad55', label: 'Gelb' },
    { value: '#38b2ac', label: 'Türkis' },
    { value: '#f56565', label: 'Pink' }
  ];

  return (
    <div className="container-xl">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <i className="fas fa-edit me-2"></i>
                Form-Komponenten Demo
              </h3>
              <div className="card-actions">
                <span className="badge bg-primary">Demo</span>
              </div>
            </div>
            <div className="card-body">
              <div className="alert alert-info">
                <i className="fas fa-info-circle me-2"></i>
                Diese Seite demonstriert alle verfügbaren Form-Komponenten mit Tabler.io Styling und Font Awesome Icons.
              </div>

              <Form 
                onSubmit={handleFormSubmit}
                loading={loading}
                initialValues={formData}
              >
                <div className="row">
                  <div className="col-md-6">
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
                    autoFocus
                    minLength={2}
                    maxLength={50}
                    title="Name muss zwischen 2 und 50 Zeichen lang sein"
                  />
                    </FormGroup>
                  </div>
                  
                  <div className="col-md-6">
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
                    title="Bitte geben Sie eine gültige E-Mail-Adresse ein"
                  />
                    </FormGroup>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                                    <FormGroup 
                  label="Telefonnummer" 
                  htmlFor="phone" 
                  required
                >
                                        <Input
                    type="tel"
                    name="phone"
                    placeholder="+49 123 456789"
                    required
                    pattern="[\+]?[0-9\s\-\(\)]{10,}"
                    title="Bitte geben Sie eine gültige Telefonnummer ein (mindestens 10 Ziffern)"
                  />
                    </FormGroup>
                  </div>
                  
                  <div className="col-md-6">
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
                    title="Bitte wählen Sie eine Kategorie aus"
                  />
                    </FormGroup>
                  </div>
                </div>

                <FormGroup 
                  label="Beschreibung" 
                  htmlFor="description"
                  helpText="Beschreiben Sie Ihr Anliegen detailliert"
                >
                  <Textarea
                    name="description"
                    placeholder="Beschreiben Sie Ihr Problem oder Ihre Anfrage..."
                    rows={4}
                    maxLength={1000}
                    title="Beschreibung kann maximal 1000 Zeichen lang sein"
                  />
                </FormGroup>

                <div className="row">
                  <div className="col-md-6">
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
                  </div>
                  
                  <div className="col-md-6">
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
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <FormGroup label="Benachrichtigungen">
                      <Checkbox
                        name="notifications"
                        label="E-Mail-Benachrichtigungen erhalten"
                      />
                    </FormGroup>
                  </div>
                  
                  <div className="col-md-6">
                    <FormGroup label="Newsletter">
                      <Checkbox
                        name="newsletter"
                        label="Newsletter abonnieren"
                      />
                    </FormGroup>
                  </div>
                </div>

                <FormGroup>
                  <Checkbox
                    name="terms"
                    label="Ich stimme den Datenschutzbedingungen und der Nutzungsvereinbarung zu"
                    required
                    title="Sie müssen den Bedingungen zustimmen, um fortzufahren"
                  />
                </FormGroup>
              </Form>
            </div>
          </div>

          {/* Zusätzliche Demo-Sektionen */}
          <div className="row mt-4">
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">
                    <i className="fas fa-cog me-2"></i>
                    Komponenten-Info
                  </h4>
                </div>
                <div className="card-body">
                  <ul className="list-unstyled">
                    <li><i className="fas fa-check text-success me-2"></i>Tabler.io Styling</li>
                    <li><i className="fas fa-check text-success me-2"></i>Font Awesome Icons</li>
                    <li><i className="fas fa-check text-success me-2"></i>TypeScript Support</li>
                    <li><i className="fas fa-check text-success me-2"></i>Accessibility</li>
                    <li><i className="fas fa-check text-success me-2"></i>Error Handling</li>
                    <li><i className="fas fa-check text-success me-2"></i>Loading States</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">
                    <i className="fas fa-code me-2"></i>
                    Verwendung
                  </h4>
                </div>
                <div className="card-body">
                  <p className="text-muted">
                    Importieren Sie die Komponenten aus dem forms-Modul:
                  </p>
                  <code className="d-block bg-light p-2 rounded">
                    import {'{'} Form, FormGroup, Input {'}'} from '../components';
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormDemo; 