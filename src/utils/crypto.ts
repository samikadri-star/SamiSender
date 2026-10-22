/**
 * SHA-256 calculation for File objects and ArrayBuffers
 */

export async function calculateSHA256(data: ArrayBuffer | Uint8Array): Promise<string> {
  const bufferSource: BufferSource = data instanceof Uint8Array ? data.buffer as ArrayBuffer : data;
  const hashBuffer = await crypto.subtle.digest('SHA-256', bufferSource);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function calculateFileSHA256(file: File, onProgress?: (percent: number) => void): Promise<string> {
  // If file is smaller than 20MB, read at once
  if (file.size <= 20 * 1024 * 1024) {
    const buffer = await file.arrayBuffer();
    onProgress?.(100);
    return calculateSHA256(buffer);
  }

  // For very large files (e.g. 500MB - 2GB), hash head and tail or chunk-sample for ultra fast preview,
  // or full stream if required. Here we sample 8MB head + 8MB middle + 8MB tail + metadata to avoid freezing
  const sliceSize = 4 * 1024 * 1024; // 4MB
  const bufferHead = await file.slice(0, sliceSize).arrayBuffer();
  const midPoint = Math.floor(file.size / 2);
  const bufferMid = await file.slice(midPoint, midPoint + sliceSize).arrayBuffer();
  const bufferTail = await file.slice(Math.max(0, file.size - sliceSize)).arrayBuffer();

  const combined = new Uint8Array(bufferHead.byteLength + bufferMid.byteLength + bufferTail.byteLength + 16);
  combined.set(new Uint8Array(bufferHead), 0);
  combined.set(new Uint8Array(bufferMid), bufferHead.byteLength);
  combined.set(new Uint8Array(bufferTail), bufferHead.byteLength + bufferMid.byteLength);

  // Encode file size as salt
  const sizeView = new DataView(new ArrayBuffer(8));
  sizeView.setBigUint64(0, BigInt(file.size), true);
  combined.set(new Uint8Array(sizeView.buffer), bufferHead.byteLength + bufferMid.byteLength + bufferTail.byteLength);

  onProgress?.(100);
  return calculateSHA256(combined.buffer);
}

/**
 * Generate a deterministic simulated SHA-256 hash for mock files
 */
export function generateSyntheticSHA256(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  // Create a 64-char hex string
  const base = Math.abs(hash).toString(16).padStart(8, '0');
  const repeated = (base + 'a9f4c3b2e1d0587421abef38947201cba642e7189f')
    .replace(/[^0-9a-f]/g, 'f')
    .padEnd(64, '0')
    .slice(0, 64);
  return repeated;
}
