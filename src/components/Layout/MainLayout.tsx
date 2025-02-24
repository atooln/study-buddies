import { ReactNode } from "react";
import { useBasic } from "@basictech/react";

interface MainLayoutProps {
  children?: ReactNode;
}

const SyncStatus = () => {
  const { syncStatus } = useBasic();

  return (
    <div className="fixed bottom-4 right-4 flex items-center space-x-2 z-10">
      <div
        className={`w-2 h-2 rounded-full ${
          syncStatus === "synced"
            ? "bg-green-500"
            : syncStatus === "syncing"
            ? "bg-yellow-500"
            : "bg-red-500"
        }`}
      />
      <span className="text-sm text-gray-600">
        {syncStatus === "synced"
          ? "All changes saved"
          : syncStatus === "syncing"
          ? "Saving..."
          : "Offline"}
      </span>
    </div>
  );
};

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="flex-none h-16 bg-white border-b shadow-sm">
        <div className="flex items-center justify-between h-full px-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Study Buddies
          </h1>
          <div className="flex items-center space-x-4">
            {/* Add user menu/actions here */}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex min-h-0">{children}</main>

      {/* Sync status indicator */}
      <SyncStatus />
    </div>
  );
};

export default MainLayout;
