import React from 'react';

export interface ChartData {
  label: string;
  value: number;
  color?: string;
  data?: Record<string, any>;
}

export interface ChartProps {
  data: ChartData[];
  type: 'bar' | 'line' | 'pie' | 'doughnut';
  title?: string;
  subtitle?: string;
  height?: number;
  width?: number;
  className?: string;
  showLegend?: boolean;
  showGrid?: boolean;
  onDataPointClick?: (data: ChartData, index: number) => void;
}

/**
 * Basis-Chart-Komponente
 */
export const Chart: React.FC<ChartProps> = ({
  data,
  type = 'line',
  title,
  subtitle,
  height = 300,
  width = 400,
  className = '',
  showLegend = true
}) => {
  const chartId = `chart-${Math.random().toString(36).substr(2, 9)}`;

  const getChartClass = () => {
    const classes = [className];
    return classes.filter(Boolean).join(' ');
  };

  const renderLegend = () => {
    if (!showLegend) return null;

    return (
      <div className="mt-3">
        <div className="d-flex flex-wrap gap-2">
          {data.map((item, index) => (
            <div key={index} className="d-flex align-items-center">
              <div 
                className="me-2"
                style={{ 
                  backgroundColor: item.color || `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
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
    );
  };

  const renderChartContent = () => {
    // Platzhalter für Chart-Rendering
    // In einer echten Implementierung würde hier eine Chart-Bibliothek wie Chart.js verwendet
    return (
      <div 
        style={{ 
          height: `${height}px`,
          width: width ? `${width}px` : '100%',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '0.375rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div className="text-muted">
          {type.toUpperCase()} Chart - {data.length} Datenpunkte
        </div>
      </div>
    );
  };

  return (
    <div className={getChartClass()} id={chartId}>
      {(title || subtitle) && (
        <div className="mb-3">
          {title && <h4>{title}</h4>}
          {subtitle && <p className="text-muted small">{subtitle}</p>}
        </div>
      )}
      
      {renderChartContent()}
      {renderLegend()}
    </div>
  );
};

export default Chart; 