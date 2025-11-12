import React, { useState } from "react";
import {IconUser, IconMail, IconMapPin, IconPlus, IconX, IconUpload} from "./icons/Icons";


export default function ReportForm() {
  const [role, setRole] = useState("parent");
  const [birthMarks, setBirthMarks] = useState([""]);
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAddBirthmark = () => setBirthMarks([...birthMarks, ""]);
  const handleRemoveBirthmark = (i) =>
    setBirthMarks(birthMarks.filter((_, idx) => idx !== i));
  const handleBirthmarkChange = (i, val) =>
    setBirthMarks(birthMarks.map((b, idx) => (idx === i ? val : b)));

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const form = e.target;
      const fd = new FormData(form);
      birthMarks.forEach((b) => fd.append("birth_marks", b));
      fd.append("photo", photo);

      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Upload failed");
      setResult({ success: true, data });
    } catch (err) {
      setResult({ success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  }

  const roleBtn = (r) =>
    `w-1/2 py-3 rounded-lg font-semibold ${
      role === r
        ? "bg-cyan-600 text-white shadow"
        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
    }`;

  const inputBox =
    "w-full pl-10 pr-3 py-3 border rounded-lg border-slate-300 focus:ring-2 focus:ring-cyan-500 outline-none transition-all";
  const labelClass = "text-sm font-medium text-slate-700 mb-2 block";

  return (
    <section id="report-form" className="py-20 bg-slate-50">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-slate-200">
        <h2 className="text-3xl font-bold text-center mb-2 text-slate-800">
          Tether - Report
        </h2>
        <p className="text-center text-slate-500 mb-8">
          Please fill all required fields (*). Your data is processed securely.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selector */}
          <div className="flex bg-slate-100 p-1 rounded-lg mb-8">
            <button
              type="button"
              onClick={() => setRole("parent")}
              className={roleBtn("parent")}
            >
              I’m a Parent
            </button>
            <button
              type="button"
              onClick={() => setRole("volunteer")}
              className={roleBtn("volunteer")}
            >
              I’m a Volunteer
            </button>
          </div>

          {/* Parent or Volunteer Info */}
          {role === "parent" ? (
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Parent Name*</label>
                <div className="relative">
                  <span className="absolute left-3 top-3">
                    <IconUser />
                  </span>
                  <input
                    name="parent_name"
                    required
                    placeholder="e.g. John Doe"
                    className={inputBox}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Parent Email</label>
                <div className="relative">
                  <span className="absolute left-3 top-3">
                    <IconMail />
                  </span>
                  <input
                    name="parent_email"
                    type="email"
                    placeholder="e.g. john@example.com"
                    className={inputBox}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Alternate Email</label>
                <div className="relative">
                  <span className="absolute left-3 top-3">
                    <IconMail />
                  </span>
                  <input
                    name="parent_alt_email"
                    type="email"
                    className={inputBox}
                    placeholder="Optional backup email"
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Phone*</label>
                <input
                  name="parent_phone"
                  required
                  className={inputBox + " pl-4"}
                  placeholder="e.g. +91 99999 88888"
                />
              </div>
              <div>
                <label className={labelClass}>Alt Phone</label>
                <input
                  name="parent_alt_phone"
                  className={inputBox + " pl-4"}
                  placeholder="Optional"
                />
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Volunteer Name*</label>
                <div className="relative">
                  <span className="absolute left-3 top-3">
                    <IconUser />
                  </span>
                  <input
                    name="volunteer_name"
                    required
                    placeholder="e.g. Jane Doe"
                    className={inputBox}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Volunteer Email</label>
                <div className="relative">
                  <span className="absolute left-3 top-3">
                    <IconMail />
                  </span>
                  <input
                    name="volunteer_email"
                    type="email"
                    placeholder="e.g. jane@example.com"
                    className={inputBox}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Alt Email</label>
                <input
                  name="volunteer_alt_email"
                  type="email"
                  className={inputBox + " pl-4"}
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className={labelClass}>Phone*</label>
                <input
                  name="volunteer_phone"
                  required
                  className={inputBox + " pl-4"}
                  placeholder="e.g. +91 90909 77777"
                />
              </div>
              <div>
                <label className={labelClass}>Alt Phone</label>
                <input
                  name="volunteer_alt_phone"
                  className={inputBox + " pl-4"}
                  placeholder="Optional"
                />
              </div>
            </div>
          )}

          {/* Child/Found Info */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                {role === "parent" ? "Lost Child Name*" : "Found Child Name*"}
              </label>
              <input name="child_name" required className={inputBox + " pl-4"} />
            </div>
            <div>
              <label className={labelClass}>Age*</label>
              <input
                name="child_age"
                type="number"
                required
                className={inputBox + " pl-4"}
              />
            </div>
            <div>
              <label className={labelClass}>Skin Complexion*</label>
              <select name="skin_complexion" required className={inputBox}>
                <option value="pale">Pale</option>
                <option value="fair">Fair</option>
                <option value="medium">Medium</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>City*</label>
              <div className="relative">
                <span className="absolute left-3 top-3">
                  <IconMapPin />
                </span>
                <input
                  name="city"
                  required
                  className={inputBox}
                  placeholder="e.g. Delhi"
                />
              </div>
            </div>
            {role === "volunteer" && (
              <div className="sm:col-span-2">
                <label className={labelClass}>Address*</label>
                <input
                  name="address"
                  className={inputBox + " pl-4"}
                  placeholder="Where found..."
                />
              </div>
            )}
          </div>

          {/* Birthmarks */}
          <div>
            <label className={labelClass}>Birthmarks (optional)</label>
            {birthMarks.map((b, i) => (
              <div key={i} className="flex items-center mb-2">
                <input
                  value={b}
                  onChange={(e) => handleBirthmarkChange(i, e.target.value)}
                  className={inputBox + " pl-4"}
                  placeholder="e.g. mole on left cheek"
                />
                {birthMarks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveBirthmark(i)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <IconX />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddBirthmark}
              className="text-cyan-600 hover:text-cyan-700 flex items-center mt-2 text-sm font-semibold"
            >
              <IconPlus /> Add another birthmark
            </button>
          </div>

          {/* Photo Upload */}
          <div>
            <label className={labelClass}>Upload Child Photo*</label>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg p-8">
              <IconUpload />
              <p className="mt-3 text-slate-500">Upload image (JPG/PNG)</p>
              <input
                type="file"
                name="photo"
                accept="image/*"
                required
                onChange={handlePhotoChange}
                className="mt-4"
              />
              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  className="mt-4 w-40 rounded-lg shadow"
                />
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-lg shadow-md transition-all"
          >
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        </form>

        {result && (
          <div
            className={`mt-6 p-4 rounded-lg ${
              result.success
                ? "bg-green-50 border border-green-300"
                : "bg-red-50 border border-red-300"
            }`}
          >
            {result.success ? (
              <>
                <h4 className="font-semibold text-green-700">
                  Report submitted successfully
                </h4>
                <pre className="text-xs mt-2 bg-white rounded-lg p-2 overflow-x-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </>
            ) : (
              <p className="text-red-700 font-medium">
                Error: {result.error || "Something went wrong."}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
