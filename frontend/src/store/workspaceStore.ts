import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WorkspaceType = "fox" | "frog" | "bunny";

interface WorkspaceState {
  selectedWorkspace: WorkspaceType | null;
  setWorkspace: (workspace: WorkspaceType) => void;
  clearWorkspace: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      selectedWorkspace: null,
      setWorkspace: (workspace) => set({ selectedWorkspace: workspace }),
      clearWorkspace: () => set({ selectedWorkspace: null }),
    }),
    {
      name: "workspace-storage",
    }
  )
);
