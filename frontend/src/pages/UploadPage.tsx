import { useState, useRef } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import api from '@/lib/api';
import { ENDPOINTS } from '@shared/types/api';
import type { UploadResponse } from '@shared/types/upload';

// ============================================================
// Upload Page
// ============================================================
// Drag-and-drop file upload for emissions data.
// Posts FormData to Sameera's /api/records/upload endpoint.
// ============================================================

const ACCEPTED_TYPES = '.pdf,.png,.jpg,.jpeg,.xlsx,.csv';
const ACCEPTED_MIME = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
];

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<UploadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && ACCEPTED_MIME.includes(file.type)) {
      setSelectedFile(file);
      setResult(null);
      setError(null);
    } else {
      setError('Unsupported file type. Accepted: PDF, PNG, JPG, Excel, CSV');
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setResult(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await api.post<UploadResponse>(
        ENDPOINTS.RECORDS_UPLOAD,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setProgress(pct);
            }
          },
        }
      );

      setResult(response.data);
      setSelectedFile(null);
    } catch {
      setError('Upload failed. Please try again or check file format.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setResult(null);
    setError(null);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Upload Data</h1>
        <p className="page-description">
          Upload emissions data files for processing. Supported formats: PDF, images, Excel, and CSV.
        </p>
      </div>

      <div className="upload-card">
        {/* Drop Zone */}
        <div
          id="upload-dropzone"
          className={`upload-dropzone ${isDragging ? 'upload-dropzone--active' : ''} ${selectedFile ? 'upload-dropzone--has-file' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES}
            onChange={handleFileSelect}
            className="upload-input-hidden"
            aria-label="Select file to upload"
          />

          {selectedFile ? (
            <div className="upload-file-info">
              <div className="upload-file-icon">📄</div>
              <div className="upload-file-details">
                <span className="upload-file-name">{selectedFile.name}</span>
                <span className="upload-file-size">{formatFileSize(selectedFile.size)}</span>
              </div>
            </div>
          ) : (
            <>
              <div className="upload-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 32V16M24 16L18 22M24 16L30 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 32L8 36C8 38.2091 9.79086 40 12 40L36 40C38.2091 40 40 38.2091 40 36V32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="upload-text">
                <strong>Drop files here</strong> or click to browse
              </p>
              <p className="upload-hint">PDF, PNG, JPG, Excel, or CSV</p>
            </>
          )}
        </div>

        {/* Progress Bar */}
        {isUploading && (
          <div className="upload-progress">
            <div className="upload-progress-bar">
              <div className="upload-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="upload-progress-text">{progress}%</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="upload-error" role="alert">
            <span>{error}</span>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="upload-result">
            <h3 className="upload-result-title">Upload Complete</h3>
            <div className="upload-result-grid">
              <div className="upload-stat upload-stat--accepted">
                <span className="upload-stat-value">{result.acceptedRows}</span>
                <span className="upload-stat-label">Accepted</span>
              </div>
              <div className="upload-stat upload-stat--flagged">
                <span className="upload-stat-value">{result.flaggedRows}</span>
                <span className="upload-stat-label">Flagged</span>
              </div>
              <div className="upload-stat upload-stat--issues">
                <span className="upload-stat-value">{result.issuesCreated}</span>
                <span className="upload-stat-label">Issues Created</span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="upload-actions">
          {selectedFile && !isUploading && !result && (
            <button id="upload-submit" className="btn btn-primary" onClick={handleUpload}>
              Upload File
            </button>
          )}
          {(selectedFile || result) && !isUploading && (
            <button id="upload-reset" className="btn btn-ghost" onClick={handleReset}>
              {result ? 'Upload Another' : 'Clear'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
