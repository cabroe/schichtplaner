import React from 'react';
import { formatDate } from '../../utils/dateUtils';
import { formatWeekday } from '../../utils/shiftUtils';
import ShiftBadge from './ShiftBadge';
import type { Employee, ShiftType, ShiftTemplate } from '../../types/shift';

interface ShiftTemplateModalProps {
  show: boolean;
  onHide: () => void;
  selectedCell: {
    employee: Employee;
    day: Date;
    shiftType: ShiftType;
  } | null;
  templates: ShiftTemplate[];
  onTemplateSelect: (templateId: string) => void;
}

const ShiftTemplateModal: React.FC<ShiftTemplateModalProps> = ({
  show,
  onHide,
  selectedCell,
  templates,
  onTemplateSelect
}) => {
  return (
    <div className={`modal ${show ? 'show d-block' : ''}`} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Schichtvorlage auswählen</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onHide}
            />
          </div>
          <div className="modal-body">
            {selectedCell && (
              <div className="mb-3">
                <p className="mb-1">
                  <strong>Mitarbeiter:</strong> {selectedCell.employee.name}
                </p>
                <p className="mb-1">
                  <strong>Datum:</strong> {formatDate(selectedCell.day)} ({formatWeekday(selectedCell.day)})
                </p>
                {selectedCell.shiftType && (
                  <p className="mb-0">
                    <strong>Aktuelle Schicht:</strong> <ShiftBadge shiftType={selectedCell.shiftType} />
                  </p>
                )}
              </div>
            )}
            
            <div className="list-group">
              {templates.map(template => (
                <button
                  key={template.id}
                  className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                  onClick={() => onTemplateSelect(template.id)}
                >
                  <div>
                    <h6 className="mb-1">{template.name}</h6>
                    <small className="text-muted">{template.description}</small>
                  </div>
                  <div className="d-flex">
                    {template.weekPattern.map((shift, index) => (
                      <span key={index} className="mx-1">
                        <ShiftBadge shiftType={shift} />
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onHide}
            >
              Abbrechen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShiftTemplateModal; 