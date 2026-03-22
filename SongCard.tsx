import { Play } from "lucide-react";
import { type ITunesSong } from "@shared/schema";
import { usePlayerStore } from "@/hooks/use-store";
import { AddToPlaylistButton } from "./AddToPlaylistButton";

interface SongCardProps {
  song: ITunesSong;
  context: ITunesSong[]; 
}

export function SongCard({ song, context }: SongCardProps) {
  const { playSong, currentSong, isPlaying, togglePlay } = usePlayerStore();
  
  const isCurrent = currentSong?.trackId === song.trackId;

  const handleClick = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      playSong(song, context);
    }
  };

  return (
    <div 
      className="p-4 rounded-md bg-[#181818] hover:bg-[#282828] transition-all duration-300 group cursor-pointer relative"
      onClick={handleClick}
    >
      <div className="relative aspect-square w-full mb-4 shadow-lg rounded-md overflow-hidden">
        <img 
          src={song.artworkUrl100.replace('100x100', '400x400')} 
          alt={song.trackName} 
          className="w-full h-full object-cover" 
          loading="lazy"
        />
        
        <div className={`absolute bottom-2 right-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-xl ${isCurrent ? 'opacity-100 translate-y-0' : ''}`}>
           <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center hover:scale-105 hover:bg-green-400 active:scale-95 transition-all text-black">
              {isCurrent && isPlaying ? (
                 <div className="w-4 h-4 bg-black rounded-[1px]" /> 
              ) : (
                 <Play fill="black" className="ml-1" size={24} />
              )}
           </div>
        </div>
      </div>

      <div className="min-h-[60px]">
        <div className="flex items-start justify-between gap-2">
          <h3 className={`font-bold truncate mb-1 flex-1 ${isCurrent ? 'text-green-500' : 'text-white'}`}>
            {song.trackName}
          </h3>
          <AddToPlaylistButton song={song} />
        </div>
        <p className="text-sm text-[#a7a7a7] line-clamp-2 hover:underline">
          {song.artistName}
        </p>
      </div>
    </div>
  );
}