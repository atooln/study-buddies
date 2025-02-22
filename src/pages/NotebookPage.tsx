import { useNavigate } from "react-router-dom";

const NotebookPage = () => {
  const navigate = useNavigate();
  return (
    <div className="page-content">
      <nav className="shadow-sm">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <span className="text-xl">←</span>
                <span className="ml-2">Back to Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="shadow-lg p-6 rounded-lg">
            <div className="grid grid-cols-1 gap-6">
              <div className="rounded-lg">
                <textarea
                  className="w-full min-h-[300px] p-4 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
                  placeholder="Start typing your notes or code here..."
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  Add Text Cell
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Add Code Cell
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotebookPage;
