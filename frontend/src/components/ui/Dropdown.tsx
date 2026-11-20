import React from 'react';

export interface DropdownProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'danger';
}

export const Dropdown: React.FC<DropdownProps> = (props) => {
  const { className = '', children, variant = 'default' } = props;
  return (
    <div data-testid="dropdown-component" className={'ui-dropdown variant-' + variant + ' ' + className}>
      {children ? children : <span>Dropdown Component</span>}
    </div>
  );
};

export default Dropdown;
