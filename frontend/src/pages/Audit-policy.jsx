import React from "react";
import {
  ArrowLeft,
  ClipboardList,
  History,
  Users,
  BarChart3,
  ShieldCheck,
} from "lucide-react";

export default function AuditPolicy() {
  const lastUpdated = "May 9, 2026";

  const sections = [
    {
      title: "Transactional Auditing",
      icon: <History className="text-blue-600" size={24} />,
      content:
        "Every transaction processed through RetailCore, including cash sales and M-Pesa integrations, is recorded with a unique cryptographic timestamp. We maintain a permanent trail of transaction reference codes to ensure financial reconciliation is seamless and tamper-proof.",
    },
    {
      title: "Inventory & Stock Tracking",
      icon: <ClipboardList className="text-blue-600" size={24} />,
      content:
        "RetailCore logs every adjustment to inventory levels across all branches. Whether it is a stock-in event, a sale, or a manual adjustment, the system records the 'who, when, and why' to prevent shrinkage and ensure privacy-first inventory management.",
    },
    {
      title: "User Activity Logs",
      icon: <Users className="text-blue-600" size={24} />,
      content:
        "To maintain system integrity, we audit all administrative actions. This includes login attempts verified via our dual-verification (Email + Phone OTP) protocol, changes to system configurations, and access to sensitive multi-branch reports.",
    },
    {
      title: "Data Integrity & Storage",
      icon: <ShieldCheck className="text-blue-600" size={24} />,
      content:
        "Audit logs are stored within our secure PostgreSQL architecture. These logs are protected by strict access controls and are designed to be immutable, providing a reliable 'source of truth' for Kenyan regulatory compliance and internal business reviews.",
    },
  ];

  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans antialiased">
      {/* NAVIGATION */}
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
        {/* HERO SECTION */}
        <header className="mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-6">
            <BarChart3 size={14} />
            <span>Transparency Report</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter mb-6">
            Audit <span className="text-blue-600">Policy.</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-500 leading-relaxed max-w-2xl">
            We provide a comprehensive trail of accountability for your retail
            operations. From the storefront to the back office, every action is
            accounted for.
          </p>
        </header>

        {/* AUDIT SECTIONS */}
        <div className="space-y-10 md:space-y-12">
          {sections.map((section, index) => (
            <section
              key={index}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 border-t border-slate-100 pt-10 md:pt-12"
            >
              <div className="flex flex-row md:flex-col items-center md:items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-2xl shrink-0">
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

        {/* COMPLIANCE FOOTER NOTE */}
        <div className="mt-16 md:mt-24 p-6 sm:p-10 md:p-12 bg-slate-900 rounded-[1.5rem] sm:rounded-[2.5rem] text-white">
          <div className="max-w-2xl">
            <h3 className="text-xl sm:text-2xl font-bold mb-4">
              Regulatory Compliance
            </h3>
            <p className="text-slate-400 mb-6 text-sm sm:text-base">
              RetailCore's auditing standards are built to support Kenyan
              business owners in meeting local financial reporting requirements
              and KEPHIS/PCPB traceability standards where applicable.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="px-4 py-2 bg-white/10 rounded-lg text-xs font-bold tracking-wide uppercase">
                M-Pesa Verified
              </div>
              <div className="px-4 py-2 bg-white/10 rounded-lg text-xs font-bold tracking-wide uppercase">
                PostgreSQL Secured
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-4xl mx-auto px-6 py-12 border-t border-slate-100 text-center">
        <p className="text-xs sm:text-sm text-slate-400 font-medium">
          © 2026 RetailCore Technologies. Accountability for Modern Retail.
        </p>
      </footer>
    </div>
  );
}
