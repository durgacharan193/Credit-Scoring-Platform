import React from 'react';

export interface TableProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'danger';
}

export const Table: React.FC<TableProps> = (props) => {
  const { className = '', children, variant = 'default' } = props;
  return (
    <div data-testid="table-component" className={'ui-table variant-' + variant + ' ' + className}>
      {children ? children : <span>Table Component</span>}
    </div>
  );
};

export default Table;
