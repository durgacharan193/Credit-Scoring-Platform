import React from 'react';

export interface RatingProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'danger';
}

export const Rating: React.FC<RatingProps> = (props) => {
  const { className = '', children, variant = 'default' } = props;
  return (
    <div data-testid="rating-component" className={'ui-rating variant-' + variant + ' ' + className}>
      {children ? children : <span>Rating Component</span>}
    </div>
  );
};

export default Rating;
