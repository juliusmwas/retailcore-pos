import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Handle production logic
  };

  return (
    <div className="bg-blue-100 min-h-screen text-slate-900 font-sans antialiased">
      {/* HEADER / NAVIGATION */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <a href="/" className="flex items-center gap-2 group">
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="font-bold tracking-tight text-lg">RetailCore</span>
        </a>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* LEFT: CONTENT */}
          <div className="space-y-12">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1]">
                Let's scale your <br />
                <span className="text-blue-600">retail operations.</span>
              </h1>
              <p className="text-xl text-slate-500 max-w-md leading-relaxed">
                Our team is ready to help you with multi-branch architecture,
                M-Pesa integrations, and custom SaaS deployments.
              </p>
            </div>

            <div className="space-y-8 pt-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-blue-600 border border-slate-100">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-1">
                    Email us
                  </p>
                  <a
                    href="mailto:hello@retailcore.co.ke"
                    className="text-lg font-medium hover:text-blue-600 transition-colors"
                  >
                    hello@retailcore.co.ke
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-blue-600 border border-slate-100">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-1">
                    Call us
                  </p>
                  <p className="text-lg font-medium">+254 707 759 667</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-blue-600 border border-slate-100">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-1">
                    Visit us
                  </p>
                  <p className="text-lg font-medium">Nairobi, Kenya</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: FORM */}
          <div className="relative">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onSubmit={handleSubmit}
                  className="bg-slate-50 p-8 md:p-10 rounded-[2rem] border border-slate-100 space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                        Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        className="w-full px-5 py-4 rounded-xl bg-white border border-slate-200 focus:border-blue-500 focus:ring-0 transition-all outline-none"
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                        Work Email
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="john@company.com"
                        className="w-full px-5 py-4 rounded-xl bg-white border border-slate-200 focus:border-blue-500 focus:ring-0 transition-all outline-none"
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                      Company
                    </label>
                    <input
                      type="text"
                      placeholder="Your Enterprise Name"
                      className="w-full px-5 py-4 rounded-xl bg-white border border-slate-200 focus:border-blue-500 focus:ring-0 transition-all outline-none"
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      placeholder="How can we help?"
                      className="w-full px-5 py-4 rounded-xl bg-white border border-slate-200 focus:border-blue-500 focus:ring-0 transition-all outline-none resize-none"
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 group"
                  >
                    Send Message
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-blue-600 p-12 rounded-[2rem] text-white text-center flex flex-col items-center justify-center min-h-[500px]"
                >
                  <CheckCircle2 size={60} className="mb-6 text-blue-200" />
                  <h3 className="text-3xl font-bold mb-2">Message Sent</h3>
                  <p className="text-blue-100 mb-8 max-w-xs">
                    Thanks for reaching out. A specialist will be in touch
                    within one business day.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-sm font-bold uppercase tracking-widest bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full transition-colors"
                  >
                    Send another
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* SUBTLE FOOTER */}
      <footer className="border-t border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-sm">
            © 2026 RetailCore Technologies. All rights reserved.
          </p>
          <div className="flex gap-8">
            {["System Status", "Privacy", "Terms"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
