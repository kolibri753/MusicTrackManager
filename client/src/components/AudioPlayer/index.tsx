import { useRef, useState, useEffect } from "react";
import { Play, Pause, X } from "lucide-react";

interface AudioPlayerProps {
  src: string;
  id: string;
  onRemove?: () => void;
}

export function AudioPlayer({ src, id, onRemove }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onLoadedMeta = () => setDuration(audio.duration);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMeta);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMeta);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    playing ? audio.pause() : audio.play();
  };

  return (
    <div
      className="relative flex items-center gap-1"
      data-testid={`audio-player-${id}`}
    >
      <audio ref={audioRef} src={src} className="hidden" />

      <button
        type="button"
        onClick={togglePlay}
        data-testid={playing ? `pause-button-${id}` : `play-button-${id}`}
        className="btn btn-xs"
        aria-label={playing ? "Pause" : "Play"}
      >
        {playing ? <Pause size={16} /> : <Play size={16} />}
      </button>

      <input
        type="range"
        min={0}
        max={duration || 1}
        step={0.01}
        value={progress}
        onChange={(e) => {
          const audio = audioRef.current!;
          const seek = parseFloat(e.currentTarget.value);
          audio.currentTime = seek;
          setProgress(seek);
        }}
        data-testid={`audio-progress-${id}`}
        className="range range-xs range-primary flex-1"
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
