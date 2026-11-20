import React from 'react';

export interface ScoreGaugeProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'danger';
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = (props) => {
  const { className = '', children, variant = 'default' } = props;
  return (
    <div data-testid="scoregauge-component" className={'ui-scoregauge variant-' + variant + ' ' + className}>
      {children ? children : <span>ScoreGauge Component</span>}
    </div>
  );
};

export default ScoreGauge;
