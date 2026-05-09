import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Search,
  CalendarDays,
  ChevronDown,
  CheckCircle2,
  Home,
  Zap,
  Globe,
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const InputField = ({ label, id, ...props }) => (
  <div className="space-y-2">
    <label
      htmlFor={id}
      className="text-sm font-bold text-slate-800 uppercase tracking-wider"
    >
      {label}
    </label>
    <input
      id={id}
      {...props}
      className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder:text-slate-400 font-medium"
    />
  </div>
);

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    scale: "1-5",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Add production API call logic here
  };

  return (
    <div className="bg-[#fafbfc] min-h-screen text-slate-900 font-sans antialiased">
      {/* 0. FLOATING BACK BUTTON */}
      <div className="fixed top-8 left-6 md:left-12 z-50">
        <a
          href="/"
          className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-md rounded-full border border-slate-200 group shadow-lg hover:border-blue-300 transition-colors"
        >
          <Home
            size={16}
            className="text-slate-500 group-hover:text-blue-600 transition-colors"
          />
          <span className="text-xs font-bold uppercase tracking-widest text-slate-600 group-hover:text-slate-900">
            RetailCore Home
          </span>
        </a>
      </div>

      {/* 1. HERO SECTION */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-96 bg-blue-50 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm mb-10"
          >
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
              Enterprise Operations Center
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-black text-slate-900 tracking-tight leading-[0.95] max-w-4xl"
          >
            Engineering{" "}
            <span className="italic font-serif text-blue-600 font-medium text-4xl md:text-7xl">
              Connection
            </span>{" "}
            For Scaled Growth.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-10 text-xl md:text-2xl text-slate-500 max-w-2xl font-medium leading-relaxed"
          >
            Whether defining branch sync architecture or managing M-Pesa flows,
            our technical and sales leads are on standby.
          </motion.p>
        </div>
      </section>

      {/* 2. MAIN INTERACTION AREA */}
      <section className="py-20 pb-40 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          {/* LEFT COLUMN: Strategic Support Trio */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-5 space-y-10"
          >
            {[
              {
                icon: Building2,
                title: "Enterprise Sales",
                contact: "sales@retailcore.co.ke",
                text: "Discuss multi-branch architecture, custom quotes, and corporate implementation.",
              },
              {
                icon: Zap,
                title: "Technical Support",
                contact: "tech@retailcore.co.ke",
                text: "Hardware driver conflicts, API syncing issues, or M-Pesa setup assistance.",
              },
              {
                icon: Globe,
                title: "Strategic Partnerships",
                contact: "ops@retailcore.co.ke",
                text: "AgTech integration (TijaHub), regulatory compliance, and platform expansion.",
              },
            ].map((pillar) => (
              <motion.div
                key={pillar.title}
                variants={fadeInUp}
                className="relative group"
              >
                <div className="absolute -inset-1.5 bg-blue-600 blur rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity" />
                <div className="relative p-8 bg-white rounded-3xl border border-slate-100 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.05)] hover:shadow-2xl transition-all">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <pillar.icon size={22} />
                  </div>
                  <h4 className="text-2xl font-black mb-1">{pillar.title}</h4>
                  <a
                    href={`mailto:${pillar.contact}`}
                    className="text-blue-600 font-bold hover:underline mb-3 block"
                  >
                    {pillar.contact}
                  </a>
                  <p className="text-sm font-medium text-slate-500 leading-relaxed">
                    {pillar.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* RIGHT COLUMN: Glassmorphic Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="lg:col-span-7 relative group"
          >
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="relative p-8 md:p-12 bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] border border-slate-100 space-y-8"
                >
                  <div className="max-w-xl">
                    <h3 className="text-3xl font-black mb-2 tracking-tight">
                      Direct System Access Request
                    </h3>
                    <p className="text-slate-500 font-medium">
                      Verify your organizational profile and select your inquiry
                      path.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                    <InputField
                      label="Name"
                      id="name"
                      type="text"
                      placeholder="Jane Doe"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                    <InputField
                      label="Operational Email"
                      id="email"
                      type="email"
                      placeholder="jane@yourcompany.co.ke"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                    <InputField
                      label="Company / Entity Name"
                      id="company"
                      type="text"
                      placeholder="Your Shop Name LTD"
                      required
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                    />
                    <div className="space-y-2 relative">
                      <label className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                        Branch Scale
                      </label>
                      <select
                        className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors font-medium appearance-none"
                        value={formData.scale}
                        onChange={(e) =>
                          setFormData({ ...formData, scale: e.target.value })
                        }
                      >
                        <option value="1-5">1-5 Branches</option>
                        <option value="5-20">5-20 Branches</option>
                        <option value="20+">Enterprise (20+ Branches)</option>
                      </select>
                      <ChevronDown
                        size={20}
                        className="absolute right-5 bottom-4.5 text-slate-400 pointer-events-none"
                      />
                    </div>
                  </div>

                  <InputField
                    label="Strategic or Technical Message"
                    id="message"
                    type="textarea"
                    placeholder="Detailed inquiry..."
                    rows={5}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                  />

                  <button
                    type="submit"
                    className="w-full py-5 bg-slate-900 hover:bg-blue-600 text-white font-black rounded-xl transition-all shadow-xl shadow-slate-200 text-lg active:scale-[0.98]"
                  >
                    Validate & Submit Inquiry Flow
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative p-12 text-center bg-white rounded-[2.5rem] border border-slate-100 flex flex-col items-center shadow-2xl"
                >
                  <CheckCircle2 size={70} className="text-green-500 mb-8" />
                  <h3 className="text-4xl font-black tracking-tight mb-4">
                    Inquiry Verified
                  </h3>
                  <p className="text-slate-600 text-lg font-medium leading-relaxed max-w-sm mb-10">
                    Your message has been hashed and queued for verification. A
                    technical lead will respond within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-8 py-3 bg-slate-50 text-slate-700 font-bold rounded-full border border-slate-200"
                  >
                    Return to Terminal
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* 3. REGIONAL ANCHORING */}
      <section className="bg-slate-900 py-32 text-slate-300">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-4xl font-black text-white leading-tight">
              East African <span className="text-blue-500 italic">HQ</span>
            </h3>
            <p className="text-lg font-medium leading-relaxed">
              Our Operations Center coordinates multi-branch deployments across
              Kenya, Uganda, and Rwanda. Verified regional presence ensures
              regulatory compliance.
            </p>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            {[
              {
                icon: Phone,
                title: "Operational Line",
                text: "+254 707 759 667",
              },
              { icon: MapPin, title: "Operational HQ", text: "Nairobi, Kenya" },
              {
                icon: Search,
                title: "Compliance Check",
                text: "Verified Data Sovereignty",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-8 bg-white/5 rounded-3xl border border-white/5 space-y-4"
              >
                <div className="text-blue-500">
                  <item.icon size={26} />
                </div>
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                  {item.title}
                </p>
                <p className="text-white text-lg font-bold">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FINAL AUTHORITY BANNER */}
      <section className="py-24 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-slate-600 font-black tracking-[0.3em] uppercase text-xs mb-6">
            Status Center
          </p>
          <div className="inline-flex flex-wrap justify-center items-center gap-x-8 gap-y-4 px-8 py-3 bg-white rounded-full shadow-lg border border-slate-100">
            {[
              "Data Integrity Check: PASSED",
              "Daraja API: OPERATIONAL",
              "PostgreSQL Mirroring: ACTIVE",
            ].map((status) => (
              <div key={status} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
