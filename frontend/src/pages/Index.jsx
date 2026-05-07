//import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { Menu, X, Settings, Zap, TrendingUp, Plus, Minus } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      id: "01",
      title: "Connect & Configure",
      desc: "Build your centralized business foundation in minutes. Onboard multiple branches and register your products once in a global catalog for instant distribution.",
      icon: <Settings className="w-6 h-6 text-blue-600" />,
      image: "/step1-mockup.png", // Ensure these are in your /public folder
      accent: "from-blue-500/20 to-transparent",
    },
    {
      id: "02",
      title: "Sell & Serve",
      desc: "Turn any device into a high-speed checkout terminal with instant camera-based barcode scanning. Process M-Pesa, Cash, or Card payments seamlessly.",
      icon: <Zap className="w-6 h-6 text-blue-600" />,
      image: "/step2-mockup.png",
      accent: "from-blue-600/20 to-transparent",
    },
    {
      id: "03",
      title: "Manage & Scale",
      desc: "Monitor entire business performance in real-time through a centralized analytics dashboard. Effortlessly track stock transfers and maintain total transparency.",
      icon: <TrendingUp className="w-6 h-6 text-blue-600" />,
      image: "/step3-mockup.png",
      accent: "from-blue-700/20 to-transparent",
    },
  ];

  return (
    <section className="py-24 bg-blue-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20 md:mb-32">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">
            How It Works
          </h2>
          <p className="mt-6 text-slate-600 font-medium max-w-2xl mx-auto text-lg leading-relaxed">
            From setup to scale get your business running on autopilot with our
            streamlined onboarding process.
          </p>
        </div>

        <div className="space-y-24 md:space-y-40">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-12 md:gap-24`}
            >
              {/* Text Side */}
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white shadow-md flex items-center justify-center border border-slate-100">
                    {step.icon}
                  </div>
                  <span className="text-blue-600 font-bold tracking-widest text-sm uppercase">
                    Step {step.id}
                  </span>
                </div>

                <h3 className="text-2xl md:text-4xl font-bold text-slate-900 tracking-tight">
                  {step.title}
                </h3>

                <p className="text-slate-600 text-lg leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {/* Image Side */}
              <div className="flex-1 relative w-full group">
                <div
                  className={`absolute -inset-4 bg-gradient-to-br ${step.accent} blur-2xl rounded-full opacity-50 group-hover:opacity-80 transition-opacity duration-500`}
                />

                <div className="relative rounded-3xl border border-white/40 bg-white/40 p-2 md:p-3 shadow-2xl backdrop-blur-sm transform group-hover:scale-[1.02] transition-transform duration-500">
                  <div className="overflow-hidden rounded-2xl bg-slate-100 border border-slate-200 aspect-video flex items-center justify-center">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/600x400?text=Dashboard+Mockup";
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question:
        "How does RetailCore ensure service continuity during internet outages?",
      answer:
        "Our offline-first engine allows you to process transactions and scan barcodes without a connection. Once your network is restored, the system automatically synchronizes all data to the cloud in the background.",
    },
    {
      question:
        "Is it possible to manage multiple branches from a single login?",
      answer:
        "Yes. You can manage your entire network—from main to regional branches—through a unified dashboard. Effortlessly track branch-specific inventory, monitor staff activities, and view consolidated sales reports.",
    },
    {
      question: "What are the hardware requirements for barcode scanning?",
      answer:
        "RetailCore is designed for hardware flexibility. You can utilize the built-in camera of any smartphone, tablet, or laptop to scan barcodes instantly, eliminating the need for expensive external peripherals.",
    },
    {
      question: "How is M-Pesa integration handled within the system?",
      answer:
        "We offer native support for mobile payments. Cashiers can trigger real-time M-Pesa push prompts directly from the checkout interface, ensuring a seamless and verifiable payment flow for every customer.",
    },
    {
      question: "How does the system protect sensitive business data?",
      answer:
        "Security is built-in via Role-Based Access Control (RBAC). Owners can define granular permissions for Managers and Cashiers, ensuring staff only access the data necessary for their specific roles while maintaining a full audit log of all actions.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-white px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-500 font-medium text-lg">
            Find quick answers to common queries
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`border rounded-2xl transition-all duration-300 ${
                openIndex === index
                  ? "border-blue-200 bg-blue-50/30"
                  : "border-slate-100 bg-slate-50/50 hover:border-slate-200"
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <span
                  className={`text-lg font-bold pr-8 ${openIndex === index ? "text-blue-600" : "text-slate-800"}`}
                >
                  {faq.question}
                </span>
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${openIndex === index ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"}`}
                >
                  {openIndex === index ? (
                    <Minus size={18} />
                  ) : (
                    <Plus size={18} />
                  )}
                </div>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-6 pt-0 text-slate-600 leading-relaxed font-medium border-t border-blue-100/50 mt-2">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

function Index() {
  //const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className=" w-full shadow-sm bg-blue-100">
      <nav className="bg-blue-100 border-b border-gray-100 w-full sticky top-0 z-50">
        <div className="flex justify-between items-center py-4 px-6 md:px-8 max-w-7xl mx-auto">
          {/* Logo Section */}
          <div className="flex items-center">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              Retail<span className="text-blue-600">Core</span>
              <span className="ml-1 text-xs font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded uppercase tracking-widest">
                POS
              </span>
            </span>
          </div>

          {/* Desktop Nav Links - Hidden on Mobile */}
          <ul className="hidden md:flex gap-10 items-center list-none font-medium text-gray-600 text-[15px]">
            <li className="hover:text-blue-600 cursor-pointer transition-colors">
              Features
            </li>
            <li className="hover:text-blue-600 cursor-pointer transition-colors">
              About Us
            </li>
            <li className="hover:text-blue-600 cursor-pointer transition-colors">
              How it Works
            </li>
            <li className="hover:text-blue-600 cursor-pointer transition-colors">
              Contact Us
            </li>
          </ul>

          {/* Desktop Buttons - Hidden on Mobile */}
          <div className="hidden md:flex gap-3 items-center">
            <button className="text-sm text-gray-700 font-semibold px-4 py-2 cursor-pointer hover:text-blue-600 hover:bg-blue-200 transition-colors rounded-lg">
              Login
            </button>
            <button className="text-sm bg-blue-600 px-5 py-2.5 rounded-lg text-white font-semibold hover:bg-blue-700 transition-all shadow-sm hover:shadow-md active:scale-95">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button - Visible only on small screens */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 cursor-pointer focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isOpen && (
          <div className="md:hidden bg-white absolute top-full left-0 w-full border-b border-gray-200 shadow-xl animate-in slide-in-from-top duration-300">
            <ul className="flex flex-col p-6 gap-4 list-none font-medium text-gray-700">
              <li className="py-2 border-b border-gray-50 hover:text-blue-600 cursor-pointer hover:bg-blue-100 transition-colors">
                Features
              </li>
              <li className="py-2 border-b border-gray-50 hover:text-blue-600 cursor-pointer hover:bg-blue-100 transition-colors">
                About Us
              </li>
              <li className="py-2 border-b border-gray-50 hover:text-blue-600 cursor-pointer hover:bg-blue-100 transition-colors">
                How it Works
              </li>
              <li className="py-2 border-b border-gray-50 hover:text-blue-600 cursor-pointer hover:bg-blue-100 transition-colors">
                Contact Us
              </li>

              <div className="flex flex-col gap-3 mt-4">
                <button className="w-full text-center text-sm text-gray-700 font-semibold py-3 border border-gray-200 rounded-lg cursor-pointer hover:text-blue-600 hover:bg-blue-100 transition-colors">
                  Login
                </button>
                <button className="w-full text-center text-sm bg-blue-600 py-3 rounded-lg text-white font-semibold shadow-sm cursor-pointer hover:bg-blue-700 transition-all active:scale-95">
                  Get Started
                </button>
              </div>
            </ul>
          </div>
        )}
      </nav>
      <section className="relative w-full overflow-hidden bg-[#eef5ff]">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#f3f8ff] via-[#e2eeff] to-[#c7e0ff] opacity-80 pointer-events-none" />

        {/* Content Container - Increased pt-20 for mobile to separate from navbar */}
        <div className="relative max-w-7xl mx-auto px-6 pt-20 md:pt-28 flex flex-col items-center text-center z-10">
          {/* Heading: Added leading-relaxed for better readability on small screens */}
          <h1 className="max-w-4xl text-2xl sm:text-4xl md:text-6xl font-bold text-slate-800 tracking-tight leading-[1.3] md:leading-[1.15]">
            Simplify Sales, Inventory &amp; Payment Effortlessly
          </h1>

          {/* Subtext: Increased mt-8 to create a clear gap from the heading */}
          <p className="mt-8 md:mt-6 max-w-xl text-base md:text-lg text-slate-600 font-medium leading-relaxed px-2">
            Everything you need to run your store smoothly{" "}
            <br className="hidden sm:inline" />
            All in one smart platform.
          </p>

          {/* CTA Button: Increased mt-10 to make the action stand out */}
          <div className="mt-10 md:mt-8 w-full sm:w-auto px-10">
            <button className="w-full sm:w-auto bg-[#0b65f7] hover:bg-[#0952cb] text-white font-semibold px-8 py-4 rounded-xl shadow-md hover:shadow-lg cursor-pointer transition-all active:scale-95 text-lg">
              Get Started
            </button>
          </div>

          {/* Dashboard Image Container - Increased mt-20 to prevent it from hugging the button */}
          <div className="relative mt-20 md:mt-16 w-full max-w-6xl mx-auto px-2 sm:px-4 mb-10">
            <div className="relative rounded-2xl border border-white/20 bg-white/10 p-2 md:p-3 shadow-2xl backdrop-blur-md">
              {/* The Mockup Wrapper */}
              <div className="overflow-hidden rounded-xl bg-slate-50 border border-slate-200 shadow-inner">
                <img
                  src="/dashboard-mockup.png"
                  alt="RetailCore POS Admin Dashboard"
                  className="w-full h-auto block object-contain shadow-2xl"
                  loading="eager"
                />
              </div>

              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-10 -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Trustee section */}
      <section className="relative w-full overflow-hidden bg-blue-100 py-16 md:py-24">
        <p className="text-slate-600 font-medium px-6 text-center text-lg md:text-xl max-w-3xl mx-auto">
          Trusted by over 20+ businesses around the World
        </p>

        {/* Container: 
      - flex-wrap: lets logos drop to the next line on small screens.
      - gap-8 md:gap-16: gives breathing room that tightens on mobile.
  */}
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 mt-12 md:mt-16 px-6 max-w-6xl mx-auto">
          {/* Individual Trustee Item */}
          <div className="group flex items-center justify-center grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer">
            <p className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tighter">
              FedEx
            </p>
          </div>

          <div className="group flex items-center justify-center grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer">
            <p className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tighter">
              Carrefour
            </p>
          </div>

          <div className="group flex items-center justify-center grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer">
            <p className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tighter">
              Jumia
            </p>
          </div>

          <div className="group flex items-center justify-center grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer">
            <p className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tighter">
              Shopify
            </p>
          </div>

          <div className="group flex items-center justify-center grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer">
            <p className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tighter italic">
              amazon
            </p>
          </div>

          <div className="group flex items-center justify-center grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer">
            <p className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tighter">
              mastercard
            </p>
          </div>

          <div className="group flex items-center justify-center grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer">
            <p className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tighter italic text-blue-900">
              Walmart<span className="text-orange-400 font-bold">*</span>
            </p>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-24 md:py-32 bg-blue-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
              Unlock Premium Benefit With <br className="hidden md:block" />
              Our <span className="text-blue-600">Advanced Features.</span>
            </h2>
          </div>

          {/* Features Grid: Auto-responsive 1 col on mobile, 2 on tablet, 3 on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Cards Mapping */}
            {[
              {
                id: "01",
                title: "Staff Accountability",
                desc: "You control exactly what your staff can see and do.",
              },
              {
                id: "02",
                title: "Smart Inventory",
                desc: "Track every item across all your shops in real-time.",
              },
              {
                id: "03",
                title: "Flexible-Payments",
                desc: "Get paid faster with integrated mobile and card payments.",
              },
              {
                id: "04",
                title: "Quick Insights",
                desc: "Optimize your strategy by seeing your best products and high-performing staff.",
              },
              {
                id: "05",
                title: "Total Audit",
                desc: "Full Accountability. Every single price change or refund is logged forever.",
              },
              {
                id: "06",
                title: "Resilient Connectivity",
                desc: "Sell without internet; auto-syncs when online.",
              },
            ].map((feature) => (
              <div
                key={feature.id}
                className="group relative bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                {/* Animated Number Badge */}
                <div className="mb-8 w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                  {feature.id}
                </div>

                {/* Text Content */}
                <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-slate-500 leading-relaxed font-medium">
                  {feature.desc}
                </p>

                {/* Subtle Background Glow on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity -z-10" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <HowItWorks />

      <section className="py-20 md:py-32 bg-white px-6">
        <div className="max-w-6xl mx-auto">
          {/* Main Banner Container */}
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-t from-[#053ea3] via-[#0b65f7] to-[#0b65f7] px-8 py-16 md:py-24 text-center shadow-2xl">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

            {/* Content */}
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                Upgrade Your Business With Our{" "}
                <br className="hidden md:block" /> Cutting-Edge POS Solutions!
              </h2>

              <p className="mt-6 text-blue-100 text-lg md:text-xl font-medium leading-relaxed">
                Experience the future of transactions! Start today and witness
                how our POS solution can revolutionize your business.
              </p>

              <div className="mt-10">
                <button className="w-full sm:w-auto bg-white text-blue-500 hover:bg-blue-50 cursor-pointer font-bold px-10 py-4 rounded-xl shadow-lg transition-all active:scale-95 text-lg">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FAQ />

      <footer className="bg-[#1a232e] text-slate-300 pt-20 pb-10 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Top Section: Newsletter & Links */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
            {/* Logo & Newsletter Column */}
            <div className="lg:col-span-4 space-y-8">
              <div className="text-2xl font-bold text-white tracking-tighter">
                RETAIL<span className="text-blue-500 uppercase">core pos</span>
              </div>

              <div className="space-y-4">
                <h4 className="text-white font-semibold text-lg">
                  Subscribe to Our Newsletter
                </h4>
                <div className="flex max-w-sm bg-slate-100 rounded-2xl p-1.5 shadow-inner">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="bg-transparent border-none focus:ring-0 px-4 py-2 w-full text-slate-900 placeholder:text-slate-500"
                  />
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-xl transition-all shadow-md active:scale-95">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Links Columns */}
            <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
              {/* Quick Links */}
              <div>
                <h4 className="text-white font-bold mb-6 underline decoration-blue-500/30 underline-offset-8">
                  Quick Links
                </h4>
                <ul className="space-y-4 text-sm font-medium">
                  <li>
                    <a
                      href="#"
                      className="hover:text-blue-400 transition-colors"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-blue-400 transition-colors"
                    >
                      How it Works
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-blue-400 transition-colors"
                    >
                      FAQs
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-blue-400 transition-colors"
                    >
                      About Us
                    </a>
                  </li>
                </ul>
              </div>

              {/* Legal & Privacy */}
              <div>
                <h4 className="text-white font-bold mb-6 underline decoration-blue-500/30 underline-offset-8">
                  Legal & Privacy
                </h4>
                <ul className="space-y-4 text-sm font-medium">
                  <li>
                    <a
                      href="#"
                      className="hover:text-blue-400 transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-blue-400 transition-colors"
                    >
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-blue-400 transition-colors"
                    >
                      Audit Policy
                    </a>
                  </li>
                </ul>
              </div>

              {/* Contact & Support */}
              <div className="col-span-2 md:col-span-1">
                <h4 className="text-white font-bold mb-6 underline decoration-blue-500/30 underline-offset-8">
                  Contact & Support
                </h4>
                <ul className="space-y-4 text-sm font-medium">
                  <li className="flex items-center gap-3">
                    <span className="opacity-70 text-base">📧</span>
                    <a
                      href="mailto:hello@retailcore.co.ke"
                      className="hover:text-blue-400 truncate"
                    >
                      hello@retailcore.co.ke
                    </a>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="opacity-70 text-base">📞</span>
                    <span className="whitespace-nowrap">
                      +254 (0) XXX XXX XXX
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="opacity-70 text-base">📍</span>
                    <span>HQ: Nairobi, Kenya</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Centered Bottom Copyright Bar */}
          <div className="pt-10 border-t border-slate-700/50 flex justify-center items-center text-xs font-bold text-slate-500 uppercase tracking-widest text-center w-full">
            <p>© 2026 RetailCore POS. Built for the future of retail.</p>
          </div>
        </div>
      </footer>
    </div>

    /*<div className="min-h-screen flex items-center justify-center bg-gray-100 overflow-hidden">
      <div className="flex flex-col items-center animate-in fade-in duration-1000">
        <img src="/public/lg.png" alt="Logo" className="w-96 h-auto block" />
        <button
          onClick={() => navigate("/login")}
          className="mt-15 px-6 py-3 bg-blue-600 font-semibold cursor-pointer text-white rounded-lg text-lg hover:bg-blue-700  transition-all shadow-lg "
        >
          Login
        </button>
      </div>
    </div>*/
  );
}

export default Index;
