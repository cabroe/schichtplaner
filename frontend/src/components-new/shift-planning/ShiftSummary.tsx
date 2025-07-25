import React from 'react';
import Card from '../ui/Card';
import { Icon } from '../ui/Icon';

export interface ShiftSummaryItem {
  label: string;
  value: string | number;
  icon?: string;
  color?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export interface ShiftSummaryProps {
  items: ShiftSummaryItem[];
  title?: string;
  className?: string;
  layout?: 'grid' | 'list';
  columns?: number;
}

/**
 * Schicht-Zusammenfassungskomponente
 */
export const ShiftSummary: React.FC<ShiftSummaryProps> = ({
  items,
  title = 'Zusammenfassung',
  className = '',
  layout = 'grid',
  columns = 4
}) => {
  const gridClass = layout === 'grid' ? `row row-cols-${columns} g-3` : 'd-flex flex-column gap-3';

  const renderItem = (item: ShiftSummaryItem, index: number) => {
    const trendIcon = item.trend === 'up' ? 'trending-up' : 
                     item.trend === 'down' ? 'trending-down' : undefined;
    
    const trendColor = item.trend === 'up' ? 'text-success' : 
                      item.trend === 'down' ? 'text-danger' : 'text-muted';

    return (
      <div key={index} className={layout === 'grid' ? 'col' : ''}>
        <div className="d-flex align-items-center">
          {item.icon && (
            <div 
              className="rounded-circle d-flex align-items-center justify-content-center me-3"
              style={{ 
                backgroundColor: item.color || 'var(--tblr-primary)',
                width: '32px', 
                height: '32px' 
              }}
            >
              <Icon name={item.icon as any} />
            </div>
          )}
          <div className="flex-fill">
            <div className="text-muted small">{item.label}</div>
            <div className="d-flex align-items-center">
              <span className="fw-bold">{item.value}</span>
              {trendIcon && (
                <Icon 
                  name={trendIcon as any} 
                  className={`ms-2 ${trendColor}`}
                  size="sm"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card 
      title={title}
      className={className}
    >
      <div className={gridClass}>
        {items.map(renderItem)}
      </div>
    </Card>
  );
};

export default ShiftSummary; 