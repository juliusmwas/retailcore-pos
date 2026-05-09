import React from "react";
import { ArrowLeft, ShieldCheck, Lock, Eye, Database } from "lucide-react";

export default function PrivacyPolicy() {
  const lastUpdated = "May 9, 2026";

  const sections = [
    {
      title: "Information We Collect",
      icon: <Database className="text-blue-600" size={24} />,
      content:
        "We collect information necessary to provide retail services, including business names, branch locations, inventory data, and transaction records. For integrated payments like M-Pesa, we process transaction reference codes to verify payments.",
    },
    {
      title: "How We Use Your Data",
      icon: <Eye className="text-blue-600" size={24} />,
      content:
        "Your data is used to maintain your retail operations, generate analytics for your branches, and ensure the security of your POS environment. We do not sell your business data to third-party advertisers.",
    },
    {
      title: "Data Security",
      icon: <Lock className="text-blue-600" size={24} />,
      content:
        "RetailCore employs enterprise-grade encryption and secure PostgreSQL storage. We implement dual-verification protocols, including OTP (One-Time Password) for both email and phone, to ensure only authorized personnel access your system.",
    },
    {
      title: "Your Rights & Compliance",
      icon: <ShieldCheck className="text-blue-600" size={24} />,
      content:
        "In accordance with the Kenya Data Protection Act, you have the right to access, rectify, or request the deletion of your business data. We maintain strict compliance with local regulatory standards for data sovereignty.",
    },
  ];

  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans antialiased">
      {/* HEADER - Responsive padding and flex behavior */}
      <nav className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <a
          href="/"
          className="flex items-center gap-2 group text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="font-bold tracking-tight">Back to Home</span>
        </a>
        <span className="text-xs sm:text-sm font-medium text-slate-400">
          Last Updated: {lastUpdated}
        </span>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pb-24">
        {/* HERO SECTION - Dynamic text sizing */}
        <header className="mb-12 md:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter mb-6">
            Privacy <span className="text-blue-600">Policy.</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-500 leading-relaxed max-w-2xl">
            At RetailCore, we treat your business data with the same precision
            as your inventory. Learn how we protect your information in a
            multi-branch retail environment.
          </p>
        </header>

        {/* POLICY SECTIONS - Optimized Grid */}
        <div className="space-y-10 md:space-y-12">
          {sections.map((section, index) => (
            <section
              key={index}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 border-t border-slate-100 pt-10 md:pt-12"
            >
              <div className="flex flex-row md:flex-col items-center md:items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-2xl shrink-0">
                  {/* Icon size remains constant for visual balance */}
                  {section.icon}
                </div>
                <h2 className="text-xl font-bold leading-tight">
                  {section.title}
                </h2>
              </div>
              <div className="md:col-span-2">
                <p className="text-slate-600 leading-relaxed text-base sm:text-lg">
                  {section.content}
                </p>
              </div>
            </section>
          ))}
        </div>

        {/* CONTACT CALLOUT - Responsive border-radius and padding */}
        <div className="mt-16 md:mt-24 p-6 sm:p-10 md:p-12 bg-slate-50 rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-100 text-center">
          <h3 className="text-xl sm:text-2xl font-bold mb-4">
            Questions about your data?
          </h3>
          <p className="text-slate-500 mb-8 text-sm sm:text-base max-w-md mx-auto">
            Our data protection officer is available to discuss our security
            protocols or compliance details.
          </p>
          <a
            href="mailto:privacy@retailcore.co.ke"
            className="inline-block w-full sm:w-auto bg-white border border-slate-200 px-8 py-4 rounded-xl font-bold hover:border-blue-500 hover:text-blue-600 transition-all text-center"
          >
            Contact Privacy Team
          </a>
        </div>
      </main>

      {/* FOOTER - Center-aligned for mobile, elegant spacing */}
      <footer className="max-w-4xl mx-auto px-6 py-8 md:py-12 border-t border-slate-100 text-center">
        <p className="text-xs sm:text-sm text-slate-400 font-medium">
          © 2026 RetailCore Technologies. Built for Kenyan Retailers.
        </p>
      </footer>
    </div>
  );
}
