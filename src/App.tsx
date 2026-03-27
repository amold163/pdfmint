import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar, Footer } from './components/Layout';
import { Home } from './pages/Home';
import { ToolPage } from './pages/ToolPage';

export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen flex-col font-sans text-zinc-900 selection:bg-indigo-100 selection:text-indigo-900">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
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
