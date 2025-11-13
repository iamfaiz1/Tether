import React, { useState } from "react";

import Header from "./components/Header";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import ReportForm from "./components/ReportForm";
import Footer from "./components/Footer";
import MatchConfirmationPage from "./components/MatchConfirmationPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home"); // home | match

  return (
    <div className="bg-slate-50 text-slate-800 antialiased">

      {/* Header stays always */}
      <Header setCurrentPage={setCurrentPage} />

      <main className="min-h-screen">

        {/* HOME PAGE */}
        {currentPage === "home" && (
          <>
            <Hero />
            <HowItWorks />
            <ReportForm />
          </>
        )}

        {/* MATCH PAGE (full screen page) */}
        {currentPage === "match" && (
          <MatchConfirmationPage
            onConfirm={() => setCurrentPage("home")}
            onReject={() => setCurrentPage("home")}
          />
        )}

      </main>

      {/* Footer stays on home page only */}
      {currentPage === "home" && <Footer />}
    </div>
  );
}
