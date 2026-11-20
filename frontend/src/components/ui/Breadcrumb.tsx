import React from 'react';

export interface BreadcrumbProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'danger';
}

export const Breadcrumb: React.FC<BreadcrumbProps> = (props) => {
  const { className = '', children, variant = 'default' } = props;
  return (
    <div data-testid="breadcrumb-component" className={'ui-breadcrumb variant-' + variant + ' ' + className}>
      {children ? children : <span>Breadcrumb Component</span>}
    </div>
  );
};

export default Breadcrumb;
