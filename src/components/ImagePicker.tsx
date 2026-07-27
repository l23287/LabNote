import { useRef, useState } from "react";
import { Camera, X } from "lucide-react";
import { fileToCompressedDataUrl } from "../lib/images";

const MAX_IMAGES = 4;

export function ImagePicker({
  images,
  onChange,
}: {
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setError("");
    setLoading(true);
    try {
      const remaining = MAX_IMAGES - images.length;
      const files = Array.from(fileList).slice(0, Math.max(remaining, 0));
      const dataUrls = await Promise.all(files.map(fileToCompressedDataUrl));
      onChange([...images, ...dataUrls]);
    } catch {
      setError("Foto konnte nicht hinzugefügt werden.");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function remove(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-3">
        {images.map((src, i) => (
          <div key={i} className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0">
            <img src={src} alt="" className="w-full h-full object-cover" />
            <button
              onClick={() => remove(i)}
              type="button"
              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white"
              aria-label="Foto entfernen"
            >
              <X size={13} />
            </button>
          </div>
        ))}

        {images.length < MAX_IMAGES && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={loading}
            className="w-20 h-20 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 text-muted-2 shrink-0 disabled:opacity-50"
          >
            <Camera size={18} />
            <span className="text-[10px]">{loading ? "Lädt…" : "Foto"}</span>
          </button>
        )}
      </div>

      {error && <p className="text-danger text-xs">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
