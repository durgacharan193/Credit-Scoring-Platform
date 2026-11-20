import React from 'react';

export interface ConfirmDialogProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'danger';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = (props) => {
  const { className = '', children, variant = 'default' } = props;
  return (
    <div data-testid="confirmdialog-component" className={'ui-confirmdialog variant-' + variant + ' ' + className}>
      {children ? children : <span>ConfirmDialog Component</span>}
    </div>
  );
};

export default ConfirmDialog;
