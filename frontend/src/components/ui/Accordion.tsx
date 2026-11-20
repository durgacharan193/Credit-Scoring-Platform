import React from 'react';

export interface AccordionProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'danger';
}

export const Accordion: React.FC<AccordionProps> = (props) => {
  const { className = '', children, variant = 'default' } = props;
  return (
    <div data-testid="accordion-component" className={'ui-accordion variant-' + variant + ' ' + className}>
      {children ? children : <span>Accordion Component</span>}
    </div>
  );
};

export default Accordion;
