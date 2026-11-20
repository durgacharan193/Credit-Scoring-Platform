import React from 'react';

export interface StatGridProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'danger';
}

export const StatGrid: React.FC<StatGridProps> = (props) => {
  const { className = '', children, variant = 'default' } = props;
  return (
    <div data-testid="statgrid-component" className={'ui-statgrid variant-' + variant + ' ' + className}>
      {children ? children : <span>StatGrid Component</span>}
    </div>
  );
};

export default StatGrid;
