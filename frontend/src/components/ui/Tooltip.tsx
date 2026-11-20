import React from 'react';

export interface TooltipProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'danger';
}

export const Tooltip: React.FC<TooltipProps> = (props) => {
  const { className = '', children, variant = 'default' } = props;
  return (
    <div data-testid="tooltip-component" className={'ui-tooltip variant-' + variant + ' ' + className}>
      {children ? children : <span>Tooltip Component</span>}
    </div>
  );
};

export default Tooltip;
