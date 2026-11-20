import React from 'react';

export interface TagProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'danger';
}

export const Tag: React.FC<TagProps> = (props) => {
  const { className = '', children, variant = 'default' } = props;
  return (
    <div data-testid="tag-component" className={'ui-tag variant-' + variant + ' ' + className}>
      {children ? children : <span>Tag Component</span>}
    </div>
  );
};

export default Tag;
