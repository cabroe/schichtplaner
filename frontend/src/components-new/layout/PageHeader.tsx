import React from 'react';
import { Button } from '../ui';

export interface PageHeaderProps {
  /** Seiten-Titel */
  title: string;
  /** Seiten-Untertitel */
  subtitle?: string;
  /** Breadcrumb-Elemente */
  breadcrumb?: Array<{
    label: string;
    href?: string;
    active?: boolean;
  }>;
  /** Aktionen im Header */
  actions?: React.ReactNode;
  /** Status-Badges */
  status?: React.ReactNode;
  /** Zusätzliche CSS-Klassen */
  className?: string;
  /** Zusätzliche Styles */
  style?: React.CSSProperties;
  /** Zurück-Button */
  backButton?: {
    href?: string;
    onClick?: () => void;
    label?: string;
  };
  /** Header mit Border */
  bordered?: boolean;
  /** Header kompakt */
  compact?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumb,
  actions,
  status,
  className = '',
  style,
  backButton,
  bordered = true,
  compact = false
}) => {
  const baseClasses = 'py-3';
  const borderedClasses = bordered ? 'border-bottom' : '';
  const compactClasses = compact ? 'py-2' : '';
  
  const combinedClasses = [
    baseClasses,
    borderedClasses,
    compactClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={combinedClasses} style={style}>
      <div className="container-xl">
        <div className="row align-items-center">
          <div className="col">
            {/* Breadcrumb */}
            {breadcrumb && breadcrumb.length > 0 && (
              <nav aria-label="breadcrumb" className="mb-2">
                <ol className="breadcrumb">
                  {breadcrumb.map((item, index) => (
                    <li
                      key={index}
                      className={`breadcrumb-item ${item.active ? 'active' : ''}`}
                      aria-current={item.active ? 'page' : undefined}
                    >
                      {item.href && !item.active ? (
                                              <a href={item.href} className="text-decoration-none">
                        {item.label}
                      </a>
                      ) : (
                        item.label
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            {/* Zurück-Button */}
            {backButton && (
              <div className="mb-2">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={backButton.onClick}
                >
                  ← {backButton.label || 'Zurück'}
                </Button>
              </div>
            )}

            {/* Titel und Untertitel */}
            <div>
              <h1 className="h2 mb-2">{title}</h1>
              {subtitle && (
                <p className="text-muted mb-0">{subtitle}</p>
              )}
            </div>

            {/* Status */}
            {status && (
              <div className="mt-2">
                {status}
              </div>
            )}
          </div>

          {/* Aktionen */}
          {actions && (
            <div className="col-auto">
              <div>
                {actions}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(PageHeader); 