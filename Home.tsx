import { useEffect, useState } from "react";
import { useSearchSongs } from "@/hooks/use-music";
import { SongCard } from "@/components/SongCard";
import { Header } from "@/components/Header";
import { ITunesSong } from "@shared/schema";

export default function Home() {
  const [greeting, setGreeting] = useState("Selamat Datang");
  const [scrollOpacity, setScrollOpacity] = useState(0);

  const { data: popHits, isLoading: loadingPop } = useSearchSongs("pop hits 2024", 12);
  const { data: recentlyPlayed, isLoading: loadingRecently } = useSearchSongs("lofi hip hop", 12);
  const { data: popularArtists, isLoading: loadingArtists } = useSearchSongs("top artists", 12);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Selamat Pagi");
    else if (hour < 18) setGreeting("Selamat Siang");
    else setGreeting("Selamat Malam");
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const opacity = Math.min(scrollTop / 200, 1);
    setScrollOpacity(opacity);
  };

  return (
    <div className="flex-1 bg-gradient-to-b from-[#1e1e1e] to-[#121212] relative overflow-hidden h-full flex flex-col rounded-lg">
      <Header opacity={scrollOpacity} />
      
      <div 
        className="flex-1 overflow-y-auto px-8 pb-32 custom-scrollbar"
        onScroll={handleScroll}
      >
        <h1 className="text-3xl font-bold text-white mb-6 mt-4">{greeting}</h1>
  
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-10">
           {['Liked Songs', 'Daily Mix 1', 'Discover Weekly', 'On Repeat', 'Release Radar', 'Top Hits'].map((item, i) => (
             <div key={i} className="bg-[#2a2a2a]/40 hover:bg-[#2a2a2a] transition-colors rounded overflow-hidden flex items-center gap-4 cursor-pointer group pr-4">
               <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg relative">
                
                 <div className="absolute inset-0 flex items-center justify-center text-white font-bold opacity-50">
                   {item[0]}
                 </div>
               </div>
               <span className="font-bold text-white flex-1">{item}</span>
               <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                  <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-black border-b-[6px] border-b-transparent ml-1"></div>
               </div>
             </div>
           ))}
        </div>

        <Section title="Made For You" songs={popHits} loading={loadingPop} />
        
   
        <Section title="Baru Saja Diputar" songs={recentlyPlayed} loading={loadingRecently} />
        
       
        <Section title="Artis Populer" songs={popularArtists} loading={loadingArtists} />
      </div>
    </div>
  );
}

function Section({ title, songs, loading }: { title: string, songs?: ITunesSong[], loading: boolean }) {
  if (loading) {
     return (
       <div className="mb-10">
         <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-6">
           {Array.from({ length: 7 }).map((_, i) => (
             <div key={i} className="bg-[#181818] p-4 rounded-md animate-pulse">
               <div className="w-full aspect-square bg-[#282828] mb-4 rounded-md"></div>
               <div className="h-4 bg-[#282828] rounded w-3/4 mb-2"></div>
               <div className="h-3 bg-[#282828] rounded w-1/2"></div>
             </div>
           ))}
         </div>
       </div>
     );
  }

  if (!songs || songs.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="flex items-end justify-between mb-6">
        <h2 className="text-2xl font-bold text-white hover:underline cursor-pointer">{title}</h2>
        <span className="text-[#b3b3b3] text-sm font-bold hover:underline cursor-pointer">Tampilkan semua</span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-6">
        {songs.slice(0, 7).map((song) => (
          <SongCard key={song.trackId} song={song} context={songs} />
        ))}
      </div>
    </div>
  );
}
