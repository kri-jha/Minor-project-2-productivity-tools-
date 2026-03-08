import { useState } from "react";
import { mockTodos } from "@/lib/mockData";
import { Plus, Trash2, CheckCircle, Circle, Sparkles, Swords, Shield, Trophy, Zap, Target, Flame } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { motion, AnimatePresence } from "framer-motion";

const QUEST_RARITIES = ["Common", "Rare", "Epic", "Legendary"];
const RARITY_STYLES = {
  Common: {
    border: "border-slate-300/30",
    bg: "from-slate-500/5 to-transparent",
    badge: "bg-slate-500/10 text-slate-600",
    glow: "",
    xp: 25,
  },
  Rare: {
    border: "border-blue-400/30",
    bg: "from-blue-500/5 to-transparent",
    badge: "bg-blue-500/10 text-blue-600",
    glow: "hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]",
    xp: 50,
  },
  Epic: {
    border: "border-purple-400/30",
    bg: "from-purple-500/8 to-transparent",
    badge: "bg-purple-500/10 text-purple-600",
    glow: "hover:shadow-[0_0_25px_rgba(147,51,234,0.12)]",
    xp: 100,
  },
  Legendary: {
    border: "border-amber-400/40",
    bg: "from-amber-500/8 to-transparent",
    badge: "bg-amber-500/10 text-amber-600",
    glow: "hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]",
    xp: 200,
  },
};

const getRarity = (idx) => QUEST_RARITIES[idx % QUEST_RARITIES.length];

const getProgressColor = (pct) => {
  if (pct >= 80) return "from-emerald-500 to-green-400";
  if (pct >= 50) return "from-blue-500 to-cyan-400";
  if (pct >= 25) return "from-amber-500 to-orange-400";
  return "from-red-500 to-rose-400";
};

const getProgressGlow = (pct) => {
  if (pct >= 80) return "shadow-[0_0_8px_rgba(16,185,129,0.4)]";
  if (pct >= 50) return "shadow-[0_0_8px_rgba(59,130,246,0.3)]";
  if (pct >= 25) return "shadow-[0_0_8px_rgba(245,158,11,0.3)]";
  return "";
};

const FloatingParticle = ({ delay, x }) => (
  <motion.div
    className="absolute w-1 h-1 rounded-full bg-primary/40"
    initial={{ opacity: 0, y: 0 }}
    animate={{ opacity: [0, 0.8, 0], y: -30, x: (Math.random() - 0.5) * 20 }}
    transition={{ duration: 2.5, delay, repeat: Infinity, repeatDelay: Math.random() * 3 }}
    style={{ left: `${x}%`, bottom: "30%" }}
  />
);

const TodoPage = () => {
  const [tasks, setTasks] = useState(
    mockTodos.map((t, i) => ({ ...t, rarity: getRarity(i) }))
  );
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [selectedRarity, setSelectedRarity] = useState("Common");
  const [filter, setFilter] = useState("all"); // all, active, completed

  const addTask = () => {
    if (!newTitle.trim()) return;
    const task = {
      id: Date.now().toString(),
      title: newTitle,
      description: newDesc,
      percentage: 0,
      createdAt: new Date().toISOString(),
      rarity: selectedRarity,
    };
    setTasks([task, ...tasks]);
    setNewTitle("");
    setNewDesc("");
  };

  const updatePercentage = (id, value) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, percentage: Math.min(100, Math.max(0, value)) } : t)));
  };

  const removeTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "active") return t.percentage < 100;
    if (filter === "completed") return t.percentage === 100;
    return true;
  });

  const overallPercentage = tasks.length > 0
    ? Math.round(tasks.reduce((s, t) => s + t.percentage, 0) / tasks.length)
    : 0;

  const completedCount = tasks.filter((t) => t.percentage === 100).length;
  const totalXP = tasks
    .filter((t) => t.percentage === 100)
    .reduce((s, t) => s + (RARITY_STYLES[t.rarity]?.xp || 25), 0);

  const circumference = 2 * Math.PI * 46;
  const strokeDash = (overallPercentage / 100) * circumference;

  return (
    <PageTransition>
      <div className="min-h-screen p-4 md:p-8 pt-20 max-w-4xl mx-auto space-y-6">

        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center relative"
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-full px-4 py-1.5 mb-3"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Swords className="w-3.5 h-3.5 text-primary" />
            <span className="text-[11px] font-bold text-primary uppercase tracking-widest">Quest Board</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-display font-black text-foreground tracking-tight">
            Daily Quests
          </h1>
          <p className="text-muted-foreground text-sm mt-2 max-w-md mx-auto">
            Complete quests to earn XP and build your streak. Higher rarity = more rewards.
          </p>
        </motion.div>

        {/* Stats Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass rounded-2xl soft-shadow overflow-hidden"
        >
          <div className="relative p-6">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-60 h-60 bg-gradient-to-bl from-primary/[0.04] to-transparent rounded-full -translate-y-20 translate-x-20" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-emerald-500/[0.04] to-transparent rounded-full translate-y-10 -translate-x-10" />
            
            <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
              {/* Circular Progress */}
              <div className="relative w-32 h-32 shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {/* Track */}
                  <circle cx="50" cy="50" r="46" fill="none" stroke="hsl(var(--secondary))" strokeWidth="6" />
                  {/* Progress */}
                  <motion.circle
                    cx="50" cy="50" r="46" fill="none"
                    stroke={overallPercentage >= 80 ? "hsl(160, 60%, 45%)" : overallPercentage >= 50 ? "hsl(var(--primary))" : "hsl(25, 90%, 55%)"}
                    strokeWidth="6" strokeLinecap="round"
                    initial={{ strokeDasharray: `0 ${circumference}` }}
                    animate={{ strokeDasharray: `${strokeDash} ${circumference}` }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span
                    className="text-3xl font-display font-black text-foreground"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                  >
                    {overallPercentage}%
                  </motion.span>
                  <span className="text-[9px] text-muted-foreground font-semibold uppercase tracking-widest">Progress</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex-1 grid grid-cols-3 gap-4 w-full">
                {[
                  { icon: Target, label: "Quests", value: `${completedCount}/${tasks.length}`, color: "text-primary", bg: "bg-primary/10" },
                  { icon: Zap, label: "XP Earned", value: totalXP, color: "text-amber-500", bg: "bg-amber-500/10" },
                  { icon: Flame, label: "Streak Color", value: overallPercentage >= 75 ? "🟢" : overallPercentage >= 50 ? "🟡" : overallPercentage >= 25 ? "🟠" : "⚫", color: "text-orange-500", bg: "bg-orange-500/10" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    className="text-center"
                  >
                    <div className={`inline-flex p-2 rounded-xl ${stat.bg} mb-1.5`}>
                      <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                    <p className="text-xl font-display font-black text-foreground">{stat.value}</p>
                    <p className="text-[9px] text-muted-foreground font-semibold uppercase tracking-widest">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Add Quest Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass rounded-2xl p-5 soft-shadow relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-display font-bold text-foreground">New Quest</h3>
          </div>

          <div className="space-y-3">
            <input
              type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter quest objective..."
              className="w-full bg-secondary/80 text-foreground rounded-xl px-4 py-3 text-sm font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border/50 transition-all"
              onKeyDown={(e) => e.key === "Enter" && addTask()}
            />
            <input
              type="text" value={newDesc} onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Quest details (optional)..."
              className="w-full bg-secondary/50 text-foreground rounded-xl px-4 py-2.5 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 border border-border/30"
            />
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {/* Rarity selector */}
              <div className="flex gap-1.5 flex-1">
                {QUEST_RARITIES.map((r) => (
                  <button
                    key={r}
                    onClick={() => setSelectedRarity(r)}
                    className={`relative px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                      selectedRarity === r
                        ? `${RARITY_STYLES[r].badge} ring-1 ring-current`
                        : "text-muted-foreground hover:text-foreground bg-secondary/50"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={addTask}
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 py-2.5 rounded-xl font-display font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow"
              >
                <Plus className="w-4 h-4" /> Add Quest
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5 bg-secondary/80 rounded-xl p-1 border border-border/40">
            {[
              { key: "all", label: "All" },
              { key: "active", label: "Active" },
              { key: "completed", label: "Done" },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className="relative px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
              >
                {filter === f.key && (
                  <motion.div
                    layoutId="quest-filter"
                    className="absolute inset-0 bg-foreground rounded-lg"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}
                <span className={`relative z-10 ${filter === f.key ? "text-background" : "text-muted-foreground"}`}>
                  {f.label}
                </span>
              </button>
            ))}
          </div>
          <span className="text-xs text-muted-foreground ml-auto font-medium">
            {filteredTasks.length} quest{filteredTasks.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Quest List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredTasks.map((task, idx) => {
              const rarity = RARITY_STYLES[task.rarity] || RARITY_STYLES.Common;
              const isComplete = task.percentage === 100;

              return (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, x: -20 }}
                  transition={{ delay: idx * 0.03 }}
                  className={`relative glass rounded-2xl p-5 transition-all soft-shadow border ${rarity.border} ${rarity.glow} overflow-hidden group ${
                    isComplete ? "opacity-70" : ""
                  }`}
                >
                  {/* Rarity gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${rarity.bg} pointer-events-none`} />

                  {/* Completion particles */}
                  {isComplete && (
                    <>
                      {[...Array(4)].map((_, i) => (
                        <FloatingParticle key={i} delay={i * 0.5} x={20 + i * 20} />
                      ))}
                    </>
                  )}

                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <motion.button
                          whileTap={{ scale: 0.8 }}
                          onClick={() => updatePercentage(task.id, isComplete ? 0 : 100)}
                          className="mt-0.5 shrink-0"
                        >
                          {isComplete ? (
                            <motion.div initial={{ rotate: -90, scale: 0 }} animate={{ rotate: 0, scale: 1 }}>
                              <CheckCircle className="w-5 h-5 text-emerald-500" />
                            </motion.div>
                          ) : (
                            <Circle className="w-5 h-5 text-muted-foreground/50 hover:text-primary transition-colors" />
                          )}
                        </motion.button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className={`font-display font-bold text-sm ${isComplete ? "line-through text-muted-foreground" : "text-foreground"}`}>
                              {task.title}
                            </p>
                            <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${rarity.badge}`}>
                              {task.rarity}
                            </span>
                          </div>
                          {task.description && (
                            <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
                          )}
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeTask(task.id)}
                        className="text-muted-foreground/30 hover:text-destructive transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex-1 h-2.5 rounded-full bg-secondary/80 overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(task.percentage)} ${getProgressGlow(task.percentage)}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${task.percentage}%` }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <input
                          type="number" min={0} max={100} value={task.percentage}
                          onChange={(e) => updatePercentage(task.id, parseInt(e.target.value) || 0)}
                          className="w-12 bg-secondary/80 text-foreground text-center rounded-lg px-1 py-1 text-xs font-display font-bold focus:outline-none focus:ring-1 focus:ring-primary/50 border border-border/30"
                        />
                        <span className="text-[10px] text-muted-foreground font-bold">%</span>
                      </div>
                    </div>

                    {/* Completion reward */}
                    <AnimatePresence>
                      {isComplete && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-center gap-2 mt-3 overflow-hidden"
                        >
                          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full">
                            <Sparkles className="w-3 h-3" /> Quest Complete!
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold bg-amber-500/10 px-2.5 py-1 rounded-full">
                            <Zap className="w-3 h-3" /> +{rarity.xp} XP
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredTasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="text-5xl mb-4"
            >
              {filter === "completed" ? "🏆" : "⚔️"}
            </motion.div>
            <p className="font-display font-bold text-foreground text-lg">
              {filter === "completed" ? "No quests completed yet" : filter === "active" ? "All quests completed!" : "No quests yet"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {filter === "completed" ? "Complete some quests to see them here" : filter === "active" ? "Amazing work! Add more quests above" : "Add your first quest above to get started"}
            </p>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
};

export default TodoPage;
