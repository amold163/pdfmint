import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { ShieldCheck, Lock, EyeOff, ServerOff } from 'lucide-react';

export const Privacy = () => {
  return (
    <div className="min-h-screen bg-zinc-50 pb-20 pt-10">
      <Helmet>
        <title>Privacy Policy - PDFMint | 100% Local Processing</title>
        <meta name="description" content="Read our privacy policy. PDFMint is a zero-upload PDF tool. We never see, store, or share your files." />
      </Helmet>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl">Privacy Policy</h1>
          <p className="mt-4 text-xl text-zinc-500">Your privacy is our foundation.</p>
        </motion.div>

        <div className="mt-16 space-y-12">
          <section className="rounded-3xl bg-white p-8 shadow-xl shadow-zinc-200/50 ring-1 ring-zinc-200">
            <h2 className="text-2xl font-bold text-zinc-900">1. No File Collection</h2>
            <p className="mt-4 leading-relaxed text-zinc-600">
              We do not collect, store, or share any files you process using our tools. All operations (like <strong>merge PDF without uploading</strong>) happen locally on your device.
            </p>
            <div className="mt-6 flex items-center gap-4 rounded-xl bg-indigo-50 p-4 text-sm text-indigo-700">
              <ServerOff size={24} className="shrink-0" />
              <p>We don't have a "cloud". Your files are processed using your computer's CPU.</p>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-8 shadow-xl shadow-zinc-200/50 ring-1 ring-zinc-200">
            <h2 className="text-2xl font-bold text-zinc-900">2. Local Processing</h2>
            <p className="mt-4 leading-relaxed text-zinc-600">
              Our <strong>browser-based PDF tool</strong> technology ensures that the file data stays within your browser's temporary memory and is never transmitted to our servers.
            </p>
            <div className="mt-6 flex items-center gap-4 rounded-xl bg-indigo-50 p-4 text-sm text-indigo-700">
              <EyeOff size={24} className="shrink-0" />
              <p>We never see, store, or share your files. Your data is strictly yours.</p>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-8 shadow-xl shadow-zinc-200/50 ring-1 ring-zinc-200">
            <h2 className="text-2xl font-bold text-zinc-900">3. Cookies and Analytics</h2>
            <p className="mt-4 leading-relaxed text-zinc-600">
              We may use minimal, non-identifiable cookies to improve site performance. We do not track your personal document activity.
            </p>
          </section>

          <section className="rounded-3xl bg-white p-8 shadow-xl shadow-zinc-200/50 ring-1 ring-zinc-200">
            <h2 className="text-2xl font-bold text-zinc-900">4. Security by Design</h2>
            <p className="mt-4 leading-relaxed text-zinc-600">
              PDFMint is built with security as its core principle. By eliminating the need for file uploads, we remove the single largest vulnerability in online document management.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
