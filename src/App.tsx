import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import "./styles/common.css";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import NotebookPage from "./pages/NotebookPage";

function App() {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  return (
    <Router>
      <div className="page-container">
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <LoginPage />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? <DashboardPage /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/notebook"
            element={
              isAuthenticated ? <NotebookPage /> : <Navigate to="/" replace />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
