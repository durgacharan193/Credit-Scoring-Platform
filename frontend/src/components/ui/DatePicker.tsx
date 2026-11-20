import React from 'react';

export interface DatePickerProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'danger';
}

export const DatePicker: React.FC<DatePickerProps> = (props) => {
  const { className = '', children, variant = 'default' } = props;
  return (
    <div data-testid="datepicker-component" className={'ui-datepicker variant-' + variant + ' ' + className}>
      {children ? children : <span>DatePicker Component</span>}
    </div>
  );
};

export default DatePicker;
