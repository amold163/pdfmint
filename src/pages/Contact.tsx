import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Mail, Send, CheckCircle2, MessageSquare } from 'lucide-react';

export const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-zinc-50 pb-20 pt-10">
      <Helmet>
        <title>Contact PDFMint - Support & Feedback for Private PDF Tools</title>
        <meta name="description" content="Get in touch with the PDFMint team. We value your feedback on our private, browser-based PDF tools. Secure and fast support for all your PDF needs." />
      </Helmet>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl">Contact Us</h1>
          <p className="mt-4 text-xl text-zinc-500">We'd love to hear from you.</p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <section className="rounded-3xl bg-white p-8 shadow-xl shadow-zinc-200/50 ring-1 ring-zinc-200">
              <h2 className="text-2xl font-bold text-zinc-900">Get in Touch</h2>
              <p className="mt-4 leading-relaxed text-zinc-600">
                Have questions about our <strong>secure PDF online</strong> tools? We would love to hear from you.
              </p>
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-4 text-zinc-600">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <Mail size={20} />
                  </div>
                  <span>support@pdfmint.in</span>
                </div>
                <div className="flex items-center gap-4 text-zinc-600">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <MessageSquare size={20} />
                  </div>
                  <span>Response time: 24-48 hours</span>
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-white p-8 shadow-xl shadow-zinc-200/50 ring-1 ring-zinc-200">
              <h2 className="text-2xl font-bold text-zinc-900">Contact FAQs</h2>
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="font-bold text-zinc-900">Do you see my files if I contact support?</h3>
                  <p className="mt-2 text-sm text-zinc-500">No. Even if you contact us for support, we never have access to your documents. Our <strong>private PDF tool</strong> architecture ensures all processing stays on your device.</p>
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900">Can I request a new PDF tool?</h3>
                  <p className="mt-2 text-sm text-zinc-500">Absolutely! We are constantly expanding our <strong>secure PDF online</strong> toolkit. If there is a tool you need that works without uploading files, please let us know.</p>
                </div>
              </div>
            </section>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-xl shadow-zinc-200/50 ring-1 ring-zinc-200">
            {submitted ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={32} />
                </div>
                <h2 className="text-2xl font-bold text-zinc-900">Message Sent!</h2>
                <p className="mt-4 text-zinc-500">Thank you for reaching out. We'll get back to you as soon as possible.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-8 text-indigo-600 font-semibold hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-bold uppercase tracking-wider text-zinc-400">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    required 
                    className="w-full rounded-xl border-zinc-200 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-bold uppercase tracking-wider text-zinc-400">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    required 
                    className="w-full rounded-xl border-zinc-200 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-bold uppercase tracking-wider text-zinc-400">Subject</label>
                  <select 
                    id="subject" 
                    className="w-full rounded-xl border-zinc-200 focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Support</option>
                    <option value="feedback">Feedback / Suggestions</option>
                    <option value="privacy">Privacy Concerns</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-bold uppercase tracking-wider text-zinc-400">Your Message</label>
                  <textarea 
                    id="message" 
                    required 
                    rows={5}
                    className="w-full rounded-xl border-zinc-200 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="How can we help you?"
                  />
                </div>
                <button 
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-4 font-bold text-white transition-all hover:bg-indigo-700"
                >
                  <Send size={20} />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
