import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBasic } from "@basictech/react";

const LoginPage = () => {
  const navigate = useNavigate();
  const basic = useBasic();
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
        await basic.signin();
        navigate("/dashboard", { replace: true });
      } else {
        setError("Invalid username or password. Use study/study to login.");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h2 className="text-6xl font-extrabold text-gray-900 mb-4">
            StudyBuddy
          </h2>
          <p className="text-2xl text-gray-600">
            Your AI-powered study companion
          </p>
        </div>

        <div className="bg-white shadow-sm rounded-2xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="username"
                className="block text-lg font-medium text-gray-900 mb-2"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full px-4 py-3 text-lg bg-gray-50 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200"
                placeholder="study"
                autoComplete="off"
                autoFocus
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-lg font-medium text-gray-900 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 text-lg bg-gray-50 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200"
                placeholder="study"
                autoComplete="off"
              />
            </div>

            {error && (
              <div className="text-red-600 text-base text-center font-medium bg-red-50 p-4 rounded-2xl">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 text-lg font-medium text-white bg-black hover:bg-gray-900 rounded-2xl transition-colors disabled:opacity-50"
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
