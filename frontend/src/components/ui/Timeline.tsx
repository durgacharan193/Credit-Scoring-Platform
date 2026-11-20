import React from 'react';

export interface TimelineProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'danger';
}

export const Timeline: React.FC<TimelineProps> = (props) => {
  const { className = '', children, variant = 'default' } = props;
  return (
    <div data-testid="timeline-component" className={'ui-timeline variant-' + variant + ' ' + className}>
      {children ? children : <span>Timeline Component</span>}
    </div>
  );
};

export default Timeline;
