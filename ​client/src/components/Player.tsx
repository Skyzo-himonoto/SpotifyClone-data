import { useEffect, useRef, useState } from "react";
import { usePlayerStore } from "@/hooks/use-store";
import { Howl } from "howler";
import {
  Play, Pause, SkipBack, SkipForward,
  Volume2, VolumeX, Heart, ChevronDown,
  Shuffle, Repeat, MicVocal,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { trackIdToUUID } from "@/lib/uuid-utils";

function useCrossfadeBg(artUrl: string) {
  const [layers, setLayers] = useState({
    a:   artUrl,
    b:   artUrl,
    top: "a" as "a" | "b",
  });

  useEffect(() => {
    if (!artUrl) return;
    setLayers((prev) =>
      prev.top === "a"
        ? { a: prev.a, b: artUrl, top: "b" }
        : { a: artUrl, b: prev.b, top: "a" }
    );
  }, [artUrl]);

  return layers;
}

const TRACK_CLS = [
  "[&>span:first-child]:h-1",
  "[&>span:first-child]:bg-white/20",
  "[&>span:first-child>span]:bg-[#1db954]",
  "[&_[role=slider]]:w-[14px]",
  "[&_[role=slider]]:h-[14px]",
  "[&_[role=slider]]:bg-white",
  "[&_[role=slider]]:border-0",
  "[&_[role=slider]]:shadow-md",
].join(" ");

function LyricsPanel({
  loading, error, lines, onRetry,
}: {
  loading: boolean;
  error: boolean;
  lines: string[];
  onRetry: () => void;
}) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 px-6 py-4 border-b border-white/10 flex-shrink-0">
        <MicVocal size={16} className="text-[#1db954]" />
        <span className="text-white font-bold text-sm tracking-wide">Lirik</span>
        {loading && (
          <div className="ml-auto w-4 h-4 rounded-full border-2 border-white/20 border-t-[#1db954] animate-spin" />
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5" style={{ WebkitOverflowScrolling: "touch" }}>
        {loading && (
          <div className="flex items-center justify-center h-full text-white/30 text-sm">
            Mengambil lirik...
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-white/30">
            <MicVocal size={40} className="opacity-20" />
            <p className="text-sm text-center">Lirik tidak tersedia untuk lagu ini.</p>
            <button
              onClick={onRetry}
              className="text-xs text-[#1db954] hover:underline mt-1"
            >
              Coba lagi
            </button>
          </div>
        )}

        {!loading && !error && lines.length > 0 && (
          <div className="space-y-0.5 pb-8">
            {(Array.isArray(lines) ? lines : []).map((line, i) => (
              <p
                key={i}
                className={
                  line.trim() === ""
                    ? "h-5"
                    : "text-white/85 text-[17px] leading-[1.75] font-medium"
                }
              >
                {line.trim() === "" ? "\u00A0" : line}
              </p>
            ))}
          </div>
        )}

        {!loading && !error && lines.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-white/25">
            <MicVocal size={36} className="opacity-20" />
            <p className="text-sm">Lirik tidak tersedia</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function Player() {
  const { currentSong, isPlaying, volume, togglePlay, setVolume, nextSong, prevSong } =
    usePlayerStore();

  const [progress,      setProgress]      = useState(0);
  const [duration,      setDuration]      = useState(0);
  const [isLiked,       setIsLiked]       = useState(false);
  const [fullOpen,      setFullOpen]      = useState(false);
  const [lyrics,        setLyrics]        = useState<string | null>(null);
  const [lyricsLoading, setLyricsLoading] = useState(false);
  const [lyricsError,   setLyricsError]   = useState(false);

  const soundRef = useRef<Howl | null>(null);
  const rafRef   = useRef<number | null>(null);
  const { toast } = useToast();

  const artLarge = currentSong?.artworkUrl100?.replace("100x100", "600x600")
    ?? currentSong?.artworkUrl100
    ?? "";

  const bg = useCrossfadeBg(artLarge);

  useEffect(() => {
    if (!currentSong) return;
    checkIfLiked();
    setLyrics(null);
    setLyricsError(false);

    if (soundRef.current) soundRef.current.unload();
    const src = currentSong.previewUrl || (currentSong as any).audioUrl;
    if (!src) return;

    try {
      const sound = new Howl({
        src: [src],
        html5: true,
        volume,
        onplay:  () => { setDuration(sound.duration()); rafRef.current = requestAnimationFrame(tick); },
        onend:   () => nextSong(),
        onseek:  () => { rafRef.current = requestAnimationFrame(tick); },
      });
      soundRef.current = sound;
      if (isPlaying) sound.play();
    } catch 

    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [currentSong]);

  useEffect(() => {
    if (!soundRef.current) return;
    isPlaying ? soundRef.current.play() : soundRef.current.pause();
  }, [isPlaying]);

  useEffect(() => { soundRef.current?.volume(volume); }, [volume]);

  useEffect(() => {
    if (fullOpen && currentSong && lyrics === null && !lyricsLoading) fetchLyrics();
  }, [fullOpen, currentSong]);

  const tick = () => {
    if (soundRef.current?.playing()) {
      setProgress(soundRef.current.seek());
      rafRef.current = requestAnimationFrame(tick);
    }
  };

  const handleSeek = (val: number[]) => {
    soundRef.current?.seek(val[0]);
    setProgress(val[0]);
  };

  const fmt = (s: number) => {
    const m = Math.floor(s / 60), sec = Math.floor(s % 60);
    return `${m}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const checkIfLiked = async () => {
    if (!currentSong) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const { data } = await supabase
      .from("favorites").select("track_id")
      .eq("user_id", session.user.id)
      .eq("track_id", trackIdToUUID(currentSong.trackId))
      .maybeSingle();
    setIsLiked(!!data);
  };

  const toggleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentSong) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert("Silakan login dulu");
      return;
    }

    const uuid = trackIdToUUID(currentSong.trackId);

    if (isLiked) {
      const { error } = await supabase.from("favorites").delete()
        .eq("user_id", session.user.id).eq("track_id", uuid);
      if (!error) { setIsLiked(false); toast({ title: "Dihapus dari favorit" }); }
      else toast({ title: "Gagal menghapus", description: error.message, variant: "destructive" });
    } else {
      const { error } = await supabase.from("favorites").upsert({
        user_id:     session.user.id,
        track_id:    uuid,
        track_name:  currentSong.trackName,
        artist_name: currentSong.artistName,
        artwork_url: currentSong.artworkUrl100 ?? null,
      }, { onConflict: "track_id,user_id" });

      if (!error) {
        setIsLiked(true);
        toast({ title: "Berhasil ditambah ke favorit ❤️" });
      } else {
        console.error("[toggleLike]", error);
        toast({ title: "Gagal menyukai", description: error.message, variant: "destructive" });
      }
    }
  };

  const fetchLyrics = async () => {
    if (!currentSong) return;
    setLyricsLoading(true);
    setLyricsError(false);
    try {
      const res  = await fetch(
        `/api/lyrics?artist=${encodeURIComponent(currentSong.artistName)}&title=${encodeURIComponent(currentSong.trackName)}`
      );
      const data = await res.json();
      if (res.ok && data.lyrics) {
        setLyrics(typeof data.lyrics === "string" ? data.lyrics.trim() : "");
      } else {
        setLyricsError(true);
      }
    } catch { setLyricsError(true); }
    setLyricsLoading(false);
  };

  const lyricLines: string[] = (() => {
    if (!lyrics || typeof lyrics !== "string") return [];
    if (Array.isArray(lyrics)) return (lyrics as unknown) as string[];
    return lyrics.split("\n");
  })();

  if (!currentSong) return null;

  const progressPct = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <>

      <div
        className="relative h-20 bg-black/90 backdrop-blur-xl border-t border-white/[0.07] px-4 grid grid-cols-3 items-center w-full flex-shrink-0 z-40 cursor-pointer select-none"
        onClick={() => setFullOpen(true)}
        data-testid="mini-player"
      >
      
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/10 pointer-events-none">
          <div className="h-full bg-[#1db954] transition-all duration-150" style={{ width: `${progressPct}%` }} />
        </div>

        <div className="flex items-center gap-3 min-w-0">
          <img
            src={currentSong.artworkUrl100}
            alt={currentSong.trackName}
            className="w-12 h-12 rounded-lg object-cover shadow-lg flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="text-white text-sm font-semibold truncate leading-tight">
              {currentSong.trackName}
            </p>
            <div className="flex items-center gap-2 mt-[3px]">
              <p className="text-white/50 text-xs truncate">{currentSong.artistName}</p>

    
              {isPlaying && (
                <div
                  className="flex items-end gap-[2px] flex-shrink-0"
                  style={{ height: 14 }}
                  aria-hidden
                  data-testid="visualizer-bars"
                >
                  <span className="rhythm-bar playing" />
                  <span className="rhythm-bar playing" />
                  <span className="rhythm-bar playing" />
                  <span className="rhythm-bar playing" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-5" onClick={(e) => e.stopPropagation()}>
          <button className="text-white/60 hover:text-white transition-colors" onClick={prevSong} data-testid="button-prev-mini">
            <SkipBack size={20} fill="currentColor" />
          </button>
          <button
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
            onClick={togglePlay}
            data-testid="button-play-mini"
          >
            {isPlaying ? <Pause size={18} fill="black" className="text-black" /> : <Play size={18} fill="black" className="text-black ml-0.5" />}
          </button>
          <button className="text-white/60 hover:text-white transition-colors" onClick={nextSong} data-testid="button-next-mini">
            <SkipForward size={20} fill="currentColor" />
          </button>
        </div>

        <div className="flex items-center justify-end gap-3" onClick={(e) => e.stopPropagation()}>
          <Heart
            size={18} onClick={toggleLike} data-testid="button-like"
            className={`cursor-pointer transition-colors flex-shrink-0 ${isLiked ? "text-[#1db954] fill-[#1db954]" : "text-white/50 hover:text-white"}`}
          />
          <div className="hidden md:flex items-center gap-2 w-28">
            <button onClick={() => setVolume(volume === 0 ? 0.5 : 0)}>
              {volume === 0 ? <VolumeX size={16} className="text-white/50" /> : <Volume2 size={16} className="text-white/50" />}
            </button>
            <Slider value={[volume]} max={1} step={0.01} onValueChange={(v) => setVolume(v[0])} className={`w-full ${TRACK_CLS}`} />
          </div>
        </div>
      </div>

 
      <div
        className={`fixed inset-0 z-[200] flex flex-col transition-transform duration-500 ease-[cubic-bezier(.32,.72,0,1)] ${
          fullOpen ? "translate-y-0" : "translate-y-full pointer-events-none"
        }`}
        data-testid="full-player"
      >
     
        <div className="absolute inset-0 -z-10 overflow-hidden bg-black">
          <img src={bg.a} aria-hidden className={`absolute inset-0 w-full h-full object-cover scale-125 blur-[100px] transition-opacity duration-1000 ease-in-out ${bg.top === "a" ? "opacity-65" : "opacity-0"}`} />
          <img src={bg.b} aria-hidden className={`absolute inset-0 w-full h-full object-cover scale-125 blur-[100px] transition-opacity duration-1000 ease-in-out ${bg.top === "b" ? "opacity-65" : "opacity-0"}`} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/65 to-black/90" />
        </div>

      
        <div className="flex-shrink-0 flex items-center justify-between px-5 pt-12 pb-3 z-10">
          <button
            onClick={() => setFullOpen(false)}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            data-testid="button-close-full-player"
          >
            <ChevronDown size={22} className="text-white" />
          </button>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40">Sedang Diputar</p>
          <div className="w-9" />
        </div>

  
          <div className="flex flex-col w-full md:w-[420px] lg:w-[460px] flex-shrink-0 overflow-y-auto md:overflow-y-visible md:justify-center px-8 pb-6 md:pb-0">

          
            <div className="flex justify-center py-6 md:py-0 md:mb-8">
              <div
                className={`w-full max-w-[280px] md:max-w-[320px] aspect-square rounded-2xl overflow-hidden transition-all duration-500 ${
                  isPlaying
                    ? "shadow-[0_32px_96px_rgba(0,0,0,.85)] scale-100"
                    : "shadow-[0_12px_40px_rgba(0,0,0,.5)] scale-[.9] opacity-80"
                }`}
              >
                <img src={artLarge} alt={currentSong.trackName} className="w-full h-full object-cover" />
              </div>
            </div>

            
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="min-w-0 flex-1">
                <h2 className="text-white text-2xl font-black leading-tight truncate">{currentSong.trackName}</h2>
                <p className="text-white/55 text-base mt-1 truncate">{currentSong.artistName}</p>
              </div>
              <button onClick={toggleLike} className="flex-shrink-0 mt-1" data-testid="button-like-full">
                <Heart
                  size={28}
                  className={`transition-all duration-200 ${isLiked ? "text-[#1db954] fill-[#1db954] scale-110" : "text-white/30 hover:text-white"}`}
                />
              </button>
            </div>

            
            <div className="mb-1">
              <Slider
                value={[progress]} max={duration || 30} step={0.1}
                onValueChange={handleSeek}
                className={`w-full ${TRACK_CLS}`}
                data-testid="slider-progress-full"
              />
              <div className="flex justify-between mt-2 text-[11px] font-mono text-white/35">
                <span>{fmt(progress)}</span>
                <span>{fmt(duration || 30)}</span>
              </div>
            </div>

           
            <div className="flex items-center justify-between mt-2 mb-5">
              <button className="text-white/30 hover:text-white/80 transition-colors p-1"><Shuffle size={22} /></button>
              <button className="text-white/70 hover:text-white transition-colors" onClick={prevSong} data-testid="button-prev">
                <SkipBack size={30} fill="currentColor" />
              </button>
              <button
                className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all"
                onClick={togglePlay} data-testid="button-play-full"
              >
                {isPlaying ? <Pause size={30} fill="black" className="text-black" /> : <Play size={30} fill="black" className="text-black ml-1" />}
              </button>
              <button className="text-white/70 hover:text-white transition-colors" onClick={nextSong} data-testid="button-next">
                <SkipForward size={30} fill="currentColor" />
              </button>
              <button className="text-white/30 hover:text-white/80 transition-colors p-1"><Repeat size={22} /></button>
            </div>

           
            <div className="flex items-center gap-3">
              <button onClick={() => setVolume(volume === 0 ? 0.5 : 0)}>
                {volume === 0 ? <VolumeX size={18} className="text-white/35" /> : <Volume2 size={18} className="text-white/35" />}
              </button>
              <Slider value={[volume]} max={1} step={0.01} onValueChange={(v) => setVolume(v[0])} className={`flex-1 ${TRACK_CLS}`} data-testid="slider-volume-full" />
              <Volume2 size={18} className="text-white/35" />
            </div>

       
            <div className="md:hidden mt-8 rounded-2xl bg-white/[0.06] border border-white/[0.08] overflow-hidden mb-6">
              <LyricsPanel
                loading={lyricsLoading}
                error={lyricsError}
                lines={lyricLines}
                onRetry={fetchLyrics}
              />
            </div>
          </div>

   
          <div className="hidden md:flex flex-1 flex-col min-w-0 pr-8 pb-8 pt-2">
            <div className="h-full rounded-2xl bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] overflow-hidden">
              <LyricsPanel
                loading={lyricsLoading}
                error={lyricsError}
                lines={lyricLines}
                onRetry={fetchLyrics}
              />
            </div>
          </div>

        </div>{/* end body */}
      </div>
    </>
  );
}
