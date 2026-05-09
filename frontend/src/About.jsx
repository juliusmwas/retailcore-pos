import React from "react";
import {
  ShieldCheck,
  Zap,
  Database,
  ArrowLeft,
  ChevronRight,
  HardDrive,
  Users,
  Building2,
  CheckCircle2,
} from "lucide-react";

export default function About() {
  return (
    <div className="bg-[#05070A] text-white font-sans selection:bg-blue-500/30">
      {/* 1. NAVIGATION: Simple Back Button */}
      {/* 
          Responsive Notes: 
          - Mobile (sm): Fixed at top-left, smaller, lower z-index.
          - Desktop (md): absolute positioning, larger, higher z-index.
      */}
      <div className="absolute md:fixed top-4 left-4 md:top-8 md:left-12 z-[100] md:z-50">
        <a
          href="/"
          className="flex items-center gap-2 group text-slate-400 hover:text-white transition-all bg-white/5 md:bg-white/10 p-2 md:px-4 md:py-2 rounded-full border border-white/10 hover:border-blue-500/50"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="font-mono text-xs uppercase tracking-widest hidden md:block">
            Home
          </span>
        </a>
      </div>

      {/* 2. HERO: The Core Promise */}
      {/* 
          Responsive Notes: 
          - min-h-[90vh] ensures the section fills most of the screen height.
          - Text sizes scale (text-5xl, text-6xl, text-8xl).
          - Margins and padding scale (mb-4, mb-8, mb-16, py-24, py-32).
      */}
      <section className="relative min-h-[90vh] flex items-center pt-20 md:pt-24 pb-20 overflow-hidden bg-[#05070A]">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* LEFT COLUMN: Content */}
            <div className="max-w-4xl">
              {/* Brand Tagline */}
              <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                <span className="h-[1px] w-6 md:w-8 bg-blue-500"></span>
                <span className="text-blue-400 font-mono text-[10px] md:text-xs tracking-[0.2em] md:tracking-[0.3em] uppercase">
                  Next-Gen Inventory Control
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 md:mb-8 tracking-tighter leading-[0.95] md:leading-[0.9] text-white">
                Built for <span className="text-blue-500">Retail.</span>
                <br className="md:block" />
                Hardened for{" "}
                <span className="text-slate-500 italic font-serif">Kenya.</span>
              </h1>

              <p className="text-lg md:text-2xl text-slate-400 max-w-2xl leading-relaxed mb-12 md:mb-16">
                RetailCore is a multi-branch point-of-sale system engineered to
                solve the real-world complexities of inventory, privacy, and
                localized payments. We bridge the gap between high-end
                enterprise power and local market simplicity.
              </p>

              {/* REFINED SOCIAL PROOF & STATUS BAR */}
              <div className="flex flex-wrap gap-6 md:gap-8 items-center border-t border-white/5 pt-6 md:pt-8">
                <div className="flex items-center gap-3 md:gap-4">
                  {/* Avatar Stack */}
                  <div className="flex -space-x-3 overflow-hidden">
                    {[
                      {
                        alt: "Agrovet Partner",
                        src: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=100",
                      },
                      {
                        alt: "Boutique Owner",
                        src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100",
                      },
                      {
                        alt: "Electronics Retail",
                        src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100",
                      },
                    ].map((user, i) => (
                      <div
                        key={i}
                        className="relative inline-block w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[#05070A] bg-slate-800 transition-transform hover:translate-y-[-4px] hover:z-20"
                      >
                        <img
                          className="h-full w-full rounded-full object-cover grayscale hover:grayscale-0 transition-all"
                          src={user.src}
                          alt={user.alt}
                        />
                      </div>
                    ))}
                    <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[#05070A] bg-blue-600 text-[10px] md:text-[11px] font-bold tracking-tighter text-white z-10 shadow-lg">
                      +10
                    </div>
                  </div>

                  <div>
                    <p className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">
                      Active Installs
                    </p>
                    <p className="text-xs md:text-sm font-mono text-white tracking-tighter">
                      Central Region
                    </p>
                  </div>
                </div>

                <div className="hidden md:block h-10 w-[1px] bg-white/10"></div>

                {/* Live System Status */}
                <div className="flex items-center gap-2 md:gap-3 px-4 py-2 md:px-5 md:py-2.5 bg-blue-500/5 border border-blue-500/10 rounded-full">
                  <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </div>
                  <p className="text-[10px] md:text-xs font-mono text-blue-400 tracking-[0.1em] md:tracking-[0.2em] uppercase">
                    // Production Ready
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: The Visual Anchor (System Preview) */}
            <div className="hidden lg:flex relative justify-center items-center">
              {/* Decorative Background Glow for the Card */}
              <div className="absolute w-[500px] h-[500px] bg-blue-600/10 blur-[100px] rounded-full"></div>

              <div className="relative w-full max-w-md bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-8 shadow-2xl overflow-hidden group hover:border-blue-500/30 transition-colors duration-700">
                {/* Dashboard Header */}
                <div className="flex justify-between items-center mb-10">
                  <div>
                    <div className="h-1 w-8 bg-blue-500 mb-2 rounded-full"></div>
                    <h4 className="text-white font-bold text-xl tracking-tight">
                      Branch Node 04
                    </h4>
                    <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">
                      Nairobi CBD Terminal
                    </p>
                  </div>
                  <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-md">
                    <span className="text-[10px] font-bold text-green-500 uppercase">
                      Synced
                    </span>
                  </div>
                </div>

                {/* Activity Bars */}
                <div className="space-y-6">
                  {[
                    {
                      label: "Inventory Velocity",
                      val: "High",
                      width: "w-[85%]",
                      color: "bg-blue-500",
                    },
                    {
                      label: "M-Pesa API Latency",
                      val: "14ms",
                      width: "w-[92%]",
                      color: "bg-cyan-400",
                    },
                    {
                      label: "Database Health",
                      val: "99.9%",
                      width: "w-[99%]",
                      color: "bg-emerald-500",
                    },
                  ].map((metric, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          {metric.label}
                        </span>
                        <span className="text-xs font-mono text-white">
                          {metric.val}
                        </span>
                      </div>
                      <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${metric.color} ${metric.width} rounded-full`}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Terminal Footer Snippet */}
                <div className="mt-10 pt-6 border-t border-white/5 font-mono text-[10px] text-slate-500 space-y-1">
                  <p className="text-blue-500/60 font-bold">
                    &gt; Initializing local_sync.sh
                  </p>
                  <p>&gt; Encrypting branch_payload... DONE</p>
                  <p>
                    &gt; Status:{" "}
                    <span className="text-white">Active Operational</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ambient Background Elements */}
        <div className="absolute top-1/4 right-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-blue-600/5 blur-[100px] md:blur-[120px] rounded-full animate-pulse"></div>
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </section>

      {/* 3. PRIMARY ANCHOR: THE ARCHITECTURE OF TRUST */}
      {/* 
          Responsive Notes: 
          - Grid layout (grid-cols-1 on sm, grid-cols-2 on md, grid-cols-3 on lg).
          - Text sizes scale (text-4xl, text-6xl, text-5xl).
          - Margins and padding scale (mb-6, mb-20, py-24, py-32).
      */}
      <section className="py-24 md:py-32 bg-white text-slate-900 rounded-t-[2rem] md:rounded-t-[5rem]">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mb-16 md:mb-20 mx-auto md:mx-0">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 tracking-tighter leading-tight md:leading-tight">
              A system that <span className="text-blue-600">works</span> when
              others don't.
            </h2>
            <p className="text-base md:text-lg text-slate-600 leading-relaxed md:leading-relaxed">
              We understand that in the Kenyan market, software is only as good
              as its reliability. RetailCore is built on an **Offline-First**
              architecture ensuring your business never stops moving, even when
              the internet does.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
            {[
              {
                icon: <Database className="text-blue-600" />,
                title: "Industrial Data Integrity",
                desc: "Powered by a Node.js and PostgreSQL stack for enterprise-grade inventory management and zero-loss transactions.",
              },
              {
                icon: <ShieldCheck className="text-blue-600" />,
                title: "Privacy Sovereignty",
                desc: "Your data is your property. RetailCore utilizes local encryption so your business insights remain yours alone.",
              },
              {
                icon: <Zap className="text-blue-600" />,
                title: "M-Pesa Integration",
                desc: "Native STK push and transaction verification designed specifically for Kenyan retail workflows.",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="p-6 md:p-8 bg-slate-50 rounded-2xl md:rounded-3xl border border-slate-100 hover:shadow-xl hover:shadow-blue-500/10 transition-all flex flex-col h-full"
              >
                <div className="mb-4 md:mb-6 shrink-0">{card.icon}</div>
                <h4 className="text-lg md:text-xl font-bold mb-2 md:mb-3">
                  {card.title}
                </h4>
                <p className="text-sm md:text-base text-slate-500 leading-relaxed md:leading-relaxed flex-grow">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SECONDARY ANCHOR: THE FOUNDER & SYSTEM ORIGIN */}
      {/* 
          Responsive Notes: 
          - Grid layout (grid-cols-1 on sm, grid-cols-12 on lg).
          - Column spans adjust (col-span-full on sm, col-span-5 and col-span-7 on lg).
          - Image aspect ratio and positioning.
          - Text sizes scale (text-3xl, text-4xl, text-5xl).
          - Margins and padding scale (mb-6, mb-8, mb-10, mt-8, mt-10, py-24, py-32).
          - Grid cols-2 on sm for stats, gap adjust.
      */}
      <section className="py-24 md:py-32 bg-white text-slate-900 border-t border-slate-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
            <div className="col-span-full lg:col-span-5 relative group order-last lg:order-first">
              <div className="relative">
                {/* Main Image Container */}
                <div className="aspect-[3/4] md:aspect-[3/4] lg:aspect-[4/5] xl:aspect-[3/4] bg-slate-100 rounded-3xl md:rounded-[3rem] overflow-hidden shadow-2xl relative z-10 border-8 md:border-[12px] border-white">
                  <img
                    src="/profile.jpeg"
                    alt="Founder of RetailCore"
                    className="w-full h-full object-cover object-[center_20%] grayscale-[30%] hover:grayscale-0 transition-all duration-700"
                  />
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-6 md:-top-8 -left-6 md:-left-8 w-32 md:w-40 h-32 md:h-40 bg-blue-50 rounded-full -z-0 opacity-60"></div>
                <div className="absolute -bottom-3 md:-bottom-4 -right-3 md:-right-4 w-full h-full border-2 border-slate-100 rounded-[2.5rem] md:rounded-[3.5rem] -z-10 translate-x-3 md:translate-x-4 translate-y-3 md:translate-y-4"></div>

                {/* Badge */}
                <div className="absolute -bottom-4 md:-bottom-6 right-3 md:right-4 z-20 p-4 md:p-5 bg-slate-900 text-white rounded-xl md:rounded-2xl shadow-2xl transform group-hover:-translate-y-1 md:group-hover:-translate-y-2 transition-transform">
                  <p className="font-bold text-xs md:text-sm mb-0.5">
                    Lead Architect
                  </p>
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0"></div>
                    <p className="text-[9px] md:text-[10px] text-blue-400 font-mono tracking-widest uppercase">
                      Verified Deployment
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-full lg:col-span-7">
              <div className="flex items-center gap-2 text-blue-600 font-bold mb-4 md:mb-6 uppercase tracking-widest text-xs md:text-sm">
                <CheckCircle2 size={16} /> Professional Commitment
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 tracking-tight leading-tight md:leading-tight">
                "RetailCore was built to be the system I couldn't find for the{" "}
                <span className="text-blue-600">Kenyan market</span>."
              </h2>
              <div className="space-y-4 md:space-y-6 text-base md:text-lg text-slate-600 leading-relaxed md:leading-relaxed">
                <p>
                  As a **software developer**, I saw local businesses struggling
                  with generic software that ignored Kenyan realities like
                  privacy, M-Pesa flows, and multi-branch syncing. I didn't just
                  want to build another app; I wanted to build a
                  **production-ready standard** for our retailers.
                </p>
                <p>
                  Every line of code in RetailCore is written with a focus on
                  stability and security. My mission is to provide you with a
                  tool that handles the technical complexity so you can focus on
                  what matters: your customers.
                </p>
              </div>

              <div className="mt-8 md:mt-10 grid grid-cols-2 gap-6 md:gap-8 py-6 md:py-8 border-t border-slate-100 max-w-lg">
                <div className="flex items-start gap-3">
                  <Building2
                    className="text-slate-300 mt-0.5 shrink-0"
                    size={24}
                  />
                  <div>
                    <p className="font-bold text-xs md:text-sm uppercase text-slate-900 tracking-wider">
                      Scale
                    </p>
                    <p className="text-xs text-slate-500">Multi-Branch Ready</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <HardDrive
                    className="text-slate-300 mt-0.5 shrink-0"
                    size={24}
                  />
                  <div>
                    <p className="font-bold text-xs md:text-sm uppercase text-slate-900 tracking-wider">
                      Engine
                    </p>
                    <p className="text-xs text-slate-500">
                      PostgreSQL / Node.js
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINAL CALL TO ACTION */}
      {/* 
          Responsive Notes: 
          - Text sizes scale (text-5xl, text-7xl, text-5xl).
          - Margins and padding scale (mb-8, mb-12, py-24, py-32).
          - flex-col on sm, flex-row on md for buttons. gap adjust.
          - Buttons scale padding and gap.
      */}
      <section className="py-24 md:py-32 lg:py-40 bg-[#05070A] text-center relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 md:mb-8 tracking-tighter leading-tight md:leading-none">
              Modernize your <span className="text-blue-500">Inventory.</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-400 mb-10 md:mb-12 max-w-xl mx-auto leading-relaxed">
              Ready to upgrade to a system built specifically for the local
              market? Contact us to discuss your branch requirements.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 items-center">
              <a
                href="mailto:contact@retailcore.co.ke"
                className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-blue-600 text-white font-bold rounded-xl md:rounded-2xl hover:bg-blue-500 transition-all flex items-center justify-center gap-2 text-sm md:text-base shadow-xl shadow-blue-600/10"
              >
                Contact Architect <ChevronRight size={18} />
              </a>
              <a
                href="tel:+254"
                className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-white/5 text-white font-bold rounded-xl md:rounded-2xl border border-white/10 hover:bg-white/10 transition-all text-sm md:text-base flex items-center justify-center gap-2"
              >
                Call for Consultation
              </a>
            </div>
          </div>
        </div>

        {/* Subtle Background Elements */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-600/5 to-transparent"></div>
      </section>
    </div>
  );
}
