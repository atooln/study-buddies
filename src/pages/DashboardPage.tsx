import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="page-content">
      <nav className="shadow-sm">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-semibold text-gray-900">
                Study Buddies
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">study</span>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="flex space-x-16">
          <button
            onClick={() => navigate("/notebook")}
            className="w-40 h-40 rounded-full bg-pink-400 hover:bg-pink-500 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-300 shadow-lg flex items-center justify-center"
          >
            <span className="text-white text-lg font-medium">Profile 1</span>
          </button>

          <button
            onClick={() => navigate("/notebook")}
            className="w-40 h-40 rounded-full bg-blue-400 hover:bg-blue-500 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg flex items-center justify-center"
          >
            <span className="text-white text-lg font-medium">Profile 2</span>
          </button>

          <button
            onClick={() => navigate("/notebook")}
            className="w-40 h-40 rounded-full bg-yellow-400 hover:bg-yellow-500 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-300 shadow-lg flex items-center justify-center"
          >
            <span className="text-white text-lg font-medium">Profile 3</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
