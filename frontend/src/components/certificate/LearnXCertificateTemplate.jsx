import React, { useRef, useState, useEffect } from "react";
import QRCode from "qrcode";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * LearnXCertificateTemplate Component
 * 
 * Accurately replicates the provided reference design:
 * - Premium Navy Blue, White, and Gold theme
 * - Sweeping curved wave borders (Navy & Gold ribbons)
 * - "CERTIFICATE OF ACHIEVEMENT" arched ribbon banner with gold stars
 * - LearnX Certified Gold Starburst Medallion Badge with Navy Ribbons
 * - Golden Laurel Wreath with Graduation Cap and Ribbon Scroll
 * - Dynamic Student Name in elegant cursive script typography
 * - Gold Gradient Pill for Course Name
 * - Skill Badges with Navy Checkmarks
 * - Metadata row: Completion Date, Certificate ID, Course Duration
 * - Live Scannable High-Res QR Code with Gold Border & "Scan to Verify This Certificate" badge
 * - "LEARN • PRACTICE • GROW • SUCCEED" core ethos tagline
 * - Official "Team LearnX" handwritten cursive signature and "Authorized Signatory"
 */
export const LearnXCertificateTemplate = ({ certificate, onDownloadComplete, onClose }) => {
  const certRef = useRef(null);
  const [qrSrc, setQrSrc] = useState(certificate?.qrCodeDataUrl || "");
  const [downloading, setDownloading] = useState(false);

  // Generate QR code client-side if not pre-rendered
  useEffect(() => {
    if (certificate?.qrCodeDataUrl) {
      setQrSrc(certificate.qrCodeDataUrl);
    } else if (certificate?.verificationToken || certificate?.certificateId) {
      const verifyUrl = `${window.location.origin}/verify/${certificate.verificationToken || certificate.certificateId}`;
      QRCode.toDataURL(verifyUrl, {
        errorCorrectionLevel: "H",
        margin: 1,
        width: 300,
        color: { dark: "#071739", light: "#ffffff" },
      })
        .then((url) => setQrSrc(url))
        .catch((err) => console.error("QR generation error:", err));
    }
  }, [certificate]);

  // Format date nicely (e.g., 01 Nov 2026)
  const formatDate = (dateString) => {
    if (!dateString) return "01 Nov 2026";
    const d = new Date(dateString);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // High-Resolution Landscape PDF Generation
  const handleDownloadPDF = async () => {
    if (!certRef.current) return;
    setDownloading(true);

    try {
      // High-DPI canvas capture (scale 3 for crystal clear print quality)
      const canvas = await html2canvas(certRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png", 1.0);

      // Landscape A4 dimensions in mm: 297 x 210
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      pdf.addImage(imgData, "PNG", 0, 0, 297, 210, undefined, "FAST");
      const filename = `LearnX_Certificate_${certificate?.certificateId || "LX-2026"}.pdf`;
      pdf.save(filename);

      if (onDownloadComplete) onDownloadComplete();
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF. Please try again or use the Print button.");
    } finally {
      setDownloading(false);
    }
  };

  // Browser Print handler
  const handlePrint = () => {
    window.print();
  };

  const skillsList = certificate?.skills?.length
    ? certificate.skills
    : ["HTML & CSS", "JavaScript", "Responsive Design", "Web Projects"];

  return (
    <div className="flex flex-col items-center">
      {/* Top Action Bar */}
      <div className="w-full max-w-[960px] flex items-center justify-between gap-3 mb-4 print:hidden px-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300">
            <span className="text-amber-500">★</span> LearnX Official Credential
          </span>
          <span className="text-xs text-slate-500 font-mono">
            ID: {certificate?.certificateId || "LX-2026-001"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 shadow-xs flex items-center gap-1.5 transition-all"
          >
            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print
          </button>

          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-700 via-indigo-700 to-navy-900 hover:from-blue-600 hover:to-indigo-800 shadow-md shadow-indigo-900/20 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {downloading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF
              </>
            )}
          </button>

          {/* Close button if inside a modal/preview with onClose handler */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              title="Close Certificate"
              aria-label="Close Certificate"
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-rose-100 hover:text-rose-600 text-slate-700 flex items-center justify-center font-bold text-lg transition-all ml-1 border border-slate-300"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── THE CERTIFICATE (Exact A4 Landscape Ratio 297:210, width 960px, height ~678px) ── */}
      <div className="w-full overflow-x-auto pb-4 flex justify-center">
        <div
          ref={certRef}
          id="learnx-certificate-canvas"
          className="relative bg-white text-slate-900 select-none shadow-2xl overflow-hidden font-sans border border-slate-200"
          style={{
            width: "960px",
            height: "678px",
            minWidth: "960px",
            minHeight: "678px",
            backgroundColor: "#ffffff",
          }}
        >
          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* ── BACKGROUND ORNAMENTAL GRAPHICS: WAVE CORNERS ── */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          
          {/* Top-Left Waves */}
          <svg
            className="absolute top-0 left-0 w-[300px] h-[300px] pointer-events-none"
            viewBox="0 0 300 300"
            fill="none"
          >
            {/* Dark Navy Outer Layer */}
            <path
              d="M0 0 L230 0 C160 50 70 120 40 230 L0 230 Z"
              fill="#061c47"
            />
            {/* Mid Royal Blue Layer */}
            <path
              d="M0 0 L190 0 C130 50 60 110 30 200 L0 200 Z"
              fill="#0d3b85"
            />
            {/* Radiant Azure Highlight */}
            <path
              d="M0 0 L150 0 C100 45 45 95 20 160 L0 160 Z"
              fill="#1e64cc"
            />
            {/* Gold Accent Ribbon Trim */}
            <path
              d="M230 0 C160 50 70 120 40 230 C45 235 52 225 60 210 C85 125 170 55 240 0 Z"
              fill="url(#goldGrad)"
            />
            <path
              d="M195 0 C135 50 65 110 35 200 C38 205 44 198 50 185 C75 115 145 55 205 0 Z"
              fill="#f7d070"
            />
            <defs>
              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#cf9932" />
                <stop offset="50%" stopColor="#ffd875" />
                <stop offset="100%" stopColor="#b38226" />
              </linearGradient>
            </defs>
          </svg>

          {/* Bottom-Right Waves */}
          <svg
            className="absolute bottom-0 right-0 w-[340px] h-[320px] pointer-events-none"
            viewBox="0 0 340 320"
            fill="none"
          >
            {/* Dark Navy Outer Layer */}
            <path
              d="M340 320 L90 320 C160 260 250 190 290 80 L340 80 Z"
              fill="#061c47"
            />
            {/* Mid Royal Blue Layer */}
            <path
              d="M340 320 L130 320 C190 265 265 200 305 120 L340 120 Z"
              fill="#0d3b85"
            />
            {/* Gold Ribbon Accent Trim */}
            <path
              d="M90 320 C160 260 250 190 290 80 C285 75 278 85 270 100 C240 185 155 255 80 320 Z"
              fill="url(#goldGrad2)"
            />
            <path
              d="M130 320 C190 265 265 200 305 120 C302 115 296 122 290 135 C265 205 195 265 120 320 Z"
              fill="#f7d070"
            />
            <defs>
              <linearGradient id="goldGrad2" x1="100%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#cf9932" />
                <stop offset="50%" stopColor="#ffd875" />
                <stop offset="100%" stopColor="#b38226" />
              </linearGradient>
            </defs>
          </svg>

          {/* Subtle Guilloche / Curved Security Lines along background */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.035] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="certGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 40 M 0 0 L 40 40" fill="none" stroke="#061c47" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#certGrid)" />
          </svg>

          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* ── TOP HEADER: LOGO & BRAND SLOGAN ── */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          <div className="relative z-10 pt-7 px-14 flex items-center justify-between">
            {/* LearnX Main Logo */}
            <div className="flex items-center gap-3">
              {/* Graphic Icon: Graduation Open Book + Star */}
              <div className="relative w-12 h-12 flex-shrink-0">
                <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-sm">
                  {/* Open Blue Book Pages */}
                  <path d="M8 20 C16 16 28 16 32 20 L32 54 C28 50 16 50 8 54 Z" fill="#1d68d8" />
                  <path d="M56 20 C48 16 36 16 32 20 L32 54 C36 50 48 50 56 54 Z" fill="#0c44a4" />
                  <path d="M12 24 C18 21 26 21 30 24 L30 50 C26 47 18 47 12 50 Z" fill="#3b82f6" />
                  <path d="M52 24 C46 21 38 21 34 24 L34 50 C38 47 46 47 52 50 Z" fill="#1e40af" />
                  {/* Scholar Figure & Star */}
                  <circle cx="32" cy="12" r="5" fill="#1d68d8" />
                  <path d="M26 20 C26 17 38 17 38 20 Z" fill="#1d68d8" />
                  <polygon points="39,7 41,12 46,12 42,15 44,20 39,17 35,20 37,15 33,12 38,12" fill="#f59e0b" />
                </svg>
              </div>

              {/* Text Typography */}
              <div className="flex flex-col">
                <div className="flex items-baseline">
                  <span className="text-3xl font-black tracking-tight text-[#0a2558] font-sans">
                    Learn
                  </span>
                  <span className="text-3xl font-black tracking-tight text-[#2563eb] font-sans">
                    X
                  </span>
                </div>
                <span className="text-[9.5px] font-bold text-slate-700 tracking-wider -mt-1 font-sans">
                  Learn. Practice. Grow. Succeed.
                </span>
              </div>
            </div>

            {/* Slogan Divider & Slogan */}
            <div className="flex items-center gap-4 pl-4 border-l border-slate-300">
              <div className="text-left font-serif italic text-slate-800">
                <p className="text-sm font-semibold tracking-wide text-slate-900 leading-tight">
                  One Platform.
                </p>
                <p className="text-sm font-bold text-slate-900 leading-tight">
                  Unlimited Possibilities.
                </p>
              </div>
            </div>

            {/* Spacer for Medallion */}
            <div className="w-24" />
          </div>

          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* ── TOP-RIGHT GOLD STARBURST MEDALLION BADGE ── */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          <div className="absolute top-4 right-10 z-20 flex flex-col items-center">
            {/* Hanging Navy Ribbons behind Medallion */}
            <div className="absolute top-16 flex gap-4 w-28 justify-center pointer-events-none">
              <svg width="40" height="70" viewBox="0 0 40 70">
                <polygon points="4,0 36,0 36,65 20,52 4,65" fill="#072054" />
                <polygon points="8,0 32,0 32,60 20,49 8,60" fill="#0e378c" />
              </svg>
              <svg width="40" height="70" viewBox="0 0 40 70">
                <polygon points="4,0 36,0 36,65 20,52 4,65" fill="#072054" />
                <polygon points="8,0 32,0 32,60 20,49 8,60" fill="#0e378c" />
              </svg>
            </div>

            {/* Gold Sunburst Medallion */}
            <div className="relative w-28 h-28 flex items-center justify-center drop-shadow-xl">
              {/* Outer Serrated Starburst */}
              <svg viewBox="0 0 120 120" className="w-full h-full">
                <circle cx="60" cy="60" r="56" fill="url(#goldMedalGrad)" stroke="#b8860b" strokeWidth="1" />
                {/* 36-point starburst teeth */}
                <path
                  d="M60 2 L64 12 L75 4 L76 15 L88 10 L86 21 L99 19 L94 29 L107 30 L99 39 L111 44 L101 51 L111 59 L99 64 L107 73 L94 74 L99 84 L86 82 L88 93 L76 88 L75 99 L64 91 L60 101 L56 91 L45 99 L44 88 L32 93 L34 82 L21 84 L26 74 L13 73 L21 64 L9 59 L19 51 L9 44 L21 39 L13 30 L26 29 L21 19 L34 21 L32 10 L44 15 L45 4 L56 12 Z"
                  fill="url(#goldTeethGrad)"
                />
                {/* Inner Gold Rim */}
                <circle cx="60" cy="60" r="46" fill="#061f52" stroke="url(#goldRimGrad)" strokeWidth="3" />
                <circle cx="60" cy="60" r="42" fill="none" stroke="#fcd34d" strokeWidth="1" strokeDasharray="3 2" />

                {/* Graduation Hat inside Medallion */}
                <path d="M60 30 L78 37 L60 44 L42 37 Z" fill="#fbbf24" />
                <polygon points="49,41 49,47 60,51 71,47 71,41 60,45" fill="#f59e0b" />
                <path d="M74 38 L74 48 L76 50 L78 48 L78 38" stroke="#fbbf24" strokeWidth="1.2" fill="none" />

                <defs>
                  <linearGradient id="goldMedalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffd875" />
                    <stop offset="50%" stopColor="#cf9932" />
                    <stop offset="100%" stopColor="#9a6e18" />
                  </linearGradient>
                  <linearGradient id="goldTeethGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fff1a8" />
                    <stop offset="40%" stopColor="#e5a93b" />
                    <stop offset="100%" stopColor="#8d620e" />
                  </linearGradient>
                  <linearGradient id="goldRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffe79a" />
                    <stop offset="50%" stopColor="#d4a036" />
                    <stop offset="100%" stopColor="#80560b" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Text inside badge */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pt-5">
                <span className="text-[10px] font-black tracking-wider text-amber-300 font-sans">
                  LEARNX
                </span>
                <span className="text-[7.5px] font-bold tracking-widest text-white uppercase font-sans -mt-0.5">
                  CERTIFIED
                </span>
              </div>
            </div>

            {/* Slogan beneath Medallion */}
            <div className="text-center mt-6 font-serif italic text-slate-800 leading-tight">
              <p className="text-[11px] font-medium text-slate-700">Your Learning</p>
              <p className="text-[11px] font-medium text-slate-700">Today...</p>
              <p className="text-xs font-bold text-slate-900 mt-0.5">A Better Tomorrow...</p>
            </div>
          </div>

          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* ── CENTRAL RIBBON BANNER: "CERTIFICATE OF ACHIEVEMENT" ── */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          <div className="relative mt-3 flex justify-center items-center">
            {/* Navy Blue Arch Ribbon with Gold Stars */}
            <div className="relative flex items-center justify-center">
              {/* Ribbon Body */}
              <div
                className="relative z-10 px-12 py-2 rounded-md shadow-lg flex items-center gap-3"
                style={{
                  background: "linear-gradient(180deg, #072257 0%, #031438 100%)",
                  boxShadow: "0 6px 14px rgba(3, 20, 56, 0.35)",
                  borderTop: "1.5px solid #eab308",
                  borderBottom: "1.5px solid #ca8a04",
                }}
              >
                <span className="text-amber-400 text-sm">★</span>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-[0.16em] uppercase font-serif drop-shadow-sm">
                  CERTIFICATE OF ACHIEVEMENT
                </h1>
                <span className="text-amber-400 text-sm">★</span>
              </div>

              {/* Left Ribbon Notch Tail */}
              <div
                className="absolute -left-5 top-1 z-0 w-8 h-8"
                style={{
                  background: "#020d26",
                  clipPath: "polygon(100% 0, 0 50%, 100% 100%, 70% 50%)",
                }}
              />
              {/* Right Ribbon Notch Tail */}
              <div
                className="absolute -right-5 top-1 z-0 w-8 h-8"
                style={{
                  background: "#020d26",
                  clipPath: "polygon(0 0, 100% 50%, 0 100%, 30% 50%)",
                }}
              />
            </div>
          </div>

          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* ── LEFT LAUREL WREATH & GRADUATION CAP EMBLEM ── */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          <div className="absolute left-8 top-52 w-28 h-28 pointer-events-none drop-shadow-md">
            <svg viewBox="0 0 120 120" className="w-full h-full">
              {/* Golden Laurel Wreath Leaves */}
              <g fill="#d99a26">
                {/* Left Branch */}
                <path d="M 30,70 C 20,50 25,30 40,20 C 37,25 35,35 40,45 C 33,48 30,55 35,65 Z" />
                <circle cx="28" cy="40" r="4" fill="#f59e0b" />
                <circle cx="34" cy="28" r="4" fill="#f59e0b" />
                <circle cx="25" cy="55" r="4.5" fill="#eab308" />
                <circle cx="35" cy="72" r="4" fill="#d97706" />

                {/* Right Branch */}
                <path d="M 90,70 C 100,50 95,30 80,20 C 83,25 85,35 80,45 C 87,48 90,55 85,65 Z" />
                <circle cx="92" cy="40" r="4" fill="#f59e0b" />
                <circle cx="86" cy="28" r="4" fill="#f59e0b" />
                <circle cx="95" cy="55" r="4.5" fill="#eab308" />
                <circle cx="85" cy="72" r="4" fill="#d97706" />
              </g>

              {/* Graduation Cap Center */}
              <path d="M60 38 L88 47 L60 56 L32 47 Z" fill="#072257" />
              <polygon points="42,52 42,60 60,65 78,60 78,52 60,57" fill="#0b317a" />
              <path d="M82 48 L82 60 L85 62 L87 60 L87 48" stroke="#f59e0b" strokeWidth="1.8" fill="none" />

              {/* Diploma Scroll Tied with Gold Ribbon */}
              <rect x="36" y="74" width="48" height="10" rx="3" fill="#fef3c7" stroke="#d97706" strokeWidth="1" />
              <rect x="56" y="72" width="8" height="14" rx="2" fill="#d97706" />
            </svg>
          </div>

          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* ── CERTIFICATE BODY TEXT ── */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          <div className="relative z-10 text-center mt-3 px-36">
            {/* "This is to certify that" */}
            <p className="text-sm font-serif italic text-slate-700 tracking-wide">
              This is to certify that
            </p>

            {/* Student Full Name in Elegant Cursive Script */}
            <div className="relative my-0.5">
              <h2
                className="text-4xl sm:text-5xl font-normal text-[#082359] tracking-normal py-1"
                style={{
                  fontFamily: "'Brush Script MT', 'Great Vibes', 'Allura', 'Dancing Script', cursive",
                }}
              >
                {certificate?.studentName || "Student Name"}
              </h2>

              {/* Decorative Gold Center Diamond Line */}
              <div className="relative flex items-center justify-center my-1">
                <div className="h-[1.5px] w-48 bg-gradient-to-r from-transparent via-[#d4a036] to-transparent" />
                <div className="w-2.5 h-2.5 rotate-45 bg-[#d4a036] border border-white shadow-2xs mx-1" />
                <div className="h-[1.5px] w-48 bg-gradient-to-r from-transparent via-[#d4a036] to-transparent" />
              </div>
            </div>

            {/* "has successfully completed the course" */}
            <p className="text-[13px] font-serif text-slate-800 tracking-wide mt-1">
              has successfully completed the course
            </p>

            {/* Course Title Pill Banner with Gold Gradient */}
            <div className="flex justify-center my-2">
              <div
                className="px-8 py-2 rounded-full shadow-sm max-w-[560px]"
                style={{
                  background: "linear-gradient(90deg, #fce59f 0%, #fad167 50%, #fce59f 100%)",
                  border: "1px solid #eab308",
                }}
              >
                <h3 className="text-base sm:text-lg font-extrabold text-[#08204d] font-sans tracking-wide truncate">
                  {certificate?.courseName || "Web Development – Beginner Level"}
                </h3>
              </div>
            </div>

            {/* "and acquired the following skills:" */}
            <p className="text-xs font-serif italic text-slate-700 mt-1">
              and acquired the following skills:
            </p>

            {/* 4 Skill Badges with Navy Checkmarks */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 mt-2">
              {skillsList.map((skill, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-300 shadow-2xs"
                >
                  <div className="w-3.5 h-3.5 rounded-full bg-[#082252] flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 font-sans">
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* ── METADATA BAR: COMPLETION DATE | CERTIFICATE ID | DURATION ── */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          <div className="relative z-10 mt-5 mx-28 flex items-center justify-center gap-10">
            {/* Completion Date */}
            <div className="flex items-center gap-2.5">
              <div className="text-slate-800">
                <svg className="w-6 h-6 text-[#08204d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans">
                  Completion Date
                </div>
                <div className="text-xs font-black text-slate-900 font-sans">
                  {formatDate(certificate?.completionDate || certificate?.issueDate)}
                </div>
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="h-7 w-[1px] bg-slate-300" />

            {/* Certificate ID */}
            <div className="flex items-center gap-2.5">
              <div className="text-[#08204d]">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l2.4 4.8 5.3.8-3.8 3.7.9 5.3-4.8-2.5-4.8 2.5.9-5.3-3.8-3.7 5.3-.8L12 2z" />
                  <path d="M8 17.5v4.5l4-2 4 2v-4.5" fill="#08204d" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans">
                  Certificate ID
                </div>
                <div className="text-xs font-black text-slate-900 font-mono tracking-wider">
                  {certificate?.certificateId || "LX-2026-001"}
                </div>
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="h-7 w-[1px] bg-slate-300" />

            {/* Course Duration */}
            <div className="flex items-center gap-2.5">
              <div className="text-[#08204d]">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans">
                  Course Duration
                </div>
                <div className="text-xs font-black text-slate-900 font-sans">
                  {certificate?.courseDuration || "40 Hours"}
                </div>
              </div>
            </div>
          </div>

          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* ── BOTTOM FOOTER: QR VERIFICATION CODE | SLOGAN | SIGNATURE ── */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          <div className="absolute bottom-5 left-10 right-14 z-20 flex items-end justify-between">
            {/* Left: Scannable QR Code + Gold Border Badge */}
            <div className="flex items-center gap-2.5 bg-white/95 p-1.5 rounded-xl border-2 border-[#d4a036] shadow-sm">
              {/* QR Image */}
              <div className="w-16 h-16 bg-white p-0.5 flex items-center justify-center">
                {qrSrc ? (
                  <img
                    src={qrSrc}
                    alt="Certificate QR Verification Code"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center text-[8px] text-slate-400 font-mono">
                    QR CODE
                  </div>
                )}
              </div>

              {/* Scan Badge Pill */}
              <div className="flex flex-col items-start pr-1.5">
                <div className="flex items-center gap-1 text-[#08204d]">
                  <span className="text-xs">🛡️</span>
                  <span className="text-[9.5px] font-black tracking-wider uppercase font-sans text-[#08204d]">
                    Scan to Verify
                  </span>
                </div>
                <span className="text-[8.5px] font-medium text-slate-600 font-sans">
                  This Certificate
                </span>
              </div>
            </div>

            {/* Center: "LEARN • PRACTICE • GROW • SUCCEED" */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-amber-500 text-xs">➤</span>
              <span className="text-[10.5px] font-black tracking-[0.2em] text-[#071f4c] uppercase font-sans">
                LEARN • PRACTICE • GROW • SUCCEED
              </span>
            </div>

            {/* Right: Authorized Signature */}
            <div className="flex flex-col items-center mb-1">
              {/* Handwritten signature */}
              <div
                className="text-2xl text-[#08204d] font-normal"
                style={{
                  fontFamily: "'Brush Script MT', 'Great Vibes', 'Allura', cursive",
                  transform: "rotate(-3deg)",
                }}
              >
                Team LearnX
              </div>
              <div className="w-36 h-[1.5px] bg-[#08204d] mt-1" />
              <div className="text-[10px] font-black text-slate-900 uppercase tracking-wider font-sans mt-0.5">
                Authorized Signatory
              </div>
              <div className="text-[9px] font-bold text-slate-500 tracking-wider font-sans -mt-0.5">
                LearnX
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnXCertificateTemplate;

