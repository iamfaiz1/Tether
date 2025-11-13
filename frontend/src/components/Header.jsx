import React from "react";

export default function Header({ setCurrentPage }) {
  return (
    <header className="absolute top-0 left-0 w-full z-10 py-6 px-4 md:px-8">
      <div className="container mx-auto flex justify-between items-center">
        <h1
          className="text-3xl font-bold text-white cursor-pointer"
          onClick={() => setCurrentPage("home")}
        >
          Tether
        </h1>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentPage("match")}
            className="bg-white/20 backdrop-blur-sm text-white font-medium py-2 px-5 rounded-full hover:bg-white/30 transition"
          >
            View Match Demo
          </button>

          <a
            href="#report-form"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage("home");
              document.getElementById("report-form")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
            className="bg-white text-slate-900 font-medium py-2 px-5 rounded-full hover:bg-slate-200 transition"
          >
            Report Child
          </a>
        </div>
      </div>
    </header>
  );
}
