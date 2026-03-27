import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Merge, 
  Scissors, 
  Minimize2, 
  Image as ImageIcon, 
  FileImage, 
  FileText, 
  FileCode, 
  Lock, 
  Unlock, 
  Type,
  Search,
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const tools = [
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    description: 'Combine multiple PDFs into one document in seconds.',
    icon: <Merge size={24} />,
    color: 'bg-orange-50 text-orange-600',
    path: '/merge-pdf'
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    description: 'Extract pages from your PDF or save each page as a separate PDF.',
    icon: <Scissors size={24} />,
    color: 'bg-blue-50 text-blue-600',
    path: '/split-pdf'
  },
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    description: 'Reduce the file size of your PDF while maintaining quality.',
    icon: <Minimize2 size={24} />,
    color: 'bg-red-50 text-red-600',
    path: '/compress-pdf'
  },
  {
    id: 'image-to-pdf',
    name: 'Image to PDF',
    description: 'Convert JPG, PNG, and other images to PDF documents.',
    icon: <ImageIcon size={24} />,
    color: 'bg-emerald-50 text-emerald-600',
    path: '/image-to-pdf'
  },
  {
    id: 'pdf-to-image',
    name: 'PDF to Image',
    description: 'Extract images from your PDF or save each page as a JPG.',
    icon: <FileImage size={24} />,
    color: 'bg-amber-50 text-amber-600',
    path: '/pdf-to-image'
  },
  {
    id: 'pdf-to-word',
    name: 'PDF to Word',
    description: 'Convert your PDF documents to editable Word files.',
    icon: <FileText size={24} />,
    color: 'bg-indigo-50 text-indigo-600',
    path: '/pdf-to-word'
  },
  {
    id: 'word-to-pdf',
    name: 'Word to PDF',
    description: 'Convert Microsoft Word documents to PDF format.',
    icon: <FileCode size={24} />,
    color: 'bg-sky-50 text-sky-600',
    path: '/word-to-pdf'
  },
  {
    id: 'add-password',
    name: 'Protect PDF',
    description: 'Encrypt your PDF with a password to prevent unauthorized access.',
    icon: <Lock size={24} />,
    color: 'bg-rose-50 text-rose-600',
    path: '/add-password'
  },
  {
    id: 'remove-password',
    name: 'Unlock PDF',
    description: 'Remove password security from your PDF files.',
    icon: <Unlock size={24} />,
    color: 'bg-violet-50 text-violet-600',
    path: '/remove-password'
  },
  {
    id: 'add-watermark',
    name: 'Watermark',
    description: 'Add text or image watermarks to your PDF pages.',
    icon: <Type size={24} />,
    color: 'bg-cyan-50 text-cyan-600',
    path: '/add-watermark'
  }
];

export const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = tools.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-zinc-50 py-20 lg:py-32">
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-indigo-200 blur-3xl"></div>
          <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-blue-200 blur-3xl"></div>
        </div>
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-700">
              100% Free & Secure
            </span>
            <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-zinc-900 sm:text-6xl lg:text-7xl">
              All PDF Tools in <span className="text-indigo-600">One Place</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600">
              The fastest, most secure way to manage your PDF files. All processing happens in your browser for maximum privacy. No files are stored on our servers.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-10 max-w-xl"
          >
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-400">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Search for a tool (e.g., merge, split, compress)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full rounded-2xl border-none bg-white py-4 pl-12 pr-4 text-zinc-900 shadow-xl shadow-zinc-200/50 ring-1 ring-zinc-200 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link 
                to={tool.path}
                className="group flex h-full flex-col rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/10"
              >
                <div className={cn("mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110", tool.color)}>
                  {tool.icon}
                </div>
                <h3 className="text-lg font-bold text-zinc-900">{tool.name}</h3>
                <p className="mt-2 flex-grow text-sm text-zinc-500">{tool.description}</p>
                <div className="mt-6 flex items-center text-sm font-semibold text-indigo-600 opacity-0 transition-opacity group-hover:opacity-100">
                  Try it now <ArrowRight size={16} className="ml-1" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        
        {filteredTools.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-lg text-zinc-500">No tools found matching your search.</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-4 font-semibold text-indigo-600 hover:underline"
            >
              Clear search
            </button>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-zinc-900 py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Why choose PDFmint?</h2>
            <p className="mt-4 text-zinc-400">We prioritize your privacy and speed above everything else.</p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800 text-indigo-400 mb-6">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold">Privacy First</h3>
              <p className="mt-4 text-sm text-zinc-400 leading-relaxed">
                Your files never leave your computer for most operations. We use client-side processing to ensure your data stays yours.
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800 text-indigo-400 mb-6">
                <Zap size={32} />
              </div>
              <h3 className="text-xl font-bold">Lightning Fast</h3>
              <p className="mt-4 text-sm text-zinc-400 leading-relaxed">
                No waiting for uploads or server queues. Most operations are completed instantly right in your browser.
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800 text-indigo-400 mb-6">
                <Clock size={32} />
              </div>
              <h3 className="text-xl font-bold">No Registration</h3>
              <p className="mt-4 text-sm text-zinc-400 leading-relaxed">
                Start using our tools immediately. No account, no email, no credit card required for basic operations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ads Placeholder */}
      <section className="mx-auto max-w-4xl px-4 py-12">
        <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50 text-xs font-medium uppercase tracking-widest text-zinc-400">
          Advertisement Space
        </div>
      </section>
    </div>
  );
};
