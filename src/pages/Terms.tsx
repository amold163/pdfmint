import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { FileText, ShieldAlert, Scale, CheckCircle } from 'lucide-react';

export const Terms = () => {
  return (
    <div className="min-h-screen bg-zinc-50 pb-20 pt-10">
      <Helmet>
        <title>Terms of Service - PDFMint | Secure PDF Usage</title>
        <meta name="description" content="Terms and conditions for using PDFMint.in. Secure, private, and free PDF tools." />
      </Helmet>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl">Terms of Service</h1>
          <p className="mt-4 text-xl text-zinc-500">Simple and transparent terms for our users.</p>
        </motion.div>

        <div className="mt-16 space-y-12">
          <section className="rounded-3xl bg-white p-8 shadow-xl shadow-zinc-200/50 ring-1 ring-zinc-200">
            <h2 className="text-2xl font-bold text-zinc-900">1. Use of Service</h2>
            <p className="mt-4 leading-relaxed text-zinc-600">
              PDFMint provides <strong>private PDF tools</strong> for personal and professional use. You are responsible for the content of the files you process.
            </p>
          </section>

          <section className="rounded-3xl bg-white p-8 shadow-xl shadow-zinc-200/50 ring-1 ring-zinc-200">
            <h2 className="text-2xl font-bold text-zinc-900">2. No Warranty</h2>
            <p className="mt-4 leading-relaxed text-zinc-600">
              While we strive for the highest quality in our <strong>secure PDF online</strong> tools, we provide the service "as is" without any express or implied warranties.
            </p>
          </section>

          <section className="rounded-3xl bg-white p-8 shadow-xl shadow-zinc-200/50 ring-1 ring-zinc-200">
            <h2 className="text-2xl font-bold text-zinc-900">3. Limitation of Liability</h2>
            <p className="mt-4 leading-relaxed text-zinc-600">
              Since your files never leave your device, PDFMint is not liable for any data loss or issues arising from local processing on your hardware.
            </p>
          </section>

          <section className="rounded-3xl bg-white p-8 shadow-xl shadow-zinc-200/50 ring-1 ring-zinc-200">
            <h2 className="text-2xl font-bold text-zinc-900">4. Prohibited Uses</h2>
            <p className="mt-4 leading-relaxed text-zinc-600">
              You agree not to use PDFMint for any illegal activities or to process documents that violate the rights of others.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
