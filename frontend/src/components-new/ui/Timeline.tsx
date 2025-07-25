import React from 'react';
import { Icon } from './Icon';

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  date?: string;
  icon?: string;
  color?: string;
  status?: 'pending' | 'active' | 'completed' | 'error';
  content?: React.ReactNode;
}

export interface TimelineProps {
  items: TimelineItem[];
  variant?: 'default' | 'vertical' | 'horizontal';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showConnectors?: boolean;
  align?: 'left' | 'center' | 'right';
}

/**
 * Timeline-Komponente
 */
export const Timeline: React.FC<TimelineProps> = ({
  items,
  variant = 'default',
  size = 'md',
  className = '',
  showConnectors = true,
  align = 'left'
}) => {
  const getTimelineClass = () => {
    const classes = [
      'd-flex',
      variant === 'vertical' ? 'flex-column' : 'flex-row',
      align === 'center' ? 'justify-content-center' : align === 'right' ? 'justify-content-end' : '',
      size === 'sm' ? 'small' : size === 'lg' ? 'fs-5' : '',
      className
    ];
    return classes.filter(Boolean).join(' ');
  };

  const getItemClass = (item: TimelineItem, index: number) => {
    const classes = [
      'd-flex align-items-start mb-3',
      item.status ? `text-${item.status === 'completed' ? 'success' : item.status === 'active' ? 'primary' : item.status === 'error' ? 'danger' : 'muted'}` : '',
      index % 2 === 0 ? 'me-3' : 'ms-3'
    ];
    return classes.filter(Boolean).join(' ');
  };

  const getIconClass = () => {
    return 'ti ti-circle-fill text-primary';
  };

  const getIconColor = (item: TimelineItem) => {
    if (item.color) return item.color;
    
    switch (item.status) {
      case 'completed': return '#28a745';
      case 'active': return '#007bff';
      case 'error': return '#dc3545';
      case 'pending': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const renderIcon = (item: TimelineItem) => {     
    if (item.icon) {
      return <Icon name={item.icon as any} size="sm" />;
    }
    
    switch (item.status) {
      case 'completed': return <Icon name="check" size="sm" />;
      case 'active': return <Icon name="play" size="sm" />;
      case 'error': return <Icon name="times" size="sm" />;
      case 'pending': return <Icon name="clock" size="sm" />;
      default: return <Icon name="question" size="sm" />;
    }
  };

  const renderItem = (item: TimelineItem, index: number) => {
    const isLast = index === items.length - 1;
    
    return (
      <div key={item.id} className={getItemClass(item, index)}>
        <div className="d-flex align-items-start">
          <div 
            className={getIconClass()}
            style={{ 
              backgroundColor: getIconColor(item),
              color: 'white',
              width: '32px',
              height: '32px'
            }}
          >
            {renderIcon(item)}
          </div>
          
          <div className="flex-fill">
            <div className="mb-1">
              <h6 className="mb-1">{item.title}</h6>
              {item.date && (
                <small className="text-muted">
                  {item.date}
                </small>
              )}
            </div>
            
            {item.description && (
              <p className="text-muted small mb-2">
                {item.description}
              </p>
            )}
            
            {item.content && (
              <div className="mt-2">
                {item.content}
              </div>
            )}
          </div>
        </div>
        
        {showConnectors && !isLast && (
          <div className="mx-auto" style={{ width: '2px', height: '20px', backgroundColor: '#dee2e6' }} />
        )}
      </div>
    );
  };

  return (
    <div className={getTimelineClass()}>
      {items.map(renderItem)}
    </div>
  );
};

export default Timeline; 