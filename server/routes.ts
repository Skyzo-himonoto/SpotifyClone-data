import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
let supabase: any = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.playlists.list.path, async (req, res) => {
    const playlists = await storage.getPlaylists();
    res.json(playlists);
  });

  app.post(api.playlists.create.path, async (req, res) => {
    try {
      const input = api.playlists.create.input.parse(req.body);
      const playlist = await storage.createPlaylist(input);
      res.status(201).json(playlist);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  app.get(api.playlists.get.path, async (req, res) => {
    const playlist = await storage.getPlaylist(Number(req.params.id));
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    res.json(playlist);
  });

  app.get(api.songs.search.path, async (req, res) => {
    try {
      const { term, limit } = api.songs.search.input.parse(req.query);
      
      const response = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&limit=${limit}`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch from iTunes");
      }

      const data = await response.json();
    
      const results = data.results.map((item: any) => ({
        trackId: item.trackId,
        trackName: item.trackName,
        artistName: item.artistName,
        collectionName: item.collectionName,
        previewUrl: item.previewUrl,
        artworkUrl100: item.artworkUrl100,
        trackTimeMillis: item.trackTimeMillis,
      }));

      res.json(results);
    } catch (error) {
      console.error("iTunes API error:", error);
      res.status(500).json({ message: "Failed to search songs" });
    }
  });

  app.get('/api/songs/lookup', async (req, res) => {
    try {
      const ids = req.query.ids as string;
      if (!ids) return res.json([]);

      const response = await fetch(
        `https://itunes.apple.com/lookup?id=${encodeURIComponent(ids)}&media=music`
      );
      if (!response.ok) throw new Error("iTunes lookup failed");

      const data = await response.json();
      const results = (data.results || [])
        .filter((item: any) => item.wrapperType === 'track')
        .map((item: any) => ({
          trackId: item.trackId,
          trackName: item.trackName,
          artistName: item.artistName,
          previewUrl: item.previewUrl,
          artworkUrl100: item.artworkUrl100,
        }));

      res.json(results);
    } catch (error) {
      console.error("iTunes lookup error:", error);
      res.status(500).json({ message: "Lookup failed" });
    }
  });

  app.get('/api/lyrics', async (req, res) => {
    const artist = req.query.artist as string;
    const title  = req.query.title  as string;
    if (!artist || !title) return res.status(400).json({ error: 'Missing artist or title' });

    try {
      const url = `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`;
      const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (!response.ok) return res.status(404).json({ error: 'Lirik tidak ditemukan' });
      const data: any = await response.json();
      if (!data.lyrics) return res.status(404).json({ error: 'Lirik tidak ditemukan' });
      res.json({ lyrics: data.lyrics });
    } catch (err) {
      res.status(404).json({ error: 'Lirik tidak ditemukan' });
    }
  });

  const existingPlaylists = await storage.getPlaylists();
  if (existingPlaylists.length === 0) {
    await storage.createPlaylist({
      name: "My Top Hits",
      description: "A collection of my favorite songs.",
      creator: "Spotify User",
      userId: "system",
      coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
    });
  }

  return httpServer;
}
