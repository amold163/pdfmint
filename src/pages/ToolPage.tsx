import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Settings,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FileUpload } from '../components/FileUpload';
import { mergePDFs, splitPDF, imageToPDF, addWatermark, pdfToImages, compressPDF, pdfToWord, wordToPDF, addPassword, removePassword } from '../utils/pdfTools';

interface ToolConfig {
  title: string;
  description: string;
  actionLabel: string;
  accept: string;
  multiple: boolean;
}

const toolConfigs: Record<string, ToolConfig> = {
  'merge-pdf': {
    title: 'Merge PDF',
    description: 'Combine multiple PDF files into one document.',
    actionLabel: 'Merge PDFs',
    accept: '.pdf',
    multiple: true
  },
  'split-pdf': {
    title: 'Split PDF',
    description: 'Extract pages from your PDF file.',
    actionLabel: 'Split PDF',
    accept: '.pdf',
    multiple: false
  },
  'compress-pdf': {
    title: 'Compress PDF',
    description: 'Reduce the file size of your PDF while maintaining quality.',
    actionLabel: 'Compress PDF',
    accept: '.pdf',
    multiple: false
  },
  'image-to-pdf': {
    title: 'Image to PDF',
    description: 'Convert images to a PDF document.',
    actionLabel: 'Convert to PDF',
    accept: 'image/*',
    multiple: true
  },
  'pdf-to-image': {
    title: 'PDF to Image',
    description: 'Extract images from your PDF or save each page as a JPG.',
    actionLabel: 'Convert to Images',
    accept: '.pdf',
    multiple: false
  },
  'add-watermark': {
    title: 'Add Watermark',
    description: 'Add a text watermark to your PDF.',
    actionLabel: 'Add Watermark',
    accept: '.pdf',
    multiple: false
  },
  'pdf-to-word': {
    title: 'PDF to Word',
    description: 'Convert your PDF documents to editable Word files.',
    actionLabel: 'Convert to Word',
    accept: '.pdf',
    multiple: false
  },
  'word-to-pdf': {
    title: 'Word to PDF',
    description: 'Convert Microsoft Word documents to PDF format.',
    actionLabel: 'Convert to PDF',
    accept: '.doc,.docx',
    multiple: false
  },
  'add-password': {
    title: 'Protect PDF',
    description: 'Encrypt your PDF with a password to prevent unauthorized access.',
    actionLabel: 'Protect PDF',
    accept: '.pdf',
    multiple: false
  },
  'remove-password': {
    title: 'Unlock PDF',
    description: 'Remove password security from your PDF files.',
    actionLabel: 'Unlock PDF',
    accept: '.pdf',
    multiple: false
  }
};

export const ToolPage = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const config = toolId ? toolConfigs[toolId] : null;

  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<Uint8Array | Uint8Array[] | string[] | Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [password, setPassword] = useState('');

  if (!config) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <h2 className="text-2xl font-bold">Tool not found</h2>
        <Link to="/" className="mt-4 text-indigo-600 hover:underline">Back to home</Link>
      </div>
    );
  }

  const handleProcess = async () => {
    if (files.length === 0) return;
    
    setIsProcessing(true);
    setError(null);
    setResult(null);
    
    try {
      let processedData: Uint8Array | Uint8Array[] | string[] | Blob;
      
      switch (toolId) {
        case 'merge-pdf':
          processedData = await mergePDFs(files, password);
          break;
        case 'split-pdf':
          // Default split: every page as separate PDF
          processedData = await splitPDF(files[0], [{ start: 1, end: 1000 }], password); 
          break;
        case 'compress-pdf':
          processedData = await compressPDF(files[0], password);
          break;
        case 'image-to-pdf':
          processedData = await imageToPDF(files);
          break;
        case 'pdf-to-image':
          processedData = await pdfToImages(files[0], password);
          break;
        case 'add-watermark':
          processedData = await addWatermark(files[0], watermarkText, password);
          break;
        case 'pdf-to-word':
          processedData = await pdfToWord(files[0], password);
          break;
        case 'word-to-pdf':
          processedData = await wordToPDF(files[0]);
          break;
        case 'add-password':
          if (!password) throw new Error('Please enter a password.');
          processedData = await addPassword(files[0], password);
          break;
        case 'remove-password':
          if (!password) throw new Error('Please enter the current password.');
          processedData = await removePassword(files[0], password);
          break;
        default:
          throw new Error('Tool logic not implemented yet.');
      }
      
      setResult(processedData);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An error occurred while processing your file. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadResult = () => {
    if (!result) return;
    
    const download = (data: Uint8Array | string | Blob, filename: string, type: string) => {
      let url;
      if (typeof data === 'string') {
        url = data; // dataURL
      } else if (data instanceof Blob) {
        url = URL.createObjectURL(data);
      } else {
        const blob = new Blob([data], { type });
        url = URL.createObjectURL(blob);
      }
      
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      if (typeof data !== 'string') URL.revokeObjectURL(url);
    };

    if (Array.isArray(result)) {
      result.forEach((data, i) => {
        const isImage = typeof data === 'string';
        download(data as any, `result-part-${i + 1}.${isImage ? 'jpg' : 'pdf'}`, isImage ? 'image/jpeg' : 'application/pdf');
      });
    } else {
      const isWord = toolId === 'pdf-to-word';
      download(result as any, `${toolId}-result.${isWord ? 'docx' : 'pdf'}`, isWord ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'application/pdf');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 pb-20 pt-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-indigo-600">
          <ArrowLeft size={16} />
          Back to all tools
        </Link>

        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900">{config.title}</h1>
          <p className="mt-2 text-zinc-500">{config.description}</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-3xl bg-white p-2 shadow-xl shadow-zinc-200/50 ring-1 ring-zinc-200">
              <FileUpload 
                onFilesSelected={setFiles} 
                accept={config.accept} 
                multiple={config.multiple}
              />
            </div>
            
            <div className="mt-8 flex items-center gap-2 rounded-xl bg-indigo-50 p-4 text-sm text-indigo-700">
              <Info size={18} className="shrink-0" />
              <p>Your files are processed locally in your browser. No data is sent to our servers.</p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2 font-semibold text-zinc-900">
                  <Settings size={18} />
                  Options
                </div>
                
                {toolId === 'add-watermark' && (
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Watermark Text</label>
                    <input 
                      type="text" 
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      className="w-full rounded-lg border-zinc-200 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                )}

                {toolId !== 'image-to-pdf' && toolId !== 'word-to-pdf' && (
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      {toolId === 'add-password' ? 'Set Password' : 
                       toolId === 'remove-password' ? 'Enter Current Password' : 
                       'Password (if protected)'}
                    </label>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg border-zinc-200 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder={toolId === 'add-password' ? 'Set password...' : 'Enter password...'}
                    />
                  </div>
                )}
                
                {files.length === 0 ? (
                  <p className="py-4 text-center text-sm text-zinc-400 italic">Upload files to see options</p>
                ) : (
                  <div className="space-y-4 pt-2">
                    <button
                      onClick={handleProcess}
                      disabled={isProcessing}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-semibold text-white transition-all hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          Processing...
                        </>
                      ) : (
                        config.actionLabel
                      )}
                    </button>
                  </div>
                )}
              </div>

              <AnimatePresence>
                {result && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6 shadow-sm"
                  >
                    <div className="mb-4 flex items-center gap-2 font-semibold text-emerald-800">
                      <CheckCircle2 size={18} />
                      Success!
                    </div>
                    <p className="mb-6 text-sm text-emerald-700">Your file has been processed successfully.</p>
                    <button
                      onClick={downloadResult}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-semibold text-white transition-all hover:bg-emerald-700"
                    >
                      <Download size={20} />
                      Download Result
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {error && (
                <div className="rounded-2xl border border-red-100 bg-red-50 p-6 shadow-sm">
                  <div className="mb-2 flex items-center gap-2 font-semibold text-red-800">
                    <AlertCircle size={18} />
                    Error
                  </div>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
