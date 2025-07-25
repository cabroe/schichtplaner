import React from 'react';
import type { ChartProps, ChartData } from './Chart';

export interface BarChartProps extends Omit<ChartProps, 'type'> {
  horizontal?: boolean;
  stacked?: boolean;
  showValues?: boolean;
  barWidth?: number;
  barSpacing?: number;
}

/**
 * Balkendiagramm-Komponente
 */
export const BarChart: React.FC<BarChartProps> = ({
  data,
  horizontal = false,
  stacked = false,
  showValues = false,
  barWidth = 40,
  barSpacing = 10,
  ...chartProps
}) => {
  const maxValue = Math.max(...data.map(item => item.value));
  
  const renderBar = (item: ChartData, index: number) => {
    const percentage = (item.value / maxValue) * 100;
    const barColor = item.color || `hsl(${(index * 137.5) % 360}, 70%, 50%)`;
    
    return (
      <div 
        key={index}
        className="mb-3"
        style={{ 
          marginBottom: barSpacing,
          cursor: 'pointer'
        }}
        onClick={() => chartProps.onDataPointClick?.(item, index)}
      >
        <div className="d-flex align-items-center mb-1">
          <span className="small me-2" style={{ minWidth: '80px' }}>
            {item.label}
          </span>
          {showValues && (
            <span className="small text-muted">
              {item.value}
            </span>
          )}
        </div>
        <div style={{ height: barWidth }}>
          <div 
            style={{
              width: `${percentage}%`,
              height: '100%',
              backgroundColor: barColor,
              borderRadius: '0.25rem',
              transition: 'width 0.3s ease'
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div>
      {data.map(renderBar)}
    </div>
  );
};

export default BarChart; 