import { useState, useEffect } from "react";
import { Search as SearchIcon } from "lucide-react";
import { useSearchSongs } from "@/hooks/use-music";
import { SongCard } from "@/components/SongCard";
import { AddToPlaylistButton } from "@/components/AddToPlaylistButton";
import { Header } from "@/components/Header";
import { usePlayerStore } from "@/hooks/use-store";

function useDebounceValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

export default function Search() {
  const [term, setTerm] = useState("");
  const debouncedTerm = useDebounceValue(term, 500);
  const { data: results, isLoading } = useSearchSongs(debouncedTerm);

  const genres = ["Podcasts", "Acara Langsung", "Dibuat Untuk Kamu", "Rilis Baru", "Pop", "Hip-Hop", "Rock", "Latin"];
  const colors = [
    "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500", 
    "bg-blue-500", "bg-indigo-500", "bg-purple-500", "bg-pink-500"
  ];

  return (
    <div className="flex-1 bg-[#121212] relative overflow-hidden h-full flex flex-col rounded-lg">
      <div className="sticky top-0 z-50 bg-[#121212] pt-4 px-8 pb-4">
         <div className="flex items-center gap-4">
            <div className="relative w-96">
               <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-zinc-400" />
               </div>
               <input 
                  type="text" 
                  className="w-full bg-[#242424] text-white rounded-full py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-white border-none placeholder-zinc-500 font-medium"
                  placeholder="Apa yang ingin kamu dengarkan?"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  autoFocus
                  data-testid="input-search"
               />
            </div>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-32 custom-scrollbar">
        {!debouncedTerm && (
          <div className="mt-4">
            <h2 className="text-xl font-bold text-white mb-4">Jelajahi Semua</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {genres.map((genre, i) => (
                <div key={i} className={`${colors[i % colors.length]} aspect-square rounded-lg p-4 relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform`}>
                  <h3 className="text-2xl font-bold text-white">{genre}</h3>
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-black/20 rotate-[25deg] shadow-lg rounded-md" />
                </div>
              ))}
            </div>
          </div>
        )}

        {isLoading && debouncedTerm && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-green-500 border-r-2 border-r-transparent"></div>
          </div>
        )}

        {results && results.length > 0 && (
          <div className="mt-4">
             <h2 className="text-2xl font-bold text-white mb-6">Hasil teratas</h2>
             <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="p-6 bg-[#181818] hover:bg-[#282828] transition-colors rounded-md flex flex-col gap-4 cursor-pointer group w-full md:w-96 relative"
                     onClick={() => results && results[0] && usePlayerStore.getState().playSong(results[0], results)}>
                   <div className="w-24 h-24 rounded-full overflow-hidden shadow-2xl">
                      <img src={results[0].artworkUrl100} className="w-full h-full object-cover" alt="" />
                   </div>
                   <div>
                      <h3 className="text-3xl font-bold text-white mb-1">{results[0].trackName}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-[#b3b3b3] font-bold text-sm bg-[#121212] px-3 py-1 rounded-full">Lagu</span>
                        <span className="text-white font-bold text-sm">{results[0].artistName}</span>
                      </div>
                   </div>
                   <div className="absolute bottom-4 right-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg translate-y-2 group-hover:translate-y-0 duration-300">
                       <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-black border-b-[6px] border-b-transparent ml-1"></div>
                   </div>
                </div>

                <div className="flex-1 flex flex-col">
                   <h2 className="text-2xl font-bold text-white mb-4">Lagu</h2>
                   {results.slice(0, 4).map((song) => (
                      <div key={song.trackId} 
                           className="flex items-center gap-4 p-2 hover:bg-[#2a2a2a] rounded-md group cursor-pointer transition-colors"
                           onClick={() => usePlayerStore.getState().playSong(song, results)}>
                         <div className="relative w-10 h-10">
                            <img src={song.artworkUrl100} className="w-full h-full rounded" alt="" />
                            <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white">
                               <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[8px] border-l-white border-b-[4px] border-b-transparent ml-0.5"></div>
                            </div>
                         </div>
                         <div className="flex flex-col flex-1">
                            <div className="flex items-center justify-between gap-2">
                               <span className="text-white font-medium line-clamp-1">{song.trackName}</span>
                               <AddToPlaylistButton song={song} />
                            </div>
                            <span className="text-[#b3b3b3] text-sm">{song.artistName}</span>
                         </div>
                      </div>
                   ))}
                </div>
             </div>

             <h2 className="text-2xl font-bold text-white mb-6">Hasil lainnya</h2>
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {results.slice(4).map(song => (
                   <SongCard key={song.trackId} song={song} context={results} />
                ))}
             </div>
          </div>
        )}

        {!isLoading && debouncedTerm && (!results || results.length === 0) && (
           <div className="flex flex-col items-center justify-center h-64 text-center">
              <h3 className="text-2xl font-bold text-white mb-2">Tidak ada hasil ditemukan untuk "{debouncedTerm}"</h3>
              <p className="text-[#a7a7a7]">Pastikan ejaan kamu benar, atau gunakan kata kunci lain.</p>
           </div>
        )}
      </div>
    </div>
  );
}
