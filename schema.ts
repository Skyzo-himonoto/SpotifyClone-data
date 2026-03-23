import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
.
export const playlists = pgTable("playlists", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  coverUrl: text("cover_url"),
  userId: text("user_id").notNull(),
  creator: text("creator").default("User"),
  songs: jsonb("songs").default([]), 
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPlaylistSchema = createInsertSchema(playlists).omit({ 
  id: true, 
  createdAt: true 
});

export type Playlist = typeof playlists.$inferSelect;
export type InsertPlaylist = z.infer<typeof insertPlaylistSchema>;

export const iTunesSongSchema = z.object({
  trackId: z.number(),
  trackName: z.string(),
  artistName: z.string(),
  collectionName: z.string().optional(),
  previewUrl: z.string().url(),
  artworkUrl100: z.string().url(),
  trackTimeMillis: z.number().optional(),
});

export type ITunesSong = z.infer<typeof iTunesSongSchema>;
