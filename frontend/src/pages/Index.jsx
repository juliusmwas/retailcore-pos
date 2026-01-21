import { useNavigate } from "react-router-dom";

function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 overflow-hidden">
      {/* With a cropped image, a simple flex container handles perfect centering */}
      <div className="flex flex-col items-center animate-in fade-in duration-1000">
        
        <img 
          src="/public/lg.png" 
          alt="Logo" 
          className="w-96 h-auto block" 
        />
        
        {/* With the whitespace gone, you only need a small standard margin (mt-4) */}
        <button
          onClick={() => navigate("/login")}
          className="mt-15 px-6 py-3 bg-blue-600 font-semibold cursor-pointer text-white rounded-lg text-lg hover:bg-blue-700  transition-all shadow-lg "
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Index;