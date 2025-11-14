import React, { useState } from "react";
import {
  IconUser,
  IconMail,
  IconMapPin,
  IconPlus,
  IconX,
  IconUpload
} from "./icons/Icons";

export default function ReportForm({ onMatchFound }) {
  const [role, setRole] = useState("parent");

  // Reporter Info
  const [reporter, setReporter] = useState({
    name: "",
    email: "",
    altEmail: "",
    phone: "",
    altPhone: ""
  });

  // Child Info
  const [child, setChild] = useState({
    name: "",
    age: "",
    skin: "",
    city: "",
    address: ""
  });

  const [birthMarks, setBirthMarks] = useState([""]);
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleReporter = (key, val) =>
    setReporter({ ...reporter, [key]: val });

  const handleChild = (key, val) =>
    setChild({ ...child, [key]: val });

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

  // ===========================
  // SUBMIT TO BACKEND
  // ===========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData();

    form.append("role", role);

    // reporter
    form.append("reporter_name", reporter.name);
    form.append("reporter_email", reporter.email);
    form.append("reporter_alt_email", reporter.altEmail);
    form.append("reporter_phone", reporter.phone);
    form.append("reporter_alt_phone", reporter.altPhone);

    // child
    form.append("child_name", child.name);
    form.append("child_age", child.age);
    form.append("skin_complexion", child.skin);
    form.append("city", child.city);

    if (role === "volunteer") {
      form.append("address", child.address);
    } else {
      form.append("address", "");
    }

    // birthmarks
    form.append("birthmarks", JSON.stringify(birthMarks));

    // file
    form.append("file", photo);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/report", {
        method: "POST",
        body: form
      });

      const data = await res.json();
      console.log("REPORT API RESPONSE →", data);

      if (data.match_found) {
        onMatchFound(data.submission_id);  // go to match page
      } else {
        alert("Report submitted. No match found.");
      }
    } catch (e) {
      console.error("UPLOAD ERROR", e);
      alert("Upload failed!");
    }

    setLoading(false);
  };

  const roleBtn = (r) =>
    `w-1/2 py-3 rounded-lg font-semibold ${
      role === r
        ? "bg-cyan-600 text-white shadow"
        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
    }`;

  const inputBox =
    "w-full pl-10 pr-3 py-3 border rounded-lg border-slate-300 focus:ring-2 focus:ring-cyan-500 outline-none";

  const labelClass = "text-sm font-medium text-slate-700 mb-2 block";

  return (
    <section id="report-form" className="py-20 bg-slate-50">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-lg border">
        <h2 className="text-3xl font-bold text-center mb-2 text-slate-800">
          Tether - Report
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ROLE BUTTONS */}
          <div className="flex bg-slate-100 p-1 rounded-lg mb-8">
            <button type="button" className={roleBtn("parent")} onClick={() => setRole("parent")}>
              I'm a Parent
            </button>
            <button type="button" className={roleBtn("volunteer")} onClick={() => setRole("volunteer")}>
              I'm a Volunteer
            </button>
          </div>

          {/* REPORTER INFO */}
          <div className="grid sm:grid-cols-2 gap-4">

            {/* Name */}
            <div>
              <label className={labelClass}>Name*</label>
              <div className="relative">
                <span className="absolute left-3 top-3"><IconUser /></span>
                <input className={inputBox} required
                       value={reporter.name}
                       onChange={(e) => handleReporter("name", e.target.value)}
                       placeholder="Your name" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className={labelClass}>Email*</label>
              <div className="relative">
                <span className="absolute left-3 top-3"><IconMail /></span>
                <input type="email" className={inputBox}
                       value={reporter.email}
                       onChange={(e) => handleReporter("email", e.target.value)}
                       required
                       placeholder="Email" />
              </div>
            </div>

            {/* Alt Email */}
            <div>
              <label className={labelClass}>Alternate Email</label>
              <input className={inputBox + " pl-4"}
                     value={reporter.altEmail}
                     onChange={(e) => handleReporter("altEmail", e.target.value)} />
            </div>

            {/* Phone */}
            <div>
              <label className={labelClass}>Phone*</label>
              <input className={inputBox + " pl-4"}
                     value={reporter.phone}
                     required
                     onChange={(e) => handleReporter("phone", e.target.value)}
                     placeholder="Your phone" />
            </div>

            {/* Alt Phone */}
            <div>
              <label className={labelClass}>Alt Phone</label>
              <input className={inputBox + " pl-4"}
                     value={reporter.altPhone}
                     onChange={(e) => handleReporter("altPhone", e.target.value)} />
            </div>
          </div>

          {/* CHILD INFO */}
          <div className="grid sm:grid-cols-2 gap-4">

            <div>
              <label className={labelClass}>Child Name*</label>
              <input className={inputBox + " pl-4"} required
                     value={child.name}
                     onChange={(e) => handleChild("name", e.target.value)} />
            </div>

            <div>
              <label className={labelClass}>Age*</label>
              <input type="number" className={inputBox + " pl-4"} required
                     value={child.age}
                     onChange={(e) => handleChild("age", e.target.value)} />
            </div>

            <div>
              <label className={labelClass}>Skin Complexion*</label>
              <select className={inputBox} required
                      value={child.skin}
                      onChange={(e) => handleChild("skin", e.target.value)}>
                <option value="">Select</option>
                <option value="Pale">Pale</option>
                <option value="Fair">Fair</option>
                <option value="Medium">Medium</option>
                <option value="Dark">Dark</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>City*</label>
              <div className="relative">
                <span className="absolute left-3 top-3"><IconMapPin /></span>
                <input className={inputBox} required
                       placeholder="City"
                       value={child.city}
                       onChange={(e) => handleChild("city", e.target.value)} />
              </div>
            </div>

            {role === "volunteer" && (
              <div className="sm:col-span-2">
                <label className={labelClass}>Address Found*</label>
                <input className={inputBox + " pl-4"} required
                       placeholder="Exact place found"
                       value={child.address}
                       onChange={(e) => handleChild("address", e.target.value)} />
              </div>
            )}
          </div>

          {/* BIRTHMARKS */}
          <div>
            <label className={labelClass}>Birthmarks</label>

            {birthMarks.map((b, i) => (
              <div key={i} className="flex items-center mb-2">
                <input
                  className={inputBox + " pl-4"}
                  value={b}
                  placeholder="e.g. Mole on right cheek"
                  onChange={(e) => handleBirthmarkChange(i, e.target.value)}
                />
                {i > 0 && (
                  <button type="button" className="ml-3" onClick={() => handleRemoveBirthmark(i)}>
                    <IconX />
                  </button>
                )}
              </div>
            ))}

            <button type="button" className="text-cyan-600 flex items-center mt-2"
                    onClick={handleAddBirthmark}>
              <IconPlus /> Add Birthmark
            </button>
          </div>

          {/* IMAGE UPLOAD */}
          <div>
            <label className={labelClass}>Child Photo*</label>
            <div className="border-2 border-dashed p-6 rounded-xl text-center">
              <IconUpload className="mx-auto" />
              <input type="file" required accept="image/*" className="mt-4"
                     onChange={handlePhotoChange} />

              {preview && (
                <img src={preview} alt="preview"
                     className="mt-4 w-40 rounded-lg shadow" />
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-cyan-600 text-white font-semibold hover:bg-cyan-700"
          >
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        </form>
      </div>
    </section>
  );
}
