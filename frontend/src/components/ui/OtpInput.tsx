import React from 'react';

export interface OtpInputProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'danger';
}

export const OtpInput: React.FC<OtpInputProps> = (props) => {
  const { className = '', children, variant = 'default' } = props;
  return (
    <div data-testid="otpinput-component" className={'ui-otpinput variant-' + variant + ' ' + className}>
      {children ? children : <span>OtpInput Component</span>}
    </div>
  );
};

export default OtpInput;
