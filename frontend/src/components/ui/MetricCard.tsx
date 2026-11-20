import React from 'react';

export interface MetricCardProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'danger';
}

export const MetricCard: React.FC<MetricCardProps> = (props) => {
  const { className = '', children, variant = 'default' } = props;
  return (
    <div data-testid="metriccard-component" className={'ui-metriccard variant-' + variant + ' ' + className}>
      {children ? children : <span>MetricCard Component</span>}
    </div>
  );
};

export default MetricCard;
