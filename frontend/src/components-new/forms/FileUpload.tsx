import React, { useState, useRef } from 'react';
import { Icon } from '../ui/Icon';
import { Button } from '../ui/Button';

export interface FileUploadFile {
  id: string;
  name: string;
  size: number;
  type: string;
  progress?: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

export interface FileUploadProps {
  files?: FileUploadFile[];
  onFilesSelect?: (files: File[]) => void;
  onFileRemove?: (fileId: string) => void;
  onFileUpload?: (file: FileUploadFile) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxFileSize?: number; // in bytes
  className?: string;
  disabled?: boolean;
  dragAndDrop?: boolean;
  showPreview?: boolean;
  uploadText?: string;
  dropText?: string;
}

/**
 * Datei-Upload-Komponente
 */
export const FileUpload: React.FC<FileUploadProps> = ({
  files = [],
  onFilesSelect,
  onFileRemove,
  accept,
  multiple = false,
  maxFileSize = 10 * 1024 * 1024, // 10MB
  className = '',
  disabled = false,
  dragAndDrop = true,
  uploadText = 'Dateien auswählen',
  dropText = 'Dateien hier ablegen oder klicken zum Auswählen'
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles || disabled) return;

    const fileArray = Array.from(selectedFiles);
    const validFiles = fileArray.filter(file => {
      if (maxFileSize && file.size > maxFileSize) {
        console.warn(`Datei ${file.name} ist zu groß`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      onFilesSelect?.(validFiles);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (dragAndDrop && !disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (dragAndDrop && !disabled) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return 'image';
    if (fileType.startsWith('video/')) return 'video';
    if (fileType.startsWith('audio/')) return 'volume';
    if (fileType.includes('pdf')) return 'file';
    if (fileType.includes('word') || fileType.includes('document')) return 'file';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return 'file';
    return 'file';
  };

  const getUploadAreaClass = () => {
    const classes = [
      'border-2 border-dashed rounded p-4',
      isDragOver ? 'border-primary bg-light' : 'border-muted',
      disabled ? 'opacity-50' : '',
      className
    ];
    return classes.filter(Boolean).join(' ');
  };


  return (
    <div className="position-relative">
      <div
        className={getUploadAreaClass()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          disabled={disabled}
          style={{ display: 'none' }}
        />
        
        <div className="text-center">
          <Icon name="upload" size="xl" className="mb-3 text-muted" />
          <h5 className="mb-2">{uploadText}</h5>
          {dragAndDrop && (
            <p className="text-muted mb-2">{dropText}</p>
          )}
          {maxFileSize && (
            <p className="text-muted small mb-0">
              Maximale Dateigröße: {formatFileSize(maxFileSize)}
            </p>
          )}
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-3">
          {files.map((file) => (
            <div key={file.id} className="border rounded p-3 mb-2">
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <Icon name={getFileIcon(file.type) as any} size="md" />
                </div>
                
                <div className="flex-fill">
                  <div className="fw-bold">{file.name}</div>
                  <div className="text-muted small">
                    {formatFileSize(file.size)}
                    {file.status === 'uploading' && file.progress !== undefined && (
                      <span className="ms-2">
                        ({file.progress}%)
                      </span>
                    )}
                  </div>
                  
                  {file.status === 'uploading' && file.progress !== undefined && (
                    <div className="progress mt-1" style={{ height: '4px' }}>
                      <div 
                        className="progress-bar" 
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  )}
                  
                  {file.status === 'error' && file.error && (
                    <div className="text-danger small mt-1">
                      {file.error}
                    </div>
                  )}
                </div>
                
                <div className="ms-2">
                  {file.status === 'completed' && (
                    <Icon name="check" className="text-success" size="sm" />
                  )}
                  {file.status === 'error' && (
                    <Icon name="times" className="text-danger" size="sm" />
                  )}
                  {onFileRemove && (
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => onFileRemove(file.id)}
                      className="text-danger p-0"
                    >
                      <Icon name="times" size="sm" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload; 