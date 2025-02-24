declare module "@basictech/react" {
  export interface BasicContext {
    useQuery: <T>(
      collection: string,
      options?: { where?: Record<string, any> }
    ) => {
      data: T | undefined;
      loading: boolean;
      error?: Error;
    };
    useMutation: (
      collection: string,
      operation: string
    ) => (data: any) => Promise<any>;
    syncStatus: "synced" | "syncing" | "offline";
    isAuthReady: boolean;
    isSignedIn: boolean;
    user: { id: string; email: string } | null;
    signout: () => void;
    signin: () => void;
    getToken: () => Promise<string>;
    getSignInLink: () => string;
    db: {
      query: (collection: string) => {
        get: () => Promise<any>;
      };
    };
    dbStatus: "connected" | "connecting" | "disconnected";
  }

  export interface BasicProviderProps {
    project_id: string;
    schema: any;
    children: React.ReactNode;
    auth?: {
      apiKey: string;
    };
    options?: {
      autoInitialize?: boolean;
      debug?: boolean;
    };
  }

  export function useBasic(): BasicContext;
  export function BasicProvider(props: BasicProviderProps): JSX.Element;
}
