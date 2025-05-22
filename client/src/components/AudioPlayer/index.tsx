import { useRef, useEffect, useCallback, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { Play, Pause, X } from "lucide-react";

interface AudioPlayerProps {
  src: string;
  id: string;
  onRemove?: () => void;
}

export function AudioPlayer({ src, id, onRemove }: AudioPlayerProps) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const wsRef = useRef<WaveSurfer | null>(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!waveformRef.current || !audioRef.current) return;
    setError(false);

    const audioEl = audioRef.current;
    const handleAudioError = () => setError(true);
    audioEl.addEventListener("error", handleAudioError);

    const ws = WaveSurfer.create({
      container: waveformRef.current,
      backend: "MediaElement",
      media: audioEl,
      url: src,
      waveColor: "#CBD5E1",
      progressColor: "#1E40AF",
      cursorColor: "#1E40AF",
      height: 48,
      barWidth: 2,
      normalize: true,
      interact: true,
    });

    wsRef.current = ws;
    ws.on("play", () => setPlaying(true));
    ws.on("pause", () => setPlaying(false));
    ws.on("error", () => setError(true));

    return () => {
      audioEl.removeEventListener("error", handleAudioError);
      ws.destroy();
      wsRef.current = null;
    };
  }, [src]);

  const togglePlay = useCallback(() => {
    if (!wsRef.current || error) return;
    wsRef.current.playPause();
  }, [error]);

  if (error) {
    return (
      <div
        className="alert alert-error flex items-center justify-between"
        data-testid={`audio-error-${id}`}
      >
        <span>File is corrupted</span>
        {onRemove && (
          <button
            className="btn btn-xs btn-ghost btn-error btn-circle"
            onClick={onRemove}
            data-testid={`delete-track-${id}`}
            aria-label="Remove audio"
          >
            <X size={12} />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2" data-testid={`audio-player-${id}`}>
      <audio
        ref={audioRef}
        src={src}
        preload="auto"
        className="hidden"
        data-testid={`audio-element-${id}`}
      />

      <button
        type="button"
        onClick={togglePlay}
        data-testid={playing ? `pause-button-${id}` : `play-button-${id}`}
        className="btn btn-xs btn-outline"
        aria-label={playing ? "Pause" : "Play"}
      >
        {playing ? <Pause size={16} /> : <Play size={16} />}
      </button>

      <div
        ref={waveformRef}
        className="flex-1 min-w-36 overflow-hidden cursor-pointer"
        data-testid={`audio-progress-${id}`}
      />

      {onRemove && (
        <button
          type="button"
          className="btn btn-xs btn-circle btn-error btn-ghost"
          onClick={onRemove}
          data-testid={`delete-track-${id}`}
          aria-label="Remove audio"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
}
