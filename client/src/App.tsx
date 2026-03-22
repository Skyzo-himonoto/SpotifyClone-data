import { Switch, Route, useLocation, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Home as HomeIcon, Search as SearchIcon, Library as LibraryIcon } from "lucide-react";
import Home from "@/pages/Home";
import Search from "@/pages/Search";
import Library from "@/pages/Library";
import PlaylistDetail from "@/pages/PlaylistDetail";
import AuthPage from "@/pages/auth/AuthPage";
import NotFound from "@/pages/not-found";
import { Sidebar } from "@/components/Sidebar";
import { Player } from "@/components/Player";
import { usePlayerStore } from "@/hooks/use-store";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/search" component={Search} />
      <Route path="/library" component={Library} />
      <Route path="/playlist/:id" component={PlaylistDetail} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { currentSong } = usePlayerStore();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Current session:", session);
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state change:", _event, session);
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="h-screen w-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-screen w-screen bg-black text-white flex flex-col overflow-hidden font-sans">
        {session ? (
          <>
            {/* Main content area — sidebar + page */}
          <div className="flex-1 flex overflow-hidden p-2 gap-2 min-h-0">
              <aside className="hidden md:flex flex-col">
                <Sidebar />
              </aside>
              <main className="flex-1 rounded-lg overflow-y-auto bg-[#121212] relative">
                <Router />
              </main>
            </div>

            {currentSong && <Player />}

            <nav className="md:hidden h-16 bg-black border-t border-zinc-800 flex items-center justify-around px-4 z-50 flex-shrink-0">
               <Link href="/">
                 <div className="flex flex-col items-center gap-1 text-[#b3b3b3] hover:text-white transition-colors cursor-pointer">
                   <HomeIcon size={24} />
                   <span className="text-[10px]">Home</span>
                 </div>
               </Link>
               <Link href="/search">
                 <div className="flex flex-col items-center gap-1 text-[#b3b3b3] hover:text-white transition-colors cursor-pointer">
                   <SearchIcon size={24} />
                   <span className="text-[10px]">Search</span>
                 </div>
               </Link>
               <Link href="/library">
                 <div className="flex flex-col items-center gap-1 text-[#b3b3b3] hover:text-white transition-colors cursor-pointer">
                   <LibraryIcon size={24} />
                   <span className="text-[10px]">Library</span>
                 </div>
               </Link>
            </nav>
          </>
        ) : (
          <AuthPage />
        )}
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
