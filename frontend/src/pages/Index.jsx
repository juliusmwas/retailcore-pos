//import { useNavigate } from "react-router-dom";

function Index() {
  //const navigate = useNavigate();

  return (
    <div className=" w-full shadow-sm bg-blue-100">
      <div className="bg-blue-100 border-b border-gray-100 w-full">
        <div className="flex justify-between items-center py-4 px-8 max-w-7xl mx-auto">
          <div className="flex items-center">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              Retail<span className="text-blue-600">Core</span>
              <span className="ml-1 text-xs font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded uppercase tracking-widest">
                POS
              </span>
            </span>
          </div>

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

      <section className="relative w-full overflow-hidden bg-[#eef5ff]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#f3f8ff] via-[#e2eeff] to-[#c7e0ff] opacity-80 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 pt-20 md:pt-28 flex flex-col items-center text-center z-10">
          <h1 className="max-w-4xl text-4xl md:text-6xl font-bold text-slate-800 tracking-tight leading-tight md:leading-[1.15]">
            Simplify Sales, Inventory &amp; Payment Effortlessly
          </h1>

          <p className="mt-6 max-w-xl text-base md:text-lg text-slate-600 font-medium leading-relaxed">
            Everything you need to run your store smoothly{" "}
            <br className="hidden sm:inline" />
            All in one smart platform.
          </p>

          <div className="mt-8">
            <button className="bg-[#0b65f7] hover:bg-[#0952cb] active:scale-95 text-white font-semibold px-8 py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
              Get Started
            </button>
          </div>

          {/* Dashboard Image Container */}
          <div className="relative mt-16 w-full max-w-6xl mx-auto px-4">
            <div className="relative rounded-xl border border-white/20 bg-white/10 p-2 shadow-2xl backdrop-blur-md">
              {/* The Mockup Wrapper */}
              <div className="overflow-hidden rounded-lg bg-slate-50 border border-slate-200 shadow-inner">
                <img
                  src="/public/dashboard-mockup.png"
                  alt="RetailCore POS Admin Dashboard"
                  /* Using object-contain ensures the whole image fits.
           We remove h-full to let the image dictate the height naturally.
        */
                  className="w-full h-auto block object-contain shadow-2xl"
                  loading="eager"
                />
              </div>

              {/* Optional: Add a subtle glow behind the mockup to blend it into the blue background */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-10 -z-10"></div>
            </div>
          </div>
        </div>
      </section>
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
