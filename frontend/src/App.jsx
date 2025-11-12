import React from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import ReportForm from './components/ReportForm';
import Footer from './components/Footer';


export default function App() {
  return (
    <div className="bg-slate-50 text-slate-800 antialiased">
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <ReportForm />
      </main>
      <Footer />
    </div>
  );
}