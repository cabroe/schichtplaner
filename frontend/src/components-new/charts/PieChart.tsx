import React from 'react';
import type { ChartData } from './Chart';

export interface PieChartProps {
  data: ChartData[];
  title?: string;
  subtitle?: string;
  height?: number;
  width?: number;
  className?: string;
  showLegend?: boolean;
  showValues?: boolean;
  showPercentages?: boolean;
  innerRadius?: number;
  onDataPointClick?: (data: ChartData, index: number) => void;
}

/**
 * Kreisdiagramm-Komponente
 */
export const PieChart: React.FC<PieChartProps> = ({
  data,
  title,
  subtitle,
  height = 300,
  width,
  className = '',
  showLegend = true,
  showValues = false,
  showPercentages = true,
  innerRadius = 0,
  onDataPointClick
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const centerX = 50;
  const centerY = 50;
  const radius = 40;

  const generateSlices = () => {
    let currentAngle = 0;
    
    return data.map((item, index) => {
      const percentage = (item.value / total) * 100;
      const angle = (percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      
      currentAngle += angle;
      
      const startRadians = (startAngle - 90) * (Math.PI / 180);
      const endRadians = (endAngle - 90) * (Math.PI / 180);
      
      const x1 = centerX + radius * Math.cos(startRadians);
      const y1 = centerY + radius * Math.sin(startRadians);
      const x2 = centerX + radius * Math.cos(endRadians);
      const y2 = centerY + radius * Math.sin(endRadians);
      
      const largeArcFlag = angle > 180 ? 1 : 0;
      
      const path = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ');
      
      const innerPath = innerRadius > 0 ? [
        `M ${centerX} ${centerY}`,
        `L ${centerX + innerRadius * Math.cos(startRadians)} ${centerY + innerRadius * Math.sin(startRadians)}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${centerX + innerRadius * Math.cos(endRadians)} ${centerY + innerRadius * Math.sin(endRadians)}`,
        'Z'
      ].join(' ') : '';
      
      return {
        path,
        innerPath,
        percentage,
        color: item.color || `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
        item,
        index
      };
    });
  };

  const slices = generateSlices();

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
          {slices.map((slice, index) => (
            <g key={index}>
              <path
                d={slice.path}
                fill={slice.color}
                stroke="#fff"
                strokeWidth="1"
                style={{ cursor: 'pointer' }}
                onClick={() => onDataPointClick?.(slice.item, slice.index)}
              />
              {innerRadius > 0 && (
                <path
                  d={slice.innerPath}
                  fill="#fff"
                />
              )}
            </g>
          ))}
          
          {innerRadius > 0 && (
            <circle
              cx={centerX}
              cy={centerY}
              r={innerRadius}
              fill="#fff"
            />
          )}
        </svg>
      </div>
      
      {showLegend && (
        <div className="mt-3">
          <div className="d-flex flex-wrap gap-2">
            {slices.map((slice, index) => (
              <div 
                key={index} 
                className="d-flex align-items-center"
                style={{ cursor: 'pointer' }}
                onClick={() => onDataPointClick?.(slice.item, slice.index)}
              >
                <div 
                  className="me-2"
                  style={{ 
                    backgroundColor: slice.color,
                    width: '12px',
                    height: '12px',
                    borderRadius: '2px'
                  }}
                />
                <span className="small me-2">{slice.item.label}</span>
                {showValues && (
                  <span className="small text-muted me-1">
                    ({slice.item.value})
                  </span>
                )}
                {showPercentages && (
                  <span className="small text-muted">
                    {slice.percentage.toFixed(1)}%
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PieChart; 