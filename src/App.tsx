import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar, Footer } from './components/Layout';
import { Home } from './pages/Home';
import { ToolPage } from './pages/ToolPage';
import { About } from './pages/About';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { Contact } from './pages/Contact';

export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen flex-col font-sans text-zinc-900 selection:bg-indigo-100 selection:text-indigo-900">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/:toolId" element={<ToolPage />} />
            {/* Fallback for SEO routes that might be nested */}
            <Route path="/tools/:toolId" element={<ToolPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
