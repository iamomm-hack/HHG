const imageCache = new Map<string, Promise<HTMLImageElement>>();

export function loadBrowserImage(src: string, cache = false): Promise<HTMLImageElement> {
  const load = () => new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(src.startsWith("/templates/") ? "The Builder Card template could not be loaded." : "The uploaded photo could not be decoded."));
    image.src = src;
  });
  if (!cache) return load();
  const existing = imageCache.get(src);
  if (existing) return existing;
  const promise = load().catch((error) => { imageCache.delete(src); throw error; });
  imageCache.set(src, promise);
  return promise;
}
