import { create } from 'zustand';
import { type ITunesSong } from '@shared/schema';

interface PlayerState {
  currentSong: ITunesSong | null;
  isPlaying: boolean;
  volume: number;
  playlist: ITunesSong[];
  
  playSong: (song: ITunesSong, playlist?: ITunesSong[]) => void;
  togglePlay: () => void;
  setVolume: (vol: number) => void;
  nextSong: () => void;
  prevSong: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  volume: 0.5,
  playlist: [],

  playSong: (song, playlist) => {
    const newPlaylist = playlist || [song];
    set({ currentSong: song, isPlaying: true, playlist: newPlaylist });
  },

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  
  setVolume: (volume) => set({ volume }),

  nextSong: () => {
    const { currentSong, playlist } = get();
    if (!currentSong || playlist.length === 0) return;
    
    const currentIndex = playlist.findIndex(s => s.trackId === currentSong.trackId);
    const nextIndex = (currentIndex + 1) % playlist.length;
    set({ currentSong: playlist[nextIndex], isPlaying: true });
  },

  prevSong: () => {
    const { currentSong, playlist } = get();
    if (!currentSong || playlist.length === 0) return;
    
    const currentIndex = playlist.findIndex(s => s.trackId === currentSong.trackId);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    set({ currentSong: playlist[prevIndex], isPlaying: true });
  }
}));
