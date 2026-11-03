import React, { useState, useRef, useEffect } from "react";

const SPEED_OPTIONS = [0.75, 1, 1.25, 1.5, 2];

export const VideoPlayer = ({
  video,
  initialPosition = 0,
  onProgressUpdate,
  onVideoCompleted,
  onBookmarkTimestamp,
  currentTopicTitle,
}) => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const iframeRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(initialPosition || 0);
  const [duration, setDuration] = useState(video?.duration || 522);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [justCompletedToast, setJustCompletedToast] = useState(false);

  // Determine if it's YouTube or direct HTML5 video
  const isYouTube =
    video?.sourceType === "youtube" ||
    (video?.videoUrl && (video.videoUrl.includes("youtube.com") || video.videoUrl.includes("youtu.be")));

  const getYouTubeEmbedUrl = (url, startSec = 0) => {
    let videoId = "3EJlovevfcA";
    if (url) {
      if (url.includes("v=")) {
        videoId = url.split("v=")[1]?.split("&")[0];
      } else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1]?.split("?")[0];
      }
    }
    const startParam = startSec > 0 ? `&start=${Math.floor(startSec)}` : "";
    return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=0&rel=0&modestbranding=1${startParam}`;
  };

  // Format seconds -> MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // HTML5 Video event listeners
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (initialPosition > 0 && v.currentTime === 0) {
      v.currentTime = initialPosition;
    }

    const handleTimeUpdate = () => {
      setCurrentTime(v.currentTime);
      const totalDur = v.duration || video.duration || 522;
      setDuration(totalDur);

      // Report progress to parent
      if (onProgressUpdate) {
        onProgressUpdate(v.currentTime, totalDur);
      }

      // Check 90% threshold for completion
      if (totalDur > 0 && v.currentTime / totalDur >= 0.9) {
        if (!justCompletedToast) {
          setJustCompletedToast(true);
          if (onVideoCompleted) onVideoCompleted();
        }
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setJustCompletedToast(true);
      if (onVideoCompleted) onVideoCompleted();
    };

    v.addEventListener("timeupdate", handleTimeUpdate);
    v.addEventListener("ended", handleEnded);

    return () => {
      v.removeEventListener("timeupdate", handleTimeUpdate);
      v.removeEventListener("ended", handleEnded);
    };
  }, [initialPosition, video, onProgressUpdate, onVideoCompleted, justCompletedToast]);

  // Periodic heartbeat for YouTube simulator timer
  useEffect(() => {
    if (!isYouTube || !isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        const next = Math.min(prev + 1, duration);
        if (onProgressUpdate) onProgressUpdate(next, duration);

        if (duration > 0 && next / duration >= 0.9 && !justCompletedToast) {
          setJustCompletedToast(true);
          if (onVideoCompleted) onVideoCompleted();
        }
        return next;
      });
    }, 1000 / playbackRate);

    return () => clearInterval(interval);
  }, [isYouTube, isPlaying, duration, playbackRate, onProgressUpdate, onVideoCompleted, justCompletedToast]);

  // Play/Pause toggle
  const togglePlay = () => {
    if (isYouTube) {
      setIsPlaying(!isPlaying);
    } else if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Seek forward / rewind
  const handleSeek = (seconds) => {
    const target = Math.max(0, Math.min(seconds, duration));
    setCurrentTime(target);
    if (!isYouTube && videoRef.current) {
      videoRef.current.currentTime = target;
    }
    if (onProgressUpdate) onProgressUpdate(target, duration);
  };

  const handleRewind10 = () => handleSeek(currentTime - 10);
  const handleForward10 = () => handleSeek(currentTime + 10);

  // Speed change
  const handleSpeedChange = (rate) => {
    setPlaybackRate(rate);
    if (!isYouTube && videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const completionPct = duration > 0 ? Math.min(100, Math.round((currentTime / duration) * 100)) : 0;

  return (
    <div
      ref={containerRef}
      className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl group select-none"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* ── VIDEO DISPLAY SCREEN ── */}
      <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden">
        {isYouTube ? (
          <iframe
            ref={iframeRef}
            src={getYouTubeEmbedUrl(video?.videoUrl, initialPosition)}
            title={video?.title || "Topic Video"}
            className="w-full h-full border-0 pointer-events-auto"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <video
            ref={videoRef}
            src={video?.videoUrl}
            poster={video?.thumbnailUrl}
            className="w-full h-full object-contain cursor-pointer"
            onClick={togglePlay}
            playsInline
          />
        )}

        {/* Completion Milestone Toast */}
        {justCompletedToast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-emerald-500/95 text-white backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-bounce border border-emerald-400">
            <span>🎉</span>
            <span>Video Completed! Topic marked as finished (+20 XP).</span>
            <button
              onClick={() => setJustCompletedToast(false)}
              className="ml-2 hover:bg-emerald-600/50 p-1 rounded-lg text-[10px]"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* ── PREMIUM VIDEO PLAYER CONTROLS BAR ── */}
      <div
        className={`bg-slate-900/95 backdrop-blur-md px-4 sm:px-6 py-3 border-t border-slate-800 transition-opacity duration-300 ${
          showControls || !isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Progress Bar & Seek Slider */}
        <div className="flex items-center gap-3 mb-2">
          <span className="text-[11px] font-mono text-slate-400 font-bold w-12 text-right">
            {formatTime(currentTime)}
          </span>

          <div className="relative flex-1 group/bar py-1 cursor-pointer">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={(e) => handleSeek(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-700/80 rounded-full appearance-none cursor-pointer accent-violet-500 focus:outline-none"
            />
            {/* Visual gradient fill */}
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-gradient-to-r from-violet-600 via-indigo-500 to-sky-400 rounded-full pointer-events-none"
              style={{ width: `${completionPct}%` }}
            />
          </div>

          <span className="text-[11px] font-mono text-slate-400 font-bold w-12">
            {formatTime(duration)}
          </span>
        </div>

        {/* Action Controls & Speed Selector */}
        <div className="flex items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-2">
            {/* Play / Pause */}
            <button
              onClick={togglePlay}
              className="w-9 h-9 rounded-xl bg-violet-600 hover:bg-violet-500 text-white flex items-center justify-center transition-all shadow-md active:scale-95"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Rewind 10s */}
            <button
              onClick={handleRewind10}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Rewind 10 seconds"
            >
              <span className="text-xs font-bold">⏪ 10s</span>
            </button>

            {/* Forward 10s */}
            <button
              onClick={handleForward10}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Forward 10 seconds"
            >
              <span className="text-xs font-bold">10s ⏩</span>
            </button>

            {/* Volume toggle */}
            <button
              onClick={() => {
                const nextMuted = !isMuted;
                setIsMuted(nextMuted);
                if (videoRef.current) videoRef.current.muted = nextMuted;
              }}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? "🔇" : "🔊"}
            </button>
          </div>

          {/* Right Toolbar: Speed, Timestamp Bookmark, Fullscreen */}
          <div className="flex items-center gap-2">
            {/* Bookmark Current Timestamp */}
            {onBookmarkTimestamp && (
              <button
                onClick={() => onBookmarkTimestamp(currentTime, formatTime(currentTime))}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-amber-400 border border-slate-700/80 text-xs font-bold transition-all"
                title="Bookmark current timestamp"
              >
                <span>🔖</span>
                <span>{formatTime(currentTime)}</span>
              </button>
            )}

            {/* Playback Speed dropdown/pills */}
            <div className="flex items-center bg-slate-800/90 rounded-xl p-0.5 border border-slate-700/80 text-xs">
              {SPEED_OPTIONS.map((rate) => (
                <button
                  key={rate}
                  onClick={() => handleSpeedChange(rate)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    playbackRate === rate
                      ? "bg-violet-600 text-white shadow-xs"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? "⛶" : "⛶"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
