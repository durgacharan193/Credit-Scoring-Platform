import React from 'react';

export interface PaginationProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'danger';
}

export const Pagination: React.FC<PaginationProps> = (props) => {
  const { className = '', children, variant = 'default' } = props;
  return (
    <div data-testid="pagination-component" className={'ui-pagination variant-' + variant + ' ' + className}>
      {children ? children : <span>Pagination Component</span>}
    </div>
  );
};

export default Pagination;
