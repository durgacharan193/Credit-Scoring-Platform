import React from 'react';

export interface ModalProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'danger';
}

export const Modal: React.FC<ModalProps> = (props) => {
  const { className = '', children, variant = 'default' } = props;
  return (
    <div data-testid="modal-component" className={'ui-modal variant-' + variant + ' ' + className}>
      {children ? children : <span>Modal Component</span>}
    </div>
  );
};

export default Modal;
