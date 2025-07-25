import React from 'react';
import type { ChartData } from './Chart';

export interface LineChartProps {
  data: ChartData[];
  title?: string;
  subtitle?: string;
  height?: number;
  width?: number;
  className?: string;
  showLegend?: boolean;
  showGrid?: boolean;
  responsive?: boolean;
  lineColor?: string;
  fillArea?: boolean;
  smooth?: boolean;
  onDataPointClick?: (data: ChartData, index: number) => void;
}

/**
 * Liniendiagramm-Komponente
 */
export const LineChart: React.FC<LineChartProps> = ({
  data,
  title,
  subtitle,
  height = 300,
  width,
  className = '',
  showLegend = true,
  showGrid = true,
  lineColor = '#206bc4',
  fillArea = false,
  onDataPointClick
}) => {
  const maxValue = Math.max(...data.map(item => item.value));
  const minValue = Math.min(...data.map(item => item.value));
  const valueRange = maxValue - minValue;

  const getPointPosition = (value: number, index: number) => {
    const x = (index / (data.length - 1)) * 100;
    const y = valueRange > 0 ? 100 - ((value - minValue) / valueRange) * 100 : 50;
    return { x, y };
  };

  const generatePath = () => {
    if (data.length < 2) return '';

    const points = data.map((item, index) => {
      const pos = getPointPosition(item.value, index);
      return `${pos.x}% ${pos.y}%`;
    });

    return points.join(' L ');
  };

  const generateAreaPath = () => {
    if (data.length < 2) return '';

    const linePoints = data.map((item, index) => {
      const pos = getPointPosition(item.value, index);
      return `${pos.x}% ${pos.y}%`;
    });

    const areaPoints = [
      ...linePoints,
      ...data.map((_, index) => {
        const x = (index / (data.length - 1)) * 100;
        return `${x}% 100%`;
      }).reverse()
    ];

    return areaPoints.join(' L ');
  };

  return (
    <div className={className}>
      {(title || subtitle) && (
        <div className="mb-3">
          {title && <h4>{title}</h4>}
          {subtitle && <p className="text-muted small">{subtitle}</p>}
        </div>
      )}
      
      <div 
        style={{ 
          height: `${height}px`,
          width: width ? `${width}px` : '100%',
          position: 'relative'
        }}
      >
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 100 100"
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          {showGrid && (
            <g className="grid">
              {[0, 25, 50, 75, 100].map(y => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="100"
                  y2={y}
                  stroke="#e9ecef"
                  strokeWidth="0.5"
                />
              ))}
            </g>
          )}
          
          {fillArea && (
            <path
              d={`M ${generateAreaPath()} Z`}
              fill={lineColor}
              fillOpacity="0.1"
            />
          )}
          
          <path
            d={`M ${generatePath()}`}
            stroke={lineColor}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {data.map((item, index) => {
            const pos = getPointPosition(item.value, index);
            return (
              <circle
                key={index}
                cx={`${pos.x}%`}
                cy={`${pos.y}%`}
                r="3"
                fill={lineColor}
                style={{ cursor: 'pointer' }}
                onClick={() => onDataPointClick?.(item, index)}
              />
            );
          })}
        </svg>
      </div>
      
      {showLegend && (
        <div className="mt-3">
          <div className="d-flex flex-wrap gap-2">
            {data.map((item, index) => (
              <div key={index} className="d-flex align-items-center">
                <div 
                  className="me-2"
                  style={{ 
                    backgroundColor: item.color || lineColor,
                    width: '12px',
                    height: '12px',
                    borderRadius: '2px'
                  }}
                />
                <span className="small">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LineChart; 