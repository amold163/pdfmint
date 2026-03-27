import React, { useState, useRef } from 'react';
import { Upload, File, X, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatBytes } from '../lib/utils';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  onFilesSelected, 
  accept = ".pdf", 
  multiple = true,
  maxFiles = 10
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [warning, setWarning] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files) as File[];
    processFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files) as File[];
      processFiles(files);
    }
  };

  const processFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      if (file.size === 0) return false;
      if (accept === ".pdf") return file.type === "application/pdf";
      if (accept.includes("image")) return file.type.startsWith("image/");
      return true;
    });

    if (validFiles.length < files.length) {
      setWarning("Some files were skipped because they were empty or had an invalid format.");
      setTimeout(() => setWarning(null), 5000);
    } else {
      setWarning(null);
    }

    const newFiles = [...selectedFiles, ...validFiles].slice(0, maxFiles) as File[];
    setSelectedFiles(newFiles);
    onFilesSelected(newFiles);
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index) as File[];
    setSelectedFiles(newFiles);
    onFilesSelected(newFiles);
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 transition-all cursor-pointer",
          isDragging 
            ? "border-indigo-500 bg-indigo-50/50" 
            : "border-zinc-200 bg-white hover:border-indigo-400 hover:bg-zinc-50/50"
        )}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept={accept}
          multiple={multiple}
          className="hidden"
        />
        
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 mb-4">
          <Upload size={32} />
        </div>
        
        <h3 className="text-lg font-semibold text-zinc-900">Click to upload or drag and drop</h3>
        <p className="mt-1 text-sm text-zinc-500">
          {accept === ".pdf" ? "PDF files up to 50MB" : "Images (JPG, PNG) up to 10MB"}
        </p>
        
        <div className="mt-8 flex items-center gap-6 text-xs text-zinc-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>Secure Processing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-indigo-500" />
            <span>Privacy Guaranteed</span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {warning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-800 border border-amber-100"
          >
            <AlertCircle size={14} />
            {warning}
          </motion.div>
        )}
        {selectedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-6 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-zinc-700">Selected Files ({selectedFiles.length})</h4>
              <button 
                onClick={() => { setSelectedFiles([]); onFilesSelected([]); }}
                className="text-xs text-zinc-400 hover:text-red-500"
              >
                Clear all
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {selectedFiles.map((file, index) => (
                <motion.div
                  key={`${file.name}-${index}`}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-between rounded-xl border border-zinc-100 bg-white p-3 shadow-sm"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-50 text-zinc-400">
                      <File size={20} />
                    </div>
                    <div className="overflow-hidden">
                      <p className="truncate text-sm font-medium text-zinc-900">{file.name}</p>
                      <p className="text-xs text-zinc-400">{formatBytes(file.size)}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                    className="rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
                  >
                    <X size={16} />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
