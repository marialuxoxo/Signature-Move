import { pickColors } from "./colors";

/** Lädt eine Bildadresse als HTMLImageElement. */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Bild ließ sich nicht öffnen"));
    img.src = src;
  });
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

/** Liest die prägenden Farben aus einem Bild. */
export function extractColors(img: HTMLImageElement): string[] {
  const size = 96;
  const w = img.naturalWidth || size;
  const h = img.naturalHeight || size;
  const k = Math.min(1, size / Math.max(w, h));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(w * k));
  canvas.height = Math.max(1, Math.round(h * k));
  const ctx = canvas.getContext("2d");
  if (!ctx) return [];
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  try {
    return pickColors(ctx.getImageData(0, 0, canvas.width, canvas.height).data);
  } catch {
    return [];
  }
}

/** Wandelt ein Bild in ein PNG (Base64 ohne Präfix) um, z. B. für den KI-Check. */
export function toPngBase64(img: HTMLImageElement, maxSide = 600): string | null {
  const w = img.naturalWidth || maxSide;
  const h = img.naturalHeight || Math.round(maxSide / 3);
  const k = Math.min(1, maxSide / Math.max(w, h));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(w * k);
  canvas.height = Math.round(h * k);
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  try {
    return canvas.toDataURL("image/png").split(",")[1] ?? null;
  } catch {
    return null;
  }
}

/** Bietet einen Text als Datei zum Herunterladen an. */
export function downloadFile(filename: string, content: string, mime: string): void {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Kopiert HTML so, dass es in Outlook oder Gmail formatiert eingefügt wird. */
export async function copyHtml(html: string): Promise<boolean> {
  const plain = new DOMParser().parseFromString(html, "text/html").body.innerText;
  try {
    if (window.ClipboardItem && navigator.clipboard?.write) {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([plain], { type: "text/plain" }),
        }),
      ]);
      return true;
    }
  } catch {
    /* weiter mit dem Ausweichweg */
  }
  return false;
}
