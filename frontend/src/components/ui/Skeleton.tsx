import React from 'react';

export interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'danger';
}

export const Skeleton: React.FC<SkeletonProps> = (props) => {
  const { className = '', children, variant = 'default' } = props;
  return (
    <div data-testid="skeleton-component" className={'ui-skeleton variant-' + variant + ' ' + className}>
      {children ? children : <span>Skeleton Component</span>}
    </div>
  );
};

export default Skeleton;
