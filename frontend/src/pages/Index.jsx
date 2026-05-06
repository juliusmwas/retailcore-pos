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
