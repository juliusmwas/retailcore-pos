//import { useNavigate } from "react-router-dom";

function Index() {
  //const navigate = useNavigate();

  return (
    <div className=" w-full shadow-sm bg-blue-100">
      <div className="bg-blue-100 border-b border-gray-100 w-full">
        <div className="flex justify-between items-center py-4 px-8 max-w-7xl mx-auto">
          {/* Logo - Text Based with specific brand colors */}
          <div className="flex items-center">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              Retail<span className="text-blue-600">Core</span>
              <span className="ml-1 text-xs font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded uppercase tracking-widest">
                POS
              </span>
            </span>
          </div>

          {/* Nav-links - Subtle and clean */}
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

          {/* Nav-btn - Primary & Secondary Action */}
          <div className="flex gap-3 items-center">
            <button className="text-sm text-gray-700 font-semibold px-4 py-2 hover:text-blue-600 transition-colors border-white">
              Login
            </button>
            <button className="text-sm bg-blue-600 px-5 py-2.5 rounded-lg text-white font-semibold hover:bg-blue-700 transition-all shadow-sm hover:shadow-md active:scale-95">
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section*/}

      <section className="relative w-full overflow-hidden bg-[#eef5ff]">
        {/* This is the radial background overlay. 
        It fades from a soft blue-white in the center to a richer blue at the bottom corners.
      */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#f3f8ff] via-[#e2eeff] to-[#c7e0ff] opacity-80 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 pt-20 md:pt-28 flex flex-col items-center text-center z-10">
          {/* Main Heading */}
          <h1 className="max-w-4xl text-4xl md:text-6xl font-bold text-slate-800 tracking-tight leading-tight md:leading-[1.15]">
            Simplify Sales, Inventory &amp; Payment Effortlessly
          </h1>

          {/* Subtext */}
          <p className="mt-6 max-w-xl text-base md:text-lg text-slate-600 font-medium leading-relaxed">
            Everything you need to run your store smoothly{" "}
            <br className="hidden sm:inline" />
            All in one smart platform.
          </p>

          {/* CTA Button */}
          <div className="mt-8">
            <button className="bg-[#0b65f7] hover:bg-[#0952cb] active:scale-95 text-white font-semibold px-8 py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
              Get Started
            </button>
          </div>

          {/* Dashboard Image Container
          Features a slight 3D perspective effect, smooth shadows, and rounded corners 
          to make the dashboard mockup pop.
        */}
          <div className="relative mt-16 w-full max-w-5xl rounded-t-2xl border border-white/40 bg-white/40 p-2 shadow-[0_-10px_50px_-12px_rgba(11,101,247,0.15)] backdrop-blur-sm">
            <div className="overflow-hidden rounded-t-xl bg-white border border-slate-200 shadow-sm aspect-[16/11]">
              <img
                src="/images/dashboard-mockup.png" // Replace with your actual dashboard image path
                alt="RetailCore POS Admin Dashboard"
                className="w-full h-full object-cover object-top"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
    /*<div className="min-h-screen flex items-center justify-center bg-gray-100 overflow-hidden">
      <div className="flex flex-col items-center animate-in fade-in duration-1000">
        <img 
          src="/public/lg.png" 
          alt="Logo" 
          className="w-96 h-auto block" 
        />
        <button
          onClick={() => navigate("/login")}
          className="mt-15 px-6 py-3 bg-blue-600 font-semibold cursor-pointer text-white rounded-lg text-lg hover:bg-blue-700  transition-all shadow-lg "
        >Login</button>
      </div>
    </div>*/
  );
}

export default Index;
