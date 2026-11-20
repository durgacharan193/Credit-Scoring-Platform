import React from 'react';

export interface FileUploadProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'danger';
}

export const FileUpload: React.FC<FileUploadProps> = (props) => {
  const { className = '', children, variant = 'default' } = props;
  return (
    <div data-testid="fileupload-component" className={'ui-fileupload variant-' + variant + ' ' + className}>
      {children ? children : <span>FileUpload Component</span>}
    </div>
  );
};

export default FileUpload;
