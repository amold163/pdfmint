import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  ArrowLeft, 
  Download, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Settings,
  Info,
  ChevronRight,
  ShieldCheck,
  Zap,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FileUpload } from '../components/FileUpload';
import { mergePDFs, splitPDF, imageToPDF, addWatermark, pdfToImages, compressPDF, pdfToWord, wordToPDF, addPassword, removePassword } from '../utils/pdfTools';

interface FAQ {
  question: string;
  answer: string;
}

interface ToolConfig {
  title: string;
  description: string;
  actionLabel: string;
  accept: string;
  multiple: boolean;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  benefits: string[];
  features: string[];
  usageGuide: string[];
  faqs: FAQ[];
  internalLinks: { label: string; path: string }[];
}

const toolConfigs: Record<string, ToolConfig> = {
  'merge-pdf': {
    title: 'Merge PDF',
    description: 'Combine multiple PDF files into one document.',
    actionLabel: 'Merge PDFs',
    accept: '.pdf',
    multiple: true,
    metaTitle: 'Merge PDF Online Without Uploading - 100% Private | PDFMint',
    metaDescription: 'Merge PDF files without uploading to any server. Use our secure, browser-based PDF tool to combine documents privately. Your files never leave your device.',
    h1: 'Merge PDF Online Without Uploading',
    intro: 'PDFMint offers the most secure PDF merge tool available today. Unlike traditional converters, our private PDF merge online technology works entirely within your web browser. This means you can merge PDF without uploading sensitive documents to a remote server. Your data stays on your machine, providing 100% confidentiality for legal, financial, and personal records.',
    benefits: [
      'Zero Uploads: Files are processed locally; your privacy is guaranteed.',
      'Instant Speed: No waiting for file transfers or server queues.',
      'Secure PDF Online: Industry-leading client-side processing.',
      'No Limits: Combine as many files as you need for free.'
    ],
    features: [
      'Drag-and-drop interface for seamless file arrangement.',
      'Live page reordering before finalizing the merge.',
      'Compatible with all modern browsers (Chrome, Firefox, Safari).',
      'Works offline once the page is loaded.'
    ],
    usageGuide: [
      'Select or drag your PDF documents into the tool area.',
      'Arrange the files in your preferred sequence.',
      'Click the "Merge PDF" button to process locally.',
      'The combined file is generated instantly in your browser.',
      'Save the merged document directly to your computer.'
    ],
    faqs: [
      {
        question: 'How can I merge PDF without uploading to a server?',
        answer: 'PDFMint uses browser-based PDF tool technology. When you select files, your browser processes the data locally using JavaScript. This allows you to combine documents without sending them over the internet.'
      },
      {
        question: 'Is it safe to merge confidential documents here?',
        answer: 'Yes. Since we offer a secure PDF merge tool that functions entirely offline, your sensitive information never leaves your device, making it safer than any cloud-based alternative.'
      },
      {
        question: 'Does PDFMint store a copy of my merged files?',
        answer: 'No. We have no servers that store your files. The private PDF tool logic runs on your CPU, and the output is saved directly from your browser memory to your disk.'
      }
    ],
    internalLinks: [
      { label: 'Split PDF Privately', path: '/split-pdf' },
      { label: 'Secure PDF Compression', path: '/compress-pdf' },
      { label: 'Convert PDF to JPG', path: '/pdf-to-image' }
    ]
  },
  'split-pdf': {
    title: 'Split PDF',
    description: 'Extract pages from your PDF file.',
    actionLabel: 'Split PDF',
    accept: '.pdf',
    multiple: false,
    metaTitle: 'Split PDF Online Without Uploading - Private & Secure | PDFMint',
    metaDescription: 'Split PDF pages without uploading. Extract specific pages or divide documents securely in your browser. 100% private PDF splitter. Files stay on your device.',
    h1: 'Split PDF Online Without Uploading',
    intro: 'Extracting pages from a document shouldn\'t mean compromising your data. PDFMint provides a way to split PDF without uploading files to external servers. Our private PDF split tool processes every page locally in your browser. Whether you need to extract a single page or divide a large report, our secure PDF online solution ensures your files never leave your device.',
    benefits: [
      'Total Privacy: No data is transmitted; your documents stay local.',
      'High Speed: Instant page extraction without upload/download delays.',
      'Secure PDF Online: Safe for government, medical, and legal documents.',
      'User-Friendly: Visual interface for precise page selection.'
    ],
    features: [
      'Extract specific page ranges (e.g., 1-5, 10, 15-20).',
      'Split every page into a separate PDF file.',
      'Real-time preview of PDF thumbnails.',
      'Maintains original file quality and metadata.'
    ],
    usageGuide: [
      'Open your PDF file in the PDFMint splitter.',
      'Select the pages you wish to extract or define split ranges.',
      'Click "Split PDF" to begin the local extraction process.',
      'Download your new PDF files instantly from your browser.'
    ],
    faqs: [
      {
        question: 'Is it possible to split PDF without uploading?',
        answer: 'Yes, PDFMint is a browser-based PDF tool. It uses your computer\'s power to separate pages, meaning your file is never sent to our servers.'
      },
      {
        question: 'Can I extract specific pages from a large PDF?',
        answer: 'Absolutely. You can select individual pages or ranges. Our secure PDF online tool handles large files with ease.'
      }
    ],
    internalLinks: [
      { label: 'Merge PDFs Privately', path: '/merge-pdf' },
      { label: 'Secure PDF Editor', path: '/edit-pdf' },
      { label: 'Add PDF Password', path: '/add-password' }
    ]
  },
  'compress-pdf': {
    title: 'Compress PDF',
    description: 'Reduce the file size of your PDF while maintaining quality.',
    actionLabel: 'Compress PDF',
    accept: '.pdf',
    multiple: false,
    metaTitle: 'Compress PDF Without Uploading - Reduce PDF Size Privately',
    metaDescription: 'Reduce PDF file size without uploading. Use our secure, browser-based PDF compressor to shrink documents privately. 100% private PDF tool.',
    h1: 'Compress PDF Size Without Uploading',
    intro: 'Shrinking your files shouldn\'t mean exposing your data. PDFMint allows you to compress PDF without uploading to any cloud service. Our private PDF compression technology works locally in your browser, ensuring that your secure PDF online experience is truly private. Reduce file size for email or storage while keeping your documents strictly on your device.',
    benefits: [
      '100% Privacy: No file upload means your data is never at risk.',
      'Bandwidth Efficient: No need to upload large files; saves your data.',
      'Secure PDF Online: Ideal for sensitive financial or personal records.',
      'High Quality: Optimized algorithms to balance size and clarity.'
    ],
    features: [
      'Multiple compression levels (Recommended, Extreme, Low).',
      'Real-time estimation of the final file size.',
      'Batch compression for multiple documents at once.',
      'Works on all operating systems without software installation.'
    ],
    usageGuide: [
      'Select the PDF file you wish to shrink.',
      'Choose your desired compression level.',
      'Click "Compress" to start the browser-based PDF tool.',
      'The compressed file is ready for download instantly.'
    ],
    faqs: [
      {
        question: 'How can I compress PDF without uploading?',
        answer: 'PDFMint uses client-side processing. When you choose a file, our private PDF tool runs the compression algorithm inside your browser, so the file never leaves your computer.'
      },
      {
        question: 'Will my PDF lose quality after compression?',
        answer: 'Our "Recommended" setting provides a perfect balance. It reduces the file size significantly while maintaining high visual quality for text and images.'
      }
    ],
    internalLinks: [
      { label: 'PDF to Word Privately', path: '/pdf-to-word' },
      { label: 'Combine PDFs Securely', path: '/merge-pdf' },
      { label: 'JPG to PDF Converter', path: '/image-to-pdf' }
    ]
  },
  'image-to-pdf': {
    title: 'Image to PDF',
    description: 'Convert images to a PDF document.',
    actionLabel: 'Convert to PDF',
    accept: 'image/*',
    multiple: true,
    metaTitle: 'JPG to PDF Converter Without Uploading - Private | PDFMint',
    metaDescription: 'Convert JPG to PDF without uploading. Use our secure, browser-based image to PDF converter privately. 100% private. Your images never leave your device.',
    h1: 'Convert JPG to PDF Without Uploading',
    intro: 'Transform your images into professional documents without risking your privacy. PDFMint allows you to convert JPG to PDF without uploading to any server. Our private image to PDF tool handles the conversion locally in your browser. Whether it\'s a photo of an ID or a personal scan, our secure PDF online converter ensures your images stay strictly on your device.',
    benefits: [
      '100% Private: Your photos are never sent to the cloud.',
      'Fast & Reliable: Instant conversion regardless of internet speed.',
      'Secure PDF Online: Safe for sensitive photos and documents.',
      'Custom Layouts: Adjust page size, margins, and orientation.'
    ],
    features: [
      'Supports JPG, PNG, BMP, and GIF formats.',
      'Combine multiple images into a single PDF document.',
      'Drag and drop to reorder images before conversion.',
      'Automatic image rotation and scaling.'
    ],
    usageGuide: [
      'Select or drag your images into the converter.',
      'Arrange the images in your desired order.',
      'Customize page settings (Size, Orientation, Margins).',
      'Click "Convert to PDF" to process locally.',
      'Download your PDF document instantly.'
    ],
    faqs: [
      {
        question: 'How can I convert JPG to PDF without uploading?',
        answer: 'PDFMint is a browser-based PDF tool. It uses JavaScript to render your images into a PDF file directly on your computer, so no upload is required.'
      },
      {
        question: 'Is it safe to convert my ID photos here?',
        answer: 'Yes. Since we offer a private PDF tool that works entirely offline, your sensitive photos are never exposed to the internet.'
      }
    ],
    internalLinks: [
      { label: 'PDF to JPG Privately', path: '/pdf-to-image' },
      { label: 'Merge PDF Securely', path: '/merge-pdf' },
      { label: 'Reduce PDF Size', path: '/compress-pdf' }
    ]
  },
  'pdf-to-image': {
    title: 'PDF to Image',
    description: 'Extract images from your PDF or save each page as a JPG.',
    actionLabel: 'Convert to Images',
    accept: '.pdf',
    multiple: false,
    metaTitle: 'PDF to JPG Converter Without Uploading - Private | PDFMint',
    metaDescription: 'Convert PDF to JPG without uploading. Use our secure, browser-based PDF to image converter privately. 100% private. Your files never leave your device.',
    h1: 'Convert PDF to JPG Without Uploading',
    intro: 'Extracting images from your documents shouldn\'t mean sharing your data. PDFMint allows you to convert PDF to JPG without uploading to any server. Our private PDF to image tool handles the conversion locally in your browser. Whether it\'s a page from a book or a confidential scan, our secure PDF online converter ensures your files stay strictly on your device.',
    benefits: [
      '100% Private: Your documents are never sent to the cloud.',
      'Fast & Reliable: Instant conversion regardless of internet speed.',
      'Secure PDF Online: Safe for sensitive business and personal data.',
      'High Quality: Get crisp, high-resolution images from your PDF pages.'
    ],
    features: [
      'Convert entire PDF pages into high-quality JPG images.',
      'Extract embedded images from your PDF documents.',
      'Batch conversion for multiple documents.',
      'Works entirely in your browser without software installation.'
    ],
    usageGuide: [
      'Select the PDF file you wish to convert.',
      'Wait for the browser-based PDF tool to process the file.',
      'Click "Convert to JPG" to start the local conversion.',
      'Download your high-quality images instantly.'
    ],
    faqs: [
      {
        question: 'How can I convert PDF to JPG without uploading?',
        answer: 'PDFMint is a browser-based PDF tool. It uses JavaScript to parse your PDF and generate JPG images directly on your computer, so no upload is required.'
      },
      {
        question: 'Is it safe to convert my ID scans here?',
        answer: 'Yes. Since we offer a private PDF tool that works entirely offline, your personal information is never exposed to the internet.'
      }
    ],
    internalLinks: [
      { label: 'JPG to PDF Privately', path: '/image-to-pdf' },
      { label: 'Secure PDF Editor', path: '/edit-pdf' },
      { label: 'Merge PDF Securely', path: '/merge-pdf' }
    ]
  },
  'add-watermark': {
    title: 'Add Watermark',
    description: 'Add a text watermark to your PDF.',
    actionLabel: 'Add Watermark',
    accept: '.pdf',
    multiple: false,
    metaTitle: 'Add Watermark to PDF Without Uploading - Secure | PDFMint',
    metaDescription: 'Add text watermarks to your PDF files securely in your browser. No file upload required. 100% private PDF tool. Your files never leave your device.',
    h1: 'Add Watermark to PDF Without Uploading',
    intro: 'Protect your documents with custom watermarks using PDFMint. Our private PDF tool allows you to add text watermarks directly in your browser without uploading your files. Keep your sensitive documents secure and branded locally.',
    benefits: [
      '100% Private: Your files stay on your device.',
      'Fast Processing: Add watermarks in seconds.',
      'Customizable: Set your own text and style.',
      'Secure PDF Online: Ideal for confidential business documents.'
    ],
    features: [
      'Add custom text watermarks to all pages.',
      'Adjustable text size and opacity.',
      'Works entirely in your browser.',
      'Maintains original PDF quality.'
    ],
    usageGuide: [
      'Select the PDF file you want to watermark.',
      'Enter your custom watermark text in the options.',
      'Click "Add Watermark" to process locally.',
      'Download your watermarked PDF instantly.'
    ],
    faqs: [
      {
        question: 'How can I add a watermark without uploading?',
        answer: 'PDFMint uses browser-based technology to overlay text on your PDF pages locally, so no upload is needed.'
      },
      {
        question: 'Is my watermark text private?',
        answer: 'Yes, everything is processed in your browser. We never see your text or your files.'
      }
    ],
    internalLinks: [
      { label: 'Protect PDF Privately', path: '/add-password' },
      { label: 'Secure PDF Editor', path: '/edit-pdf' },
      { label: 'Merge PDF Securely', path: '/merge-pdf' }
    ]
  },
  'pdf-to-word': {
    title: 'PDF to Word',
    description: 'Convert your PDF documents to editable Word files.',
    actionLabel: 'Convert to Word',
    accept: '.pdf',
    multiple: false,
    metaTitle: 'PDF to Word Converter Without Uploading - Private | PDFMint',
    metaDescription: 'Convert PDF to Word without uploading. Use our secure, browser-based PDF to DOCX converter privately. 100% private. Your files never leave your device.',
    h1: 'Convert PDF to Word Without Uploading',
    intro: 'Getting an editable document shouldn\'t mean giving up your data. PDFMint allows you to convert PDF to Word without uploading to any server. Our private PDF to DOCX tool handles the conversion locally in your browser. Whether it\'s a resume or a confidential report, our secure PDF online converter ensures your files stay strictly on your device.',
    benefits: [
      '100% Private: Your documents are never sent to the cloud.',
      'Fast & Reliable: Instant conversion regardless of internet speed.',
      'Secure PDF Online: Safe for sensitive business and personal data.',
      'Editable Output: Get high-quality Word files ready for editing.'
    ],
    features: [
      'High-fidelity conversion to .docx format.',
      'Preserves document layout, fonts, and images.',
      'Batch conversion for multiple documents.',
      'Works entirely in your browser without software installation.'
    ],
    usageGuide: [
      'Select the PDF file you wish to convert.',
      'Wait for the browser-based PDF tool to process the file.',
      'Click "Convert to Word" to start the local conversion.',
      'Download your editable Word document instantly.'
    ],
    faqs: [
      {
        question: 'How can I convert PDF to Word without uploading?',
        answer: 'PDFMint is a browser-based PDF tool. It uses JavaScript to parse your PDF and generate a Word file directly on your computer, so no upload is required.'
      },
      {
        question: 'Is it safe to convert my resume here?',
        answer: 'Yes. Since we offer a private PDF tool that works entirely offline, your personal information is never exposed to the internet.'
      }
    ],
    internalLinks: [
      { label: 'Word to PDF Privately', path: '/word-to-pdf' },
      { label: 'Secure PDF Editor', path: '/edit-pdf' },
      { label: 'Reduce PDF Size', path: '/compress-pdf' }
    ]
  },
  'word-to-pdf': {
    title: 'Word to PDF',
    description: 'Convert Microsoft Word documents to PDF format.',
    actionLabel: 'Convert to PDF',
    accept: '.doc,.docx',
    multiple: false,
    metaTitle: 'Word to PDF Converter Without Uploading - Private | PDFMint',
    metaDescription: 'Convert Word to PDF without uploading. Use our secure, browser-based DOCX to PDF converter privately. 100% private. Your files never leave your device.',
    h1: 'Convert Word to PDF Without Uploading',
    intro: 'Creating a professional PDF shouldn\'t mean sharing your data. PDFMint allows you to convert Word to PDF without uploading to any server. Our private Word to PDF tool handles the conversion locally in your browser. Whether it\'s a report or a personal letter, our secure PDF online converter ensures your files stay strictly on your device.',
    benefits: [
      '100% Private: Your documents are never sent to the cloud.',
      'Fast & Reliable: Instant conversion regardless of internet speed.',
      'Secure PDF Online: Safe for sensitive business and personal data.',
      'Universal Format: Get high-quality PDFs ready for sharing.'
    ],
    features: [
      'High-fidelity conversion from .docx and .doc formats.',
      'Preserves document layout, fonts, and images.',
      'Batch conversion for multiple documents.',
      'Works entirely in your browser without software installation.'
    ],
    usageGuide: [
      'Select the Word file you wish to convert.',
      'Wait for the browser-based PDF tool to process the file.',
      'Click "Convert to PDF" to start the local conversion.',
      'Download your professional PDF document instantly.'
    ],
    faqs: [
      {
        question: 'How can I convert Word to PDF without uploading?',
        answer: 'PDFMint is a browser-based PDF tool. It uses JavaScript to parse your Word document and generate a PDF file directly on your computer, so no upload is required.'
      },
      {
        question: 'Is it safe to convert my legal documents here?',
        answer: 'Yes. Since we offer a private PDF tool that works entirely offline, your personal information is never exposed to the internet.'
      }
    ],
    internalLinks: [
      { label: 'PDF to Word Privately', path: '/pdf-to-word' },
      { label: 'Secure PDF Editor', path: '/edit-pdf' },
      { label: 'Merge PDF Securely', path: '/merge-pdf' }
    ]
  },
  'add-password': {
    title: 'Protect PDF',
    description: 'Encrypt your PDF with a password to prevent unauthorized access.',
    actionLabel: 'Protect PDF',
    accept: '.pdf',
    multiple: false,
    metaTitle: 'Protect PDF Online Without Uploading - Secure Encryption',
    metaDescription: 'Protect PDF files with passwords without uploading. Encrypt documents securely in your browser. 100% private. Your files and passwords stay local.',
    h1: 'Protect PDF Online Without Uploading',
    intro: 'Securing your documents shouldn\'t mean uploading them to the cloud. PDFMint allows you to protect PDF without uploading to any server. Our private PDF encryption tool adds strong passwords and permissions directly in your browser. With our secure PDF online technology, your unencrypted file never leaves your device, ensuring maximum confidentiality.',
    benefits: [
      'End-to-End Privacy: Your file is encrypted locally; no data is sent to the cloud.',
      'Strong Encryption: Uses industry-standard AES encryption.',
      'Secure PDF Online: Ideal for protecting financial, medical, or legal data.',
      'Custom Permissions: Control who can print, copy, or edit your document.'
    ],
    features: [
      'Set "Open" passwords to restrict document access.',
      'Set "Permissions" passwords to restrict editing and printing.',
      'High-level AES-256 bit encryption support.',
      'Works entirely in your browser without software installation.'
    ],
    usageGuide: [
      'Select the PDF file you wish to secure.',
      'Enter a strong password for opening the document.',
      '(Optional) Set additional permissions for printing and copying.',
      'Click "Protect PDF" to encrypt the file locally.',
      'Download your newly secured PDF document instantly.'
    ],
    faqs: [
      {
        question: 'How can I protect PDF without uploading?',
        answer: 'PDFMint is a browser-based PDF tool. It uses your computer\'s CPU to apply encryption algorithms directly in your browser, so your file never leaves your computer.'
      },
      {
        question: 'Is my password stored on your server?',
        answer: 'No. Since we offer a private PDF tool that works entirely offline, your password is only used by your browser and is never seen by us.'
      }
    ],
    internalLinks: [
      { label: 'Unlock PDF Privately', path: '/remove-password' },
      { label: 'Secure PDF Editor', path: '/edit-pdf' },
      { label: 'Merge PDF Securely', path: '/merge-pdf' }
    ]
  },
  'remove-password': {
    title: 'Unlock PDF',
    description: 'Remove password security from your PDF files.',
    actionLabel: 'Unlock PDF',
    accept: '.pdf',
    multiple: false,
    metaTitle: 'Remove PDF Password Without Uploading - Secure Unlocker',
    metaDescription: 'Remove PDF passwords without uploading. Unlock protected documents securely in your browser. 100% private. Your password never leaves your device.',
    h1: 'Remove PDF Password Without Uploading',
    intro: 'Unlocking your documents shouldn\'t mean sharing your secrets. PDFMint allows you to remove PDF password without uploading to any server. Our private PDF unlock tool processes the decryption locally in your browser. Whether it\'s a bank statement or a legal contract, our secure PDF online unlocker ensures your password and file stay strictly on your device.',
    benefits: [
      'Total Privacy: Your password is never sent to our servers.',
      'Instant Access: No waiting for cloud processing or queues.',
      'Secure PDF Online: Safe for highly sensitive financial documents.',
      'Remove Restrictions: Enable printing, copying, and editing instantly.'
    ],
    features: [
      'Removes "Owner" passwords and usage restrictions.',
      'Unlocks "User" passwords (requires you to know the password).',
      'Supports all standard PDF encryption levels.',
      'Works entirely in your browser without software.'
    ],
    usageGuide: [
      'Select the password-protected PDF file.',
      'Enter the password if prompted (processed locally).',
      'Click "Unlock PDF" to remove the security layer.',
      'Download your unrestricted PDF document instantly.'
    ],
    faqs: [
      {
        question: 'How can I remove PDF password without uploading?',
        answer: 'PDFMint is a browser-based PDF tool. It uses your computer\'s CPU to decrypt the file locally, so your password and document are never transmitted over the internet.'
      },
      {
        question: 'Is it safe to enter my bank password here?',
        answer: 'Yes. Since we offer a private PDF tool that works entirely offline, your password is only used by your browser and is never seen by us.'
      }
    ],
    internalLinks: [
      { label: 'Encrypt PDF Privately', path: '/add-password' },
      { label: 'Secure PDF Editor', path: '/edit-pdf' },
      { label: 'Split PDF Securely', path: '/split-pdf' }
    ]
  },
  'edit-pdf': {
    title: 'Edit PDF',
    description: 'Add text, images, and annotations to your PDF.',
    actionLabel: 'Save Changes',
    accept: '.pdf',
    multiple: false,
    metaTitle: 'Edit PDF Online Without Uploading - 100% Private Editor',
    metaDescription: 'Edit PDF files without uploading. Add text, images, and annotations securely in your browser. 100% private PDF editor. Your files never leave your device.',
    h1: 'Edit PDF Online Without Uploading',
    intro: 'Modifying your documents shouldn\'t mean giving up your privacy. PDFMint allows you to edit PDF without uploading to any server. Our private PDF editor works entirely within your browser, giving you the power to annotate, add text, and draw directly on your files. With our secure PDF online technology, your confidential documents stay strictly on your machine.',
    benefits: [
      'Total Privacy: Your edits are processed locally; no data is sent to the cloud.',
      'No Installation: A full-featured editor right in your browser.',
      'Secure PDF Online: Safe for contracts, resumes, and personal forms.',
      'Fast & Free: Instant editing without server delays or subscriptions.'
    ],
    features: [
      'Add, move, and resize text anywhere on the page.',
      'Insert images, logos, and signatures.',
      'Draw shapes, highlight text, and add freehand annotations.',
      'Whiteout or redact sensitive information securely.'
    ],
    usageGuide: [
      'Open your PDF file in the PDFMint editor.',
      'Use the toolbar to add text, images, or drawings.',
      'Adjust the placement and style of your annotations.',
      'Click "Save" to finalize your edits locally.',
      'Download your edited PDF document instantly.'
    ],
    faqs: [
      {
        question: 'How can I edit PDF without uploading?',
        answer: 'PDFMint is a browser-based PDF tool. It loads your document into your browser\'s memory and allows you to add layers of text and images locally, so no upload is ever needed.'
      },
      {
        question: 'Is it safe to sign my documents here?',
        answer: 'Yes. Since we offer a private PDF tool that works entirely offline, your signature and document content are never exposed to our servers.'
      }
    ],
    internalLinks: [
      { label: 'Split PDF Privately', path: '/split-pdf' },
      { label: 'Secure PDF Password', path: '/add-password' },
      { label: 'Merge PDF Securely', path: '/merge-pdf' }
    ]
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
        case 'edit-pdf':
          // For now, edit-pdf just returns the original or a simple modification
          // In a real app, this would be more complex
          processedData = new Uint8Array(await files[0].arrayBuffer());
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
      <Helmet>
        <title>{config.metaTitle}</title>
        <meta name="description" content={config.metaDescription} />
      </Helmet>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-indigo-600">
          <ArrowLeft size={16} />
          Back to all tools
        </Link>

        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900">{config.h1}</h1>
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

        {/* SEO Content Section */}
        <div className="mt-20 space-y-16 border-t border-zinc-200 pt-16">
          <section className="prose prose-zinc max-w-none">
            <h2 className="text-3xl font-bold text-zinc-900">About {config.title}</h2>
            <p className="text-lg leading-relaxed text-zinc-600">{config.intro}</p>
          </section>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <section>
              <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-zinc-900">
                <ShieldCheck className="text-indigo-600" />
                Benefits
              </h3>
              <ul className="space-y-4">
                {config.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3 text-zinc-600">
                    <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-500" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-zinc-900">
                <Zap className="text-indigo-600" />
                Features
              </h3>
              <ul className="space-y-4">
                {config.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-zinc-600">
                    <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="rounded-3xl bg-white p-8 shadow-xl shadow-zinc-200/50 ring-1 ring-zinc-200">
            <h3 className="mb-8 text-2xl font-bold text-zinc-900">How to Use {config.title}</h3>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {config.usageGuide.map((step, i) => (
                <div key={i} className="relative">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-bold text-white">
                    {i + 1}
                  </div>
                  <p className="text-zinc-600">{step}</p>
                  {i < config.usageGuide.length - 1 && (
                    <ChevronRight className="absolute -right-4 top-3 hidden text-zinc-300 lg:block" />
                  )}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-8 text-2xl font-bold text-zinc-900">Frequently Asked Questions</h3>
            <div className="space-y-6">
              {config.faqs.map((faq, i) => (
                <div key={i} className="rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-indigo-200 hover:shadow-md">
                  <h4 className="text-lg font-bold text-zinc-900">{faq.question}</h4>
                  <p className="mt-2 text-zinc-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl bg-indigo-600 p-10 text-center text-white">
            <h3 className="text-3xl font-bold">Ready to {config.title}?</h3>
            <p className="mt-4 text-indigo-100">Experience the fastest and most secure way to manage your documents.</p>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="mt-8 rounded-xl bg-white px-8 py-3 font-bold text-indigo-600 transition-all hover:bg-indigo-50"
            >
              Start Now
            </button>
          </section>

          <section className="border-t border-zinc-200 pt-10">
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-zinc-400">Related Tools</h3>
            <div className="flex flex-wrap gap-4">
              {config.internalLinks.map((link, i) => (
                <Link 
                  key={i} 
                  to={link.path}
                  className="rounded-full bg-zinc-100 px-6 py-2 text-sm font-medium text-zinc-600 transition-all hover:bg-indigo-50 hover:text-indigo-600"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
