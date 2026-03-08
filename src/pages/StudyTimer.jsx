import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, AlertTriangle } from "lucide-react";
import PageTransition from "@/components/PageTransition";
const StudyTimer = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [isTabActive, setIsTabActive] = useState(true);
  const [warnings, setWarnings] = useState([]);
  const intervalRef = useRef(null);

  const formatTime = (s) => {
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && isRunning) {
        setIsTabActive(false);
        setTabSwitchCount((c) => c + 1);
        setWarnings((w) => [...w, `⚠️ Tab switch detected at ${formatTime(seconds)}`]);
        setIsPaused(true);
      } else {
        setIsTabActive(true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [isRunning, seconds]);

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, isPaused]);

  const handleStart = () => { setIsRunning(true); setIsPaused(false); };
  const handlePause = () => setIsPaused(true);
  const handleResume = () => setIsPaused(false);
  const handleReset = () => { setIsRunning(false); setIsPaused(false); setSeconds(0); setTabSwitchCount(0); setWarnings([]); };

  const earnedPoints = Math.floor(seconds / 60) * 2;
  const earnedHours = (seconds / 3600).toFixed(2);
  const progressDeg = (seconds % 60) * 6;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-display font-extrabold text-foreground">⏱️ Focus Timer</h1>
          <p className="text-muted-foreground text-sm mt-1">Stay focused. Earn XP. Climb ranks.</p>
        </div>

        {/* Timer Circle */}
        <div className="flex justify-center">
          <div className="relative w-64 h-64">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 256 256">
              <circle cx="128" cy="128" r="120" fill="none" stroke="hsl(220, 15%, 90%)" strokeWidth="8" />
              <circle
                cx="128" cy="128" r="120" fill="none"
                stroke={isPaused ? "hsl(25, 90%, 55%)" : "hsl(220, 80%, 55%)"}
                strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${(progressDeg / 360) * 754} 754`}
                className="transition-all duration-300"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-5xl font-display font-bold text-foreground tracking-widest">{formatTime(seconds)}</p>
              <p className="text-sm text-muted-foreground mt-2">
                {isPaused ? "⏸ Paused" : isRunning ? "🟢 Studying" : "Ready"}
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {!isRunning ? (
            <button onClick={handleStart} className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-xl font-display font-bold hover:opacity-90 transition-all glow-primary">
              <Play className="w-5 h-5" /> Start
            </button>
          ) : (
            <>
              {isPaused ? (
                <button onClick={handleResume} className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-display font-bold hover:opacity-90 transition-all">
                  <Play className="w-5 h-5" /> Resume
                </button>
              ) : (
                <button onClick={handlePause} className="flex items-center gap-2 bg-neon-orange text-primary-foreground px-6 py-3 rounded-xl font-display font-bold hover:opacity-90 transition-all">
                  <Pause className="w-5 h-5" /> Pause
                </button>
              )}
              <button onClick={handleReset} className="flex items-center gap-2 bg-secondary text-foreground px-6 py-3 rounded-xl font-medium hover:bg-secondary/80 transition-all">
                <RotateCcw className="w-5 h-5" /> Reset
              </button>
            </>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="glass rounded-xl p-3 text-center soft-shadow">
            <p className="text-xl font-display font-bold text-primary">{earnedPoints}</p>
            <p className="text-xs text-muted-foreground">XP Earned</p>
          </div>
          <div className="glass rounded-xl p-3 text-center soft-shadow">
            <p className="text-xl font-display font-bold text-accent">{earnedHours}h</p>
            <p className="text-xs text-muted-foreground">Hours</p>
          </div>
          <div className="glass rounded-xl p-3 text-center soft-shadow">
            <p className={`text-xl font-display font-bold ${tabSwitchCount > 0 ? "text-destructive" : "text-primary"}`}>{tabSwitchCount}</p>
            <p className="text-xs text-muted-foreground">Tab Switches</p>
          </div>
        </div>

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="glass rounded-xl p-4 border-destructive/30 soft-shadow">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <p className="text-sm font-semibold text-destructive">Focus Warnings</p>
            </div>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {warnings.map((w, i) => (
                <p key={i} className="text-xs text-muted-foreground">{w}</p>
              ))}
            </div>
            <p className="text-xs text-destructive/70 mt-2">Timer pauses when you switch tabs to prevent unfair XP gains.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyTimer;
