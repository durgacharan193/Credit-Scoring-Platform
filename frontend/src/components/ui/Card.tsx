import React from 'react';

export interface CardProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'danger';
}

export const Card: React.FC<CardProps> = (props) => {
  const { className = '', children, variant = 'default' } = props;
  return (
    <div data-testid="card-component" className={'ui-card variant-' + variant + ' ' + className}>
      {children ? children : <span>Card Component</span>}
    </div>
  );
};

export default Card;
