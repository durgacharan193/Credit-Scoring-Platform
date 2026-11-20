import React from 'react';

export interface DrawerProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'danger';
}

export const Drawer: React.FC<DrawerProps> = (props) => {
  const { className = '', children, variant = 'default' } = props;
  return (
    <div data-testid="drawer-component" className={'ui-drawer variant-' + variant + ' ' + className}>
      {children ? children : <span>Drawer Component</span>}
    </div>
  );
};

export default Drawer;
