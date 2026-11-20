import React from 'react';

export interface EmptyStateProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'danger';
}

export const EmptyState: React.FC<EmptyStateProps> = (props) => {
  const { className = '', children, variant = 'default' } = props;
  return (
    <div data-testid="emptystate-component" className={'ui-emptystate variant-' + variant + ' ' + className}>
      {children ? children : <span>EmptyState Component</span>}
    </div>
  );
};

export default EmptyState;
