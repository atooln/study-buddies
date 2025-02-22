import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (
        username.trim().toLowerCase() === "study" &&
        password.trim() === "study"
      ) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("username", username.trim().toLowerCase());
        window.location.href = "/dashboard";
      } else {
        setError("Invalid username or password. Use study/study to login.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-content flex items-center justify-center">
      <div className="w-full max-w-4xl mx-auto px-8">
        <div className="text-center mb-12">
          <h2 className="text-6xl font-extrabold text-gray-900 mb-6">
            Study Buddies
          </h2>
          <p className="text-2xl text-gray-600">
            Your AI-powered study companion
          </p>
        </div>

        <div className="shadow-2xl rounded-2xl p-12">
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="username"
                className="block text-lg font-medium text-gray-700 mb-3"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full px-5 py-4 text-xl border border-gray-300 rounded-xl shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="study"
                autoComplete="off"
                autoFocus
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-lg font-medium text-gray-700 mb-3"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-5 py-4 text-xl border border-gray-300 rounded-xl shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="study"
                autoComplete="off"
              />
            </div>

            {error && (
              <div className="text-red-600 text-base text-center font-medium bg-red-50 p-4 rounded-xl">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-5 px-6 border border-transparent rounded-xl shadow-lg text-xl font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors duration-200"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
