import React from 'react';

export interface DividerProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'danger';
}

export const Divider: React.FC<DividerProps> = (props) => {
  const { className = '', children, variant = 'default' } = props;
  return (
    <div data-testid="divider-component" className={'ui-divider variant-' + variant + ' ' + className}>
      {children ? children : <span>Divider Component</span>}
    </div>
  );
};

export default Divider;
