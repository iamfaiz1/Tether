import React, { useState } from "react";
// FIX: Removed "./components/" from paths, assuming flat structure in src/
import Header from "./components/Header";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import ReportForm from "./components/ReportForm";
import Footer from "./components/Footer";
import MatchConfirmationPage from "./components/MatchConfirmationPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home"); // 'home' | 'match'
  const [currentMatchId, setCurrentMatchId] = useState(null); // Store the ID of the submission that got a match

  /**
   * This function is called by ReportForm when the backend finds a match.
   * It stores the match ID and switches the page.
   */
  const handleMatchFound = (submissionId) => {
    console.log("Match found! Submission ID:", submissionId);
    setCurrentMatchId(submissionId);
    setCurrentPage("match");
  };

  /**
   * This function is passed to the MatchConfirmationPage to reset
   * the state and return to the home page.
   */
  const handleMatchComplete = () => {
    setCurrentMatchId(null);
    setCurrentPage("home");
  };

  return (
    <div className="bg-slate-50 text-slate-800 antialiased">
      {/* Header is persistent */}
      <Header setCurrentPage={setCurrentPage} />

      <main>
        {/* --- HOME PAGE --- */}
        {currentPage === "home" && (
          <>
            <Hero />
            <HowItWorks />
            {/* Pass the handleMatchFound function as a prop here
            */}
            <ReportForm onMatchFound={handleMatchFound} />
          </>
        )}

        {/* --- MATCH CONFIRMATION PAGE --- */}
        {currentPage === "match" && (
          <MatchConfirmationPage
            // Pass the stored ID to the match page
            submissionId={currentMatchId} 
            // Pass the reset function for onConfirm/onReject
            onConfirm={handleMatchComplete}
            onReject={handleMatchComplete}
          />
        )}
      </main>

      {/* Footer only shows on the home page */}
      {currentPage === "home" && <Footer />}
    </div>
  );
}