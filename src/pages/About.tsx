import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Shield, Zap, Lock, Globe } from 'lucide-react';

export const About = () => {
  return (
    <div className="min-h-screen bg-zinc-50 pb-20 pt-10">
      <Helmet>
        <title>About PDFMint - The Private PDF Toolkit | Our Mission</title>
        <meta name="description" content="Learn about PDFMint, the 100% private PDF toolkit. Our mission is to provide secure, browser-based PDF tools without file uploads." />
      </Helmet>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl">About PDFMint</h1>
          <p className="mt-4 text-xl text-zinc-500">The world's most secure PDF toolkit.</p>
        </motion.div>

        <div className="mt-16 space-y-12">
          <section className="rounded-3xl bg-white p-8 shadow-xl shadow-zinc-200/50 ring-1 ring-zinc-200">
            <h2 className="text-2xl font-bold text-zinc-900">Our Mission</h2>
            <p className="mt-4 leading-relaxed text-zinc-600">
              PDFMint was founded with a simple goal: to make PDF management secure. Most online tools require you to upload your files to their servers, which creates a massive privacy risk. We believe your data should belong to you.
            </p>
            <p className="mt-4 leading-relaxed text-zinc-600">
              To provide a fast, free, and <strong>secure PDF online</strong> experience for everyone, from students to large enterprises, without compromising on privacy.
            </p>
          </section>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Lock size={24} />
              </div>
              <h3 className="text-lg font-bold text-zinc-900">100% Private</h3>
              <p className="mt-2 text-sm text-zinc-500">Your files never leave your device. All processing happens locally in your browser.</p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Zap size={24} />
              </div>
              <h3 className="text-lg font-bold text-zinc-900">Blazing Fast</h3>
              <p className="mt-2 text-sm text-zinc-500">No waiting for uploads or downloads. Processing is as fast as your computer.</p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Shield size={24} />
              </div>
              <h3 className="text-lg font-bold text-zinc-900">Secure by Design</h3>
              <p className="mt-2 text-sm text-zinc-500">We use cutting-edge browser technology to ensure your data is always safe.</p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Globe size={24} />
              </div>
              <h3 className="text-lg font-bold text-zinc-900">Global & Free</h3>
              <p className="mt-2 text-sm text-zinc-500">Available to everyone, everywhere. No subscriptions, no limits, no catches.</p>
            </div>
          </div>

          <section className="rounded-3xl bg-white p-8 shadow-xl shadow-zinc-200/50 ring-1 ring-zinc-200">
            <h2 className="text-2xl font-bold text-zinc-900">Our Technology</h2>
            <p className="mt-4 leading-relaxed text-zinc-600">
              We use cutting-edge <strong>browser-based PDF tool</strong> technology. By running the processing logic directly in your browser, we eliminate the need for a backend server to ever see your files. This is why we are the leading <strong>private PDF tool</strong> on the market.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
