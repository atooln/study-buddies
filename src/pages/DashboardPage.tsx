import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const DashboardPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically navigate to notebook page with a default ID
    navigate("/notebook/default");
  }, [navigate]);

  // Show loading state while redirecting
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
        <p className="text-gray-600">Loading notebook...</p>
      </div>
    </div>
  );
};

export default DashboardPage;
