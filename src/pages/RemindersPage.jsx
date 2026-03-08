import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, BellRing, Clock, Zap, Coffee, Flame, Sparkles, Plus, X, Volume2, VolumeX,
  Timer, CalendarClock, Brain, Trash2, Check, ChevronRight, AlertTriangle
} from "lucide-react";
import PageTransition from "@/components/PageTransition";
import {
  requestNotificationPermission,
  sendNotification,
  getRandomMessage,
  reminderScheduler,
} from "@/lib/notificationService";
import { toast } from "sonner";

const VIBES = [
  { id: "motivational", label: "⚡ Motivational", icon: Zap, gradient: "from-amber-500/15 to-orange-500/15", border: "border-amber-500/30", text: "text-amber-400", bg: "bg-amber-500" },
  { id: "funny", label: "🎮 Gamer", icon: Sparkles, gradient: "from-purple-500/15 to-pink-500/15", border: "border-purple-500/30", text: "text-purple-400", bg: "bg-purple-500" },
  { id: "chill", label: "🌿 Chill", icon: Coffee, gradient: "from-emerald-500/15 to-teal-500/15", border: "border-emerald-500/30", text: "text-emerald-400", bg: "bg-emerald-500" },
];

const PRESETS = [
  { label: "Every 15 min", minutes: 15, icon: "⚡" },
  { label: "Every 30 min", minutes: 30, icon: "🔔" },
  { label: "Every hour", minutes: 60, icon: "⏰" },
  { label: "Every 2 hours", minutes: 120, icon: "🕐" },
];

const SMART_BREAKS = [
  { label: "Pomodoro (25 min)", studyMin: 25, breakMin: 5, icon: "🍅" },
  { label: "Deep Focus (50 min)", studyMin: 50, breakMin: 10, icon: "🧠" },
  { label: "Sprint (15 min)", studyMin: 15, breakMin: 3, icon: "🏃" },
];

const RemindersPage = () => {
  const [permission, setPermission] = useState("default");
  const [activeVibe, setActiveVibe] = useState("motivational");
  const [scheduledTimes, setScheduledTimes] = useState([]);
  const [newTime, setNewTime] = useState("09:00");
  const [activePreset, setActivePreset] = useState(null);
  const [activeBreak, setActiveBreak] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [previewMessage, setPreviewMessage] = useState(null);
  const [showAddTime, setShowAddTime] = useState(false);

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const handleEnableNotifications = async () => {
    const result = await requestNotificationPermission();
    setPermission(result);
    if (result === "granted") {
      toast.success("Notifications enabled! 🎉");
      sendNotification(activeVibe);
    } else if (result === "denied") {
      toast.error("Notifications blocked. Enable them in browser settings.");
    }
  };

  const handlePreview = () => {
    const msg = getRandomMessage(activeVibe);
    setPreviewMessage(msg);
    if (permission === "granted") {
      sendNotification(activeVibe);
    }
    setTimeout(() => setPreviewMessage(null), 4000);
  };

  const handleAddTime = () => {
    if (!scheduledTimes.includes(newTime)) {
      setScheduledTimes((prev) => [...prev, newTime].sort());
      setShowAddTime(false);
    }
  };

  const handleRemoveTime = (time) => {
    setScheduledTimes((prev) => prev.filter((t) => t !== time));
  };

  const handleActivate = useCallback(() => {
    if (permission !== "granted") {
      toast.error("Enable notifications first!");
      return;
    }
    reminderScheduler.clearAll();

    if (scheduledTimes.length > 0) {
      reminderScheduler.scheduleAtTimes(scheduledTimes, activeVibe);
    }
    if (activePreset !== null) {
      reminderScheduler.scheduleInterval(PRESETS[activePreset].minutes, activeVibe);
    }
    if (activeBreak !== null) {
      reminderScheduler.scheduleSmartBreak(SMART_BREAKS[activeBreak].studyMin);
    }

    setIsActive(true);
    toast.success("Reminders activated! 🚀");
  }, [permission, scheduledTimes, activePreset, activeBreak, activeVibe]);

  const handleDeactivate = () => {
    reminderScheduler.clearAll();
    setIsActive(false);
    toast("Reminders paused ⏸️");
  };

  const currentVibe = VIBES.find((v) => v.id === activeVibe);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-20 md:pt-24 pb-28 px-4">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-2">
              <BellRing className="w-4 h-4" />
              Study Reminders
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">
              Never Miss a <span className="text-primary">Study Sesh</span>
            </h1>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Fun notifications that keep you on track. Pick your vibe, set your schedule, and let the reminders do the rest.
            </p>
          </motion.div>

          {/* Permission Banner */}
          {permission !== "granted" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 p-6"
            >
              <div className="absolute top-3 right-3 opacity-10">
                <Bell className="w-20 h-20 text-primary" />
              </div>
              <div className="relative space-y-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-foreground">Enable Notifications</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Allow browser notifications so we can send you fun study reminders.
                </p>
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={handleEnableNotifications}
                  className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold text-sm shadow-lg shadow-primary/25"
                >
                  Enable Notifications 🔔
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Vibe Selector */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="rounded-2xl border border-border/60 bg-card p-5 space-y-4"
          >
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" /> Choose Your Vibe
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {VIBES.map((vibe) => {
                const active = activeVibe === vibe.id;
                return (
                  <motion.button
                    key={vibe.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveVibe(vibe.id)}
                    className={`relative p-4 rounded-xl border transition-all text-center space-y-1 ${
                      active
                        ? `bg-gradient-to-br ${vibe.gradient} ${vibe.border} shadow-lg`
                        : "border-border/50 bg-muted/30 hover:bg-muted/50"
                    }`}
                  >
                    {active && (
                      <motion.div layoutId="vibe-active"
                        className={`absolute inset-0 rounded-xl bg-gradient-to-br ${vibe.gradient} border ${vibe.border}`}
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className="relative text-2xl block">{vibe.label.split(" ")[0]}</span>
                    <span className={`relative text-xs font-semibold ${active ? vibe.text : "text-muted-foreground"}`}>
                      {vibe.label.split(" ").slice(1).join(" ")}
                    </span>
                  </motion.button>
                );
              })}
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={handlePreview}
              className="w-full py-2.5 rounded-xl border border-border/60 bg-muted/30 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all flex items-center justify-center gap-2"
            >
              <Volume2 className="w-4 h-4" /> Preview Notification
            </motion.button>

            {/* Preview Toast */}
            <AnimatePresence>
              {previewMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className={`rounded-xl border ${currentVibe.border} bg-gradient-to-br ${currentVibe.gradient} p-4 space-y-1`}
                >
                  <p className="font-bold text-foreground text-sm">{previewMessage.title}</p>
                  <p className="text-muted-foreground text-xs">{previewMessage.body}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Quick Presets */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="rounded-2xl border border-border/60 bg-card p-5 space-y-4"
          >
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <Timer className="w-4 h-4 text-primary" /> Quick Presets
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {PRESETS.map((preset, i) => {
                const active = activePreset === i;
                return (
                  <motion.button
                    key={i} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setActivePreset(active ? null : i)}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                      active
                        ? "border-primary/40 bg-primary/10 shadow-md"
                        : "border-border/50 bg-muted/20 hover:bg-muted/40"
                    }`}
                  >
                    <span className="text-xl">{preset.icon}</span>
                    <div>
                      <p className={`text-sm font-semibold ${active ? "text-primary" : "text-foreground"}`}>{preset.label}</p>
                      <p className="text-xs text-muted-foreground">Recurring</p>
                    </div>
                    {active && <Check className="w-4 h-4 text-primary ml-auto" />}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Specific Times */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="rounded-2xl border border-border/60 bg-card p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <CalendarClock className="w-4 h-4 text-primary" /> Scheduled Times
              </h3>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => setShowAddTime(!showAddTime)}
                className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
              >
                {showAddTime ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </motion.button>
            </div>

            <AnimatePresence>
              {showAddTime && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-3 overflow-hidden"
                >
                  <input
                    type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-muted/30 text-foreground text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                  />
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={handleAddTime}
                    className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold"
                  >
                    Add
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {scheduledTimes.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm py-4">No scheduled times yet. Tap + to add one.</p>
            ) : (
              <div className="space-y-2">
                {scheduledTimes.map((time) => (
                  <motion.div key={time} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-muted/20"
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-sm font-semibold text-foreground">
                        {new Date(`2000-01-01T${time}`).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                      onClick={() => handleRemoveTime(time)}
                      className="w-7 h-7 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive hover:bg-destructive/20 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Smart Breaks */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="rounded-2xl border border-border/60 bg-card p-5 space-y-4"
          >
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" /> Smart Breaks
            </h3>
            <p className="text-muted-foreground text-xs">Get reminded to take a break after focused study sessions.</p>
            <div className="space-y-2">
              {SMART_BREAKS.map((brk, i) => {
                const active = activeBreak === i;
                return (
                  <motion.button
                    key={i} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveBreak(active ? null : i)}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                      active
                        ? "border-accent/40 bg-accent/10 shadow-md"
                        : "border-border/50 bg-muted/20 hover:bg-muted/40"
                    }`}
                  >
                    <span className="text-xl">{brk.icon}</span>
                    <div className="flex-1">
                      <p className={`text-sm font-semibold ${active ? "text-accent" : "text-foreground"}`}>{brk.label}</p>
                      <p className="text-xs text-muted-foreground">{brk.studyMin}min study → {brk.breakMin}min break</p>
                    </div>
                    {active && <Check className="w-4 h-4 text-accent" />}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Activate / Deactivate */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            {isActive ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-accent">
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                    className="w-3 h-3 rounded-full bg-accent"
                  />
                  <span className="text-sm font-bold">Reminders Active</span>
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={handleDeactivate}
                  className="w-full py-3.5 rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive font-bold text-sm hover:bg-destructive/20 transition-all flex items-center justify-center gap-2"
                >
                  <VolumeX className="w-4 h-4" /> Pause Reminders
                </motion.button>
              </div>
            ) : (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleActivate}
                disabled={permission !== "granted"}
                className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <BellRing className="w-4 h-4" /> Activate Reminders 🚀
              </motion.button>
            )}
          </motion.div>

        </div>
      </div>
    </PageTransition>
  );
};

export default RemindersPage;
