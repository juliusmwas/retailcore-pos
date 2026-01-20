import { useNavigate } from "react-router-dom";

function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-800">
          RetailCore POS
        </h1>

        <button
          onClick={() => navigate("/login")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700 transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Index;
