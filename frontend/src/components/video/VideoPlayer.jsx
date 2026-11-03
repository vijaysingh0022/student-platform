import React, { useState, useRef, useEffect, useCallback } from "react";
import api from "../../services/api.js";

const SPEED_OPTIONS = [0.75, 1, 1.25, 1.5, 2];

/**
 * Extracts YouTube video ID robustly from any standard URL or bare ID
 */
export const extractYouTubeId = (urlOrId) => {
  if (!urlOrId || typeof urlOrId !== "string") return null;
  const clean = urlOrId.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) return clean;

  const match = clean.match(
    /(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/)|youtu\.be\/|youtube-nocookie\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
};

export const VideoPlayer = ({
  video,
  initialPosition = 0,
  onProgressUpdate,
  onVideoCompleted,
  onBookmarkTimestamp,
  currentTopicTitle,
  onSelectAlternativeVideo,
}) => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const progressTimerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(initialPosition || 0);
  const [duration, setDuration] = useState(video?.duration || 522);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [justCompletedToast, setJustCompletedToast] = useState(false);

  // Error, Search & Fallback state
  const [videoLoading, setVideoLoading] = useState(true);
  const [playbackError, setPlaybackError] = useState(null); // null | { code: number, message: string }
  const [retryKey, setRetryKey] = useState(0);

  // In-player search drawer for alternative educational videos
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState(null);

  const isYouTube =
    video?.sourceType === "youtube" ||
    (video?.videoUrl && (video.videoUrl.includes("youtube.com") || video.videoUrl.includes("youtu.be")));

  const youtubeVideoId = isYouTube ? extractYouTubeId(video?.videoUrl) : null;

  // Format seconds -> MM:SS
  const formatTime = (secs) => {
    if (!secs || isNaN(secs) || secs < 0) return "00:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Safe progress update handler
  const reportProgress = useCallback(
    (pos, totalDur) => {
      if (playbackError) return; // Never track progress on broken/unavailable videos
      if (onProgressUpdate) {
        onProgressUpdate(pos, totalDur);
      }
      if (totalDur > 0 && pos / totalDur >= 0.9 && !justCompletedToast) {
        setJustCompletedToast(true);
        if (onVideoCompleted) onVideoCompleted();
      }
    },
    [playbackError, onProgressUpdate, onVideoCompleted, justCompletedToast]
  );

  // ── YouTube IFrame API Integration ──────────────────────────────────────────
  useEffect(() => {
    if (!isYouTube || !youtubeVideoId) {
      setVideoLoading(false);
      return;
    }

    setPlaybackError(null);
    setVideoLoading(true);

    let isSubscribed = true;

    // Load YouTube IFrame Player API script if not already present
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      if (!isSubscribed) return;

      const elementId = `yt-player-container-${retryKey}`;
      const targetElement = document.getElementById(elementId);
      if (!targetElement) return;

      try {
        if (playerRef.current && typeof playerRef.current.destroy === "function") {
          playerRef.current.destroy();
        }

        playerRef.current = new window.YT.Player(elementId, {
          videoId: youtubeVideoId,
          host: "https://www.youtube-nocookie.com",
          playerVars: {
            autoplay: 0,
            controls: 0, // Using LearnX unified custom controls
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            start: Math.floor(initialPosition || 0),
            origin: window.location.origin,
            enablejsapi: 1,
          },
          events: {
            onReady: (event) => {
              if (!isSubscribed) return;
              setVideoLoading(false);
              setPlaybackError(null);
              const dur = event.target.getDuration();
              if (dur && dur > 0) setDuration(dur);
              if (initialPosition > 0) {
                event.target.seekTo(initialPosition, true);
              }
            },
            onStateChange: (event) => {
              if (!isSubscribed) return;
              // YT.PlayerState.PLAYING === 1, PAUSED === 2, ENDED === 0, BUFFERING === 3
              if (event.data === 1) {
                setIsPlaying(true);
                // Start heartbeat timer
                if (progressTimerRef.current) clearInterval(progressTimerRef.current);
                progressTimerRef.current = setInterval(() => {
                  if (playerRef.current && typeof playerRef.current.getCurrentTime === "function") {
                    const curr = playerRef.current.getCurrentTime();
                    const dur = playerRef.current.getDuration() || duration;
                    setCurrentTime(curr);
                    reportProgress(curr, dur);
                  }
                }, 1000);
              } else if (event.data === 2 || event.data === 0) {
                setIsPlaying(false);
                if (progressTimerRef.current) clearInterval(progressTimerRef.current);
                if (event.data === 0) {
                  reportProgress(duration, duration);
                }
              }
            },
            onError: (event) => {
              if (!isSubscribed) return;
              setVideoLoading(false);
              setIsPlaying(false);
              if (progressTimerRef.current) clearInterval(progressTimerRef.current);

              const code = event.data;
              let msg = "This video is currently unavailable on YouTube.";
              if (code === 2) msg = "Invalid YouTube video ID parameter.";
              if (code === 5) msg = "HTML5 player error on YouTube.";
              if (code === 100) msg = "Video unavailable: This video has been removed or marked private.";
              if (code === 101 || code === 150)
                msg = "Video embedding restricted: The owner does not allow this video to be played in embedded players.";

              setPlaybackError({ code, message: msg });
            },
          },
        });
      } catch (err) {
        console.warn("YouTube Player initialization notice:", err);
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        initPlayer();
      };
    }

    return () => {
      isSubscribed = false;
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      if (playerRef.current && typeof playerRef.current.destroy === "function") {
        try {
          playerRef.current.destroy();
        } catch (_) {}
      }
    };
  }, [youtubeVideoId, retryKey, isYouTube, initialPosition, reportProgress, duration]);

  // HTML5 native video handler
  useEffect(() => {
    if (isYouTube) return;
    const v = videoRef.current;
    if (!v) return;

    if (initialPosition > 0 && v.currentTime === 0) {
      v.currentTime = initialPosition;
    }

    const handleLoadedMetadata = () => {
      setVideoLoading(false);
      if (v.duration) setDuration(v.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(v.currentTime);
      const totalDur = v.duration || video?.duration || 522;
      setDuration(totalDur);
      reportProgress(v.currentTime, totalDur);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      reportProgress(duration, duration);
    };

    const handleError = () => {
      setVideoLoading(false);
      setIsPlaying(false);
      setPlaybackError({
        code: 404,
        message: "The video file stream could not be loaded or is corrupted.",
      });
    };

    v.addEventListener("loadedmetadata", handleLoadedMetadata);
    v.addEventListener("timeupdate", handleTimeUpdate);
    v.addEventListener("ended", handleEnded);
    v.addEventListener("error", handleError);

    return () => {
      v.removeEventListener("loadedmetadata", handleLoadedMetadata);
      v.removeEventListener("timeupdate", handleTimeUpdate);
      v.removeEventListener("ended", handleEnded);
      v.removeEventListener("error", handleError);
    };
  }, [isYouTube, initialPosition, video, reportProgress, duration]);

  // Play/Pause toggle
  const togglePlay = () => {
    if (playbackError) return;

    if (isYouTube && playerRef.current) {
      try {
        if (isPlaying) {
          playerRef.current.pauseVideo();
        } else {
          playerRef.current.playVideo();
        }
      } catch (_) {}
    } else if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  // Rewind 10 seconds
  const handleRewind10 = () => {
    const target = Math.max(0, currentTime - 10);
    handleSeek(target);
  };

  // Forward 10 seconds
  const handleForward10 = () => {
    const target = Math.min(duration, currentTime + 10);
    handleSeek(target);
  };

  // Seek bar handler
  const handleSeek = (newTime) => {
    if (playbackError) return;
    setCurrentTime(newTime);
    if (isYouTube && playerRef.current) {
      try {
        playerRef.current.seekTo(newTime, true);
      } catch (_) {}
    } else if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
    reportProgress(newTime, duration);
  };

  // Speed change
  const handleSpeedChange = (rate) => {
    setPlaybackRate(rate);
    if (isYouTube && playerRef.current) {
      try {
        playerRef.current.setPlaybackRate(rate);
      } catch (_) {}
    } else if (videoRef.current) {
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

  const handleRetryPlayback = () => {
    setPlaybackError(null);
    setVideoLoading(true);
    setRetryKey((k) => k + 1);
  };

  // Trigger search for alternative verified videos
  const handlePerformVideoSearch = async (customQuery) => {
    const query = customQuery || searchQuery || currentTopicTitle || video?.title;
    if (!query) return;
    setSearching(true);
    setSearchError(null);
    try {
      const topicIdParam = video?.topicId || "general";
      const res = await api.get(`/learning/topics/${topicIdParam}/video/search?query=${encodeURIComponent(query)}`);
      if (res.data?.results) {
        setSearchResults(res.data.results);
      }
    } catch (err) {
      setSearchError("Failed to search videos. Please try again.");
    } finally {
      setSearching(false);
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
        {/* Loading Spinner */}
        {videoLoading && !playbackError && (
          <div className="absolute inset-0 z-20 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-3 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
            <p className="text-xs font-bold text-slate-300">Connecting video stream...</p>
          </div>
        )}

        {/* Playback Error & Recovery Screen (Section 4) */}
        {playbackError ? (
          <div className="absolute inset-0 z-30 bg-slate-900/95 backdrop-blur-md p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-2xl text-rose-400">
              ⚠️
            </div>
            <div className="space-y-1.5 max-w-md">
              <h3 className="text-base font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Video Playback Notice
              </h3>
              <p className="text-xs text-rose-200/90 leading-relaxed font-medium">
                {playbackError.message}
              </p>
              <p className="text-[11px] text-slate-400">
                You can retry loading, switch to an alternative lecture, or search across YouTube for educational resources.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-1 flex-wrap justify-center">
              <button
                onClick={handleRetryPlayback}
                className="px-4 py-2 rounded-xl text-xs font-black bg-violet-600 hover:bg-violet-500 text-white shadow-md transition-all flex items-center gap-1.5"
              >
                <span>🔄</span> Retry Video
              </button>

              <button
                onClick={() => {
                  setShowSearchModal(true);
                  handlePerformVideoSearch(currentTopicTitle);
                }}
                className="px-4 py-2 rounded-xl text-xs font-black bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all flex items-center gap-1.5"
              >
                <span>🔍</span> Find Alternative Lecture
              </button>

              {video?.videoUrl && (
                <a
                  href={video.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5"
                >
                  <span>↗</span> Watch on YouTube Directly
                </a>
              )}
            </div>
          </div>
        ) : isYouTube ? (
          /* YouTube Embed Container */
          <div className="w-full h-full relative">
            <div id={`yt-player-container-${retryKey}`} className="w-full h-full" />
          </div>
        ) : (
          /* HTML5 Video Element */
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
        {justCompletedToast && !playbackError && (
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

      {/* ── PREMIUM UNIFIED VIDEO PLAYER CONTROLS BAR ── */}
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
              disabled={!!playbackError}
              onChange={(e) => handleSeek(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-700/80 rounded-full appearance-none cursor-pointer accent-violet-500 focus:outline-none disabled:opacity-30"
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
        <div className="flex items-center justify-between gap-3 text-white flex-wrap">
          <div className="flex items-center gap-2">
            {/* Play / Pause */}
            <button
              onClick={togglePlay}
              disabled={!!playbackError}
              className="w-9 h-9 rounded-xl bg-violet-600 hover:bg-violet-500 text-white flex items-center justify-center transition-all shadow-md active:scale-95 disabled:opacity-40"
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
              disabled={!!playbackError}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-40"
              title="Rewind 10 seconds"
            >
              <span className="text-xs font-bold">⏪ 10s</span>
            </button>

            {/* Forward 10s */}
            <button
              onClick={handleForward10}
              disabled={!!playbackError}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-40"
              title="Forward 10 seconds"
            >
              <span className="text-xs font-bold">10s ⏩</span>
            </button>

            {/* Volume toggle */}
            <button
              onClick={() => {
                const nextMuted = !isMuted;
                setIsMuted(nextMuted);
                if (isYouTube && playerRef.current) {
                  try {
                    if (nextMuted) playerRef.current.mute();
                    else playerRef.current.unMute();
                  } catch (_) {}
                } else if (videoRef.current) {
                  videoRef.current.muted = nextMuted;
                }
              }}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? "🔇" : "🔊"}
            </button>
          </div>

          {/* Right Toolbar: Search Alternatives, Speed, Timestamp Bookmark, Fullscreen */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search / Alternate Video button */}
            <button
              onClick={() => {
                setShowSearchModal(true);
                if (searchResults.length === 0) {
                  handlePerformVideoSearch(currentTopicTitle);
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all"
              title="Search and change video lecture"
            >
              <span>🔍</span>
              <span className="hidden sm:inline">Change Video</span>
            </button>

            {/* Bookmark Current Timestamp */}
            {onBookmarkTimestamp && !playbackError && (
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
                  disabled={!!playbackError}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all disabled:opacity-40 ${
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
              ⛶
            </button>
          </div>
        </div>
      </div>

      {/* ── MODAL: SEARCH & SWITCH EDUCATIONAL VIDEO ── */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full p-6 space-y-4 shadow-2xl animate-scale-up text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800">
                  Video Discovery Engine
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-1">
                  Find Educational Videos for "{currentTopicTitle || "Topic"}"
                </h3>
              </div>
              <button
                onClick={() => setShowSearchModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handlePerformVideoSearch()}
                placeholder="Search topic lecture on YouTube..."
                className="flex-1 p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-violet-600"
              />
              <button
                onClick={() => handlePerformVideoSearch()}
                disabled={searching}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50 flex items-center gap-1.5"
              >
                {searching ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <span>🔍</span>}
                <span>Search</span>
              </button>
            </div>

            {searchError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {searchError}
              </div>
            )}

            {/* Results List */}
            <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
              {searching ? (
                <div className="py-12 text-center space-y-2">
                  <div className="w-8 h-8 mx-auto border-3 border-violet-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs font-bold text-slate-600">Verifying video availability with YouTube...</p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  Type a topic name above or click Search to find verified tutorials.
                </div>
              ) : (
                searchResults.map((res) => (
                  <div
                    key={res.id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-violet-300 hover:bg-violet-50/50 transition-all flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={res.thumbnailUrl}
                        alt=""
                        className="w-16 h-11 object-cover rounded-lg shrink-0 bg-slate-200"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-slate-900 truncate">{res.title}</div>
                        <div className="text-[11px] text-slate-500 truncate">{res.author}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (onSelectAlternativeVideo) {
                          onSelectAlternativeVideo(res);
                        }
                        setShowSearchModal(false);
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white shrink-0"
                    >
                      Watch This
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
