export function trackIdToUUID(trackId: number): string {
  const padded = trackId.toString().padStart(12, '0');
  return `00000000-0000-0000-0000-${padded}`;
}

export function uuidToTrackId(uuid: string): number {
  const segments = uuid.split('-');
  return parseInt(segments[segments.length - 1], 10);
}
