import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
import "./App.css";
import "./styles/common.css";
import { BasicProvider, useBasic } from "@basictech/react";
import { schema, API_KEY } from "../basic.config";
import MainLayout from "./components/Layout/MainLayout";
import DocumentEditor from "./components/Editor/DocumentEditor";
import ChatPanel from "./components/Chat/ChatPanel";
import LoginPage from "./pages/LoginPage";
import NotebookPage from "./pages/NotebookPage";
import DashboardPage from "./pages/DashboardPage";
import ErrorBoundary from "./components/ErrorBoundary";
import { useEffect, useState } from "react";

function DocumentPage() {
  const { id: documentId } = useParams();

  return (
    <MainLayout>
      <div className="flex-1 flex min-h-0 p-4 gap-4">
        {/* Document Editor */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm overflow-hidden">
          <DocumentEditor documentId={documentId} />
        </div>

        {/* Chat Sidebar */}
        <div className="w-96 bg-white rounded-2xl shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">AI Assistant</h2>
            <button className="p-2 rounded-2xl bg-black text-white hover:bg-gray-900 transition-colors">
              ⚙️
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <ChatPanel documentId={documentId || "new"} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

function AppContent() {
  const basic = useBasic();
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debug log current state
  useEffect(() => {
    console.log("Current Basic Tech State:", {
      isInitializing,
      isAuthReady: basic.isAuthReady,
      isSignedIn: basic.isSignedIn,
      dbStatus: basic.dbStatus,
    });
  }, [isInitializing, basic.isAuthReady, basic.isSignedIn, basic.dbStatus]);

  useEffect(() => {
    let mounted = true;

    const initializeBasic = async () => {
      try {
        console.log("Starting initialization check...");

        if (!basic.isAuthReady) {
          console.log("Auth not ready yet");
          return;
        }

        console.log("Auth is ready, checking sign in status");

        if (!basic.isSignedIn) {
          console.log("Not signed in, attempting sign in");
          try {
            await basic.signin();
            console.log("Sign in successful");
          } catch (err) {
            console.error("Sign in failed:", err);
            if (mounted) {
              setError("Failed to sign in. Please try again.");
            }
          }
        } else {
          console.log("Already signed in");
        }

        // If we get here, we're either signed in or failed to sign in
        if (mounted) {
          console.log("Setting initialization complete");
          setIsInitializing(false);
          setError(null);
        }
      } catch (error) {
        console.error("Initialization error:", error);
        if (mounted) {
          setError("Failed to initialize. Please try again.");
          setIsInitializing(false);
        }
      }
    };

    initializeBasic();

    return () => {
      mounted = false;
    };
  }, [basic.isAuthReady, basic.isSignedIn]);

  // Debug log when state changes
  useEffect(() => {
    console.log("State changed:", {
      isInitializing,
      error,
    });
  }, [isInitializing, error]);

  const handleRetry = () => {
    console.log("Retrying initialization");
    setError(null);
    setIsInitializing(true);
    window.location.reload();
  };

  const handleSignOut = async () => {
    try {
      await basic.signout();
      window.location.href = "/";
    } catch (err) {
      console.error("Sign out failed:", err);
      window.location.reload();
    }
  };

  // Show loading state only if we're actually initializing
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4 bg-white p-8 rounded-2xl shadow-sm max-w-md w-full mx-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" />
          <p className="text-gray-900 font-medium">
            {error || "Initializing StudyBuddy..."}
          </p>
          <p className="text-sm text-gray-500 text-center">
            Auth:{" "}
            {basic.isAuthReady
              ? basic.isSignedIn
                ? "Signed In"
                : "Ready"
              : "Initializing"}
            , DB: {basic.dbStatus}
          </p>
          <button
            onClick={handleRetry}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-900 rounded-2xl transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // If we're not initializing, render the app
  const debugInfo = {
    isInitializing,
    isAuthReady: basic.isAuthReady,
    isSignedIn: basic.isSignedIn,
    dbStatus: basic.dbStatus,
    currentPath: window.location.pathname,
  };

  console.log("Rendering app with state:", debugInfo);

  return (
    <Router>
      <div className="h-screen flex flex-col bg-gray-50">
        {/* Debug info */}
        <div className="fixed top-4 right-4 bg-white p-4 rounded-2xl shadow-sm text-xs">
          <pre className="font-mono">{JSON.stringify(debugInfo, null, 2)}</pre>
        </div>

        <Routes>
          <Route
            path="/"
            element={
              basic.isSignedIn ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <LoginPage />
              )
            }
          />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/notebook/:profileId" element={<NotebookPage />} />
          <Route
            path="*"
            element={
              <Navigate to={basic.isSignedIn ? "/dashboard" : "/"} replace />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    // Verify configuration
    if (!schema || !schema.project_id || !API_KEY) {
      console.error("Missing Basic Tech configuration:", {
        hasSchema: !!schema,
        hasProjectId: !!schema?.project_id,
        hasApiKey: !!API_KEY,
      });
      return;
    }

    // Log configuration
    console.log("Basic Tech configuration:", {
      project_id: schema.project_id,
      schemaVersion: schema.version,
      tables: Object.keys(schema.tables || {}),
    });

    setIsConfigured(true);
  }, []);

  if (!isConfigured) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-sm">
          <div className="text-red-600 font-medium">
            Missing Basic Tech configuration. Check console for details.
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <BasicProvider
        project_id={schema.project_id}
        schema={schema}
        auth={{
          apiKey: API_KEY,
        }}
        options={{
          autoInitialize: true,
          debug: true,
        }}
      >
        <AppContent />
      </BasicProvider>
    </ErrorBoundary>
  );
}

export default App;
