import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { supabase } from "@/lib/supabase";
import { usePlayerStore } from "@/hooks/use-store";
import { Play, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { uuidToTrackId } from "@/lib/uuid-utils";

export default function Library() {
  const [songs, setSongs] = useState<any[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { playSong } = usePlayerStore();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) return;

    const { data: favData, error: favError } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!favError && favData) {
      const mappedSongs = favData.map(fav => ({
        trackId: uuidToTrackId(fav.track_id),
        trackName: fav.track_name,
        artistName: fav.artist_name,
        artworkUrl100: fav.artwork_url,
        previewUrl: fav.audio_url || "",
        audioUrl: fav.audio_url
      }));
      setSongs(mappedSongs);
    }

    const { data: plData, error: plError } = await supabase
      .from('playlists')
      .select('id, name')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!plError && plData) {
      setPlaylists(plData);
    }

    setLoading(false);
  };

  const colors = [
    "from-blue-600 to-cyan-400",
    "from-emerald-600 to-teal-400",
    "from-orange-500 to-yellow-400",
    "from-purple-600 to-pink-400"
  ];

  const createPlaylist = async () => {
    const name = window.prompt("Masukkan nama playlist baru:");
    if (!name) return;

    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) return;

    console.log('Inserting with user_id:', user.id);

    const { error } = await supabase
      .from('playlists')
      .insert({
        name,
        user_id: user.id,
      });

    if (error) {
      alert("Gagal membuat playlist: " + error.message);
    } else {
      fetchData();
    }
  };

  return (
    <div className="p-6 pb-32">
      <div className="flex items-center gap-6 mb-8 bg-gradient-to-b from-indigo-900/40 to-transparent -m-6 p-6">
        <div className="w-52 h-52 bg-gradient-to-br from-indigo-700 to-blue-400 shadow-2xl flex items-center justify-center rounded-md">
          <Heart size={80} fill="white" className="text-white" />
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider">Playlist</h4>
          <h1 className="text-6xl md:text-8xl font-black mt-2 mb-6 tracking-tighter">Koleksi Kamu</h1>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span className="text-white">User</span>
            <span className="text-zinc-400">• {songs.length} lagu disukai • {playlists.length} playlist</span>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">Playlist Kamu</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12">
          <div 
            className="group bg-[#181818] p-4 rounded-md hover:bg-[#282828] transition-all cursor-pointer"
            onClick={createPlaylist}
          >
            <div className="aspect-square mb-4 bg-[#282828] rounded-md flex items-center justify-center group-hover:bg-[#333333] transition-colors">
              <span className="text-4xl text-zinc-500">+</span>
            </div>
            <h3 className="font-bold text-white mb-1">Buat Playlist</h3>
            <p className="text-sm text-[#a7a7a7]">Klik untuk membuat</p>
          </div>
          {playlists.map((pl, i) => (
            <Link href={`/playlist/${pl.id}`} key={pl.id}>
              <div className="bg-[#181818] p-4 rounded-md hover:bg-[#282828] transition-all cursor-pointer group">
                <div className={`aspect-square mb-4 bg-gradient-to-br ${colors[i % colors.length]} rounded-md shadow-lg flex items-center justify-center`}>
                  <span className="text-white font-bold text-2xl opacity-50">{pl.name?.[0] || 'P'}</span>
                </div>
                <h3 className="font-bold text-white mb-1 truncate">{pl.name}</h3>
                <p className="text-sm text-[#a7a7a7]">Playlist</p>
              </div>
            </Link>
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-6">Lagu yang Disukai</h2>
        <div className="grid grid-cols-[16px_4fr_3fr_minmax(120px,1fr)] gap-4 px-4 py-2 border-b border-white/10 text-[#b3b3b3] text-sm mb-4">
          <span>#</span>
          <span>Judul</span>
          <span className="hidden md:block">Album</span>
          <span className="flex justify-end pr-8">
            <Heart size={16} />
          </span>
        </div>

        {loading ? (
          Array(5).fill(0).map((_, i) => (
            <div key={i} className="flex gap-4 p-2">
              <Skeleton className="h-12 w-full bg-zinc-800" />
            </div>
          ))
        ) : (
          songs.map((song, index) => (
            <div 
              key={song.trackId}
              className="group grid grid-cols-[16px_4fr_3fr_minmax(120px,1fr)] gap-4 px-4 py-2 hover:bg-white/10 rounded-md transition-colors items-center cursor-pointer"
              onClick={() => playSong(song, songs)}
              data-testid={`row-song-${song.trackId}`}
            >
              <span className="text-[#b3b3b3] group-hover:hidden">{index + 1}</span>
              <Play size={12} className="hidden group-hover:block fill-white" />
              <div className="flex items-center gap-3">
                <img src={song.artworkUrl100} className="w-10 h-10 rounded" alt="" />
                <div className="flex flex-col">
                  <span className="text-white font-medium line-clamp-1">{song.trackName}</span>
                  <span className="text-[#b3b3b3] text-xs hover:underline cursor-pointer">{song.artistName}</span>
                </div>
              </div>
              <span className="hidden md:block text-[#b3b3b3] text-sm">{song.artistName}</span>
              <div className="flex justify-end pr-8">
                <Heart size={16} className="text-green-500 fill-green-500" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
