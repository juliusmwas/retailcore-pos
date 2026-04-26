//import { useNavigate } from "react-router-dom";

function Index() {
  //const navigate = useNavigate();

  return (
    <div className="bg-blue-200">
      {/*Navbar Section*/}
      <div className="flex  justify-between p-4 text-center ">
        {/*logo */}
        <div className="logo"></div>

        {/*Nav-links*/}
        <div className="nav-links flex gap-6 list-none">
          <li>Features</li>
          <li>About Us</li>
          <li>How it Works</li>
          <li>Contact Us</li>
        </div>

        {/*Nav-btn*/}
        <div className="btn flex gap-3 text-center">
          <button className="login border border-blue-600 py-2 px-4 rounded-lg text-blue-600 font-medium cursor-pointer">
            Login
          </button>
          <button className="border border-blue-600 py-2 px-4 rounded-lg text-blue-600 font-medium cursor-pointer">
            Register
          </button>
        </div>
      </div>

      {/*Hero Section */}
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
