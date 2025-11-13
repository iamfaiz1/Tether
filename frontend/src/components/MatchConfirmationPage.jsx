import React, { useState } from "react";
import ImageCard from "./ImageCard";
import {
  IconCheck,
  IconXClose,
  IconCalendar,
  IconUser,
  IconInfo
} from "./icons/Icons";

export default function MatchConfirmationPage({ onConfirm, onReject }) {
  const [status, setStatus] = useState("pending");

  const mockMatchData = {
    parentReport: {
      childName: "Ethan",
      imageUrl:
        "https://placehold.co/400x400/dbeafe/1e3a8a?text=Ethan+(Parent's+Photo)",
    },
    volunteerReport: {
      childName: "Found Child (Ref: #82A4)",
      imageUrl:
        "https://placehold.co/400x400/cffafe/0891b2?text=Found+Child+(Volunteer's+Photo)",
      uploadedBy: "Volunteer V-1024",
      dateUploaded: "2025-11-12T10:30:00Z",
      details: {
        "Approx. Age": "5",
        "Skin Complexion": "Fair",
        "City Found": "New York City",
        "Address Found": "Near Central Park entrance, 59th St",
        "Identifying Marks": "Small mole on left cheek",
      },
    },
    matchScore: 92.8,
  };

  const handleConfirm = () => {
    setStatus("confirmed");
    setTimeout(onConfirm, 2000);
  };

  const handleReject = () => {
    setStatus("rejected");
    setTimeout(onReject, 2000);
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <section className="py-28 md:py-36 bg-slate-100 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto bg-white p-10 rounded-2xl shadow-xl border border-slate-200">

          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
            We Found a Potential Match
          </h2>

          <p className="text-center text-slate-600 mb-12">
            Please review the details and confirm if this is your child.
          </p>


          {/* --- IMAGE COMPARISON --- */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">

            <ImageCard
              title="Your Report"
              imageUrl={mockMatchData.parentReport.imageUrl}
              altText="Parent's Photo"
            />

            <div className="text-center">
              <p className="text-slate-500 text-sm">Match Score</p>
              <p className="text-4xl font-bold text-cyan-600 my-2">
                {mockMatchData.matchScore}%
              </p>
            </div>

            <ImageCard
              title="Found Child"
              imageUrl={mockMatchData.volunteerReport.imageUrl}
              altText="Volunteer Photo"
            />

          </div>


          {/* --- DETAILS --- */}
          <div className="mt-12 p-6 bg-slate-50 rounded-xl border">
            <h3 className="text-xl font-bold mb-6">Volunteer’s Report</h3>

            <div className="grid md:grid-cols-2 gap-6">

              <div className="flex items-start gap-3">
                <IconCalendar />
                <div>
                  <p className="font-semibold">Uploaded</p>
                  <p className="text-slate-600">
                    {formatDate(mockMatchData.volunteerReport.dateUploaded)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <IconUser />
                <div>
                  <p className="font-semibold">Uploaded By</p>
                  <p className="text-slate-600">
                    {mockMatchData.volunteerReport.uploadedBy}
                  </p>
                </div>
              </div>

              {Object.entries(mockMatchData.volunteerReport.details).map(
                ([k, v]) => (
                  <div key={k} className="flex items-start gap-3">
                    <IconInfo />
                    <div>
                      <p className="font-semibold">{k}</p>
                      <p className="text-slate-600">{v}</p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* --- CONFIRMATION BUTTONS --- */}
          <div className="mt-10 text-center">

            {status === "pending" && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleReject}
                  className="flex items-center justify-center gap-2 bg-slate-700 text-white py-4 px-8 rounded-lg hover:bg-slate-800"
                >
                  <IconXClose className="h-5 w-5" />
                  No, Not My Child
                </button>

                <button
                  onClick={handleConfirm}
                  className="flex items-center justify-center gap-2 bg-green-600 text-white py-4 px-8 rounded-lg hover:bg-green-700"
                >
                  <IconCheck className="h-5 w-5" />
                  Yes, This Is My Child
                </button>
              </div>
            )}

            {status === "confirmed" && (
              <p className="text-green-700 bg-green-100 p-4 rounded-lg">
                Match confirmed — we will contact you shortly.
              </p>
            )}

            {status === "rejected" && (
              <p className="text-yellow-700 bg-yellow-100 p-4 rounded-lg">
                Marked incorrect — we’ll continue searching.
              </p>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
