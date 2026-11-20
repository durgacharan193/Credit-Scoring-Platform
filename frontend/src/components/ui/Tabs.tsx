import React from 'react';

export interface TabsProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'danger';
}

export const Tabs: React.FC<TabsProps> = (props) => {
  const { className = '', children, variant = 'default' } = props;
  return (
    <div data-testid="tabs-component" className={'ui-tabs variant-' + variant + ' ' + className}>
      {children ? children : <span>Tabs Component</span>}
    </div>
  );
};

export default Tabs;
