import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Shield, Zap, Moon, Sun, Github, Twitter, Mail } from 'lucide-react';
import { motion } from 'motion/react';

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
            <FileText size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-900">PDF<span className="text-indigo-600">mint</span></span>
        </Link>
        
        <div className="hidden items-center gap-8 md:flex">
          <Link to="/" className="text-sm font-medium text-zinc-600 hover:text-indigo-600">Tools</Link>
          <Link to="/about" className="text-sm font-medium text-zinc-600 hover:text-indigo-600">About</Link>
          <Link to="/contact" className="text-sm font-medium text-zinc-600 hover:text-indigo-600">Contact</Link>
        </div>

        <div className="flex items-center gap-4">
          <button className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100">
            <Sun size={20} />
          </button>
          <Link to="/pro" className="hidden rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-zinc-800 sm:block">
            Go Pro
          </Link>
        </div>
      </div>
    </nav>
  );
};

export const Footer = () => {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <FileText size={18} />
              </div>
              <span className="text-lg font-bold tracking-tight text-zinc-900">PDFmint</span>
            </div>
            <p className="max-w-xs text-sm text-zinc-500">
              The fastest, most secure way to manage your PDF files. All processing happens in your browser for maximum privacy.
            </p>
            <div className="mt-6 flex gap-4">
              <a href="#" className="text-zinc-400 hover:text-zinc-600"><Twitter size={20} /></a>
              <a href="#" className="text-zinc-400 hover:text-zinc-600"><Github size={20} /></a>
              <a href="#" className="text-zinc-400 hover:text-zinc-600"><Mail size={20} /></a>
            </div>
          </div>
          
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-900">Tools</h3>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><Link to="/merge-pdf" className="hover:text-indigo-600">Merge PDF</Link></li>
              <li><Link to="/split-pdf" className="hover:text-indigo-600">Split PDF</Link></li>
              <li><Link to="/compress-pdf" className="hover:text-indigo-600">Compress PDF</Link></li>
              <li><Link to="/pdf-to-word" className="hover:text-indigo-600">PDF to Word</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-900">Company</h3>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><Link to="/privacy" className="hover:text-indigo-600">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-indigo-600">Terms of Service</Link></li>
              <li><Link to="/contact" className="hover:text-indigo-600">Contact Us</Link></li>
              <li><Link to="/about" className="hover:text-indigo-600">About</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-zinc-200 pt-8 text-center text-xs text-zinc-400">
          © {new Date().getFullYear()} PDFmint. Built with privacy in mind.
        </div>
      </div>
    </footer>
  );
};
