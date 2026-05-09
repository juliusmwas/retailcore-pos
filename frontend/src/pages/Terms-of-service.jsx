import React from "react";
import {
  ArrowLeft,
  Scale,
  Clock,
  AlertTriangle,
  CreditCard,
  ShieldAlert,
} from "lucide-react";

export default function TermsOfService() {
  const lastUpdated = "May 9, 2026";

  const terms = [
    {
      title: "Service Terms",
      icon: <Clock className="text-blue-600" size={24} />,
      content:
        "RetailCore is provided as a SaaS platform for retail management. We aim for 99.9% uptime for our multi-branch systems. Users are responsible for maintaining secure hardware (such as barcode scanners and compatible devices) to access the service.",
    },
    {
      title: "Subscription & Billing",
      icon: <CreditCard className="text-blue-600" size={24} />,
      content:
        "Fees are billed based on the selected tier (e.g., number of branches or users). For Kenyan clients, payments via M-Pesa or bank transfer must be completed by the invoice due date to ensure uninterrupted access to the POS backend.",
    },
    {
      title: "Acceptable Use",
      icon: <ShieldAlert className="text-blue-600" size={24} />,
      content:
        "Users must not use RetailCore for illegal trade or fraudulent transactions. You are responsible for all activity under your account, including the actions of your staff across different branch locations.",
    },
    {
      title: "Data & Intellectual Property",
      icon: <Scale className="text-blue-600" size={24} />,
      content:
        "While you own your retail and inventory data, RetailCore owns the software, code, and design architecture. Data exports are provided in standard formats (PostgreSQL/CSV) upon request or through the admin dashboard.",
    },
    {
      title: "Limitation of Liability",
      icon: <AlertTriangle className="text-blue-600" size={24} />,
      content:
        "RetailCore is not liable for indirect losses resulting from hardware failure, internet outages, or incorrect inventory entry by staff. We recommend regular dual-verification audits of your sales records.",
    },
  ];

  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans antialiased">
      {/* RESPONSIVE NAV */}
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
          Effective Date: {lastUpdated}
        </span>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pb-24">
        {/* HERO SECTION */}
        <header className="mb-12 md:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter mb-6">
            Terms of <span className="text-blue-600">Service.</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-500 leading-relaxed max-w-2xl">
            Please read these terms carefully before using the RetailCore
            platform. By accessing our POS system, you agree to these operating
            standards.
          </p>
        </header>

        {/* TERMS SECTIONS */}
        <div className="space-y-10 md:space-y-12">
          {terms.map((term, index) => (
            <section
              key={index}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 border-t border-slate-100 pt-10 md:pt-12"
            >
              <div className="flex flex-row md:flex-col items-center md:items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-2xl shrink-0">
                  {term.icon}
                </div>
                <h2 className="text-xl font-bold leading-tight">
                  {term.title}
                </h2>
              </div>
              <div className="md:col-span-2">
                <p className="text-slate-600 leading-relaxed text-base sm:text-lg">
                  {term.content}
                </p>
              </div>
            </section>
          ))}
        </div>

        {/* TERMINATION NOTICE */}
        <div className="mt-16 md:mt-24 p-6 sm:p-10 md:p-12 bg-slate-900 rounded-[1.5rem] sm:rounded-[2.5rem] text-white">
          <h3 className="text-xl sm:text-2xl font-bold mb-4">
            Account Termination
          </h3>
          <p className="text-slate-400 mb-8 text-sm sm:text-base max-w-xl">
            You may cancel your RetailCore subscription at any time. Upon
            termination, you will have 30 days to export your retail data before
            it is permanently removed from our production servers in compliance
            with our data retention policy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:support@retailcore.co.ke"
              className="bg-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all text-center"
            >
              Contact Support
            </a>
          </div>
        </div>
      </main>

      {/* COMPLIANCE FOOTER */}
      <footer className="max-w-4xl mx-auto px-6 py-8 md:py-12 border-t border-slate-100 text-center">
        <p className="text-xs sm:text-sm text-slate-400 font-medium">
          RetailCore is a product of RetailCore Technologies.{" "}
          <br className="sm:hidden" />
          Governed by the laws of the Republic of Kenya.
        </p>
      </footer>
    </div>
  );
}
