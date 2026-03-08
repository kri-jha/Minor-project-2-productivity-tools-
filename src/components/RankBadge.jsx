import { getRank, getRankProgress, getNextRank } from "@/lib/ranks";
import { motion } from "framer-motion";

const TIER_STYLES = {
  Bronze: {
    gradient: "from-amber-700 via-amber-600 to-yellow-700",
    glow: "shadow-[0_0_20px_rgba(180,83,9,0.4)]",
    text: "text-amber-200",
    accent: "bg-amber-500/20",
    bar: "from-amber-700 to-amber-500",
    icon: "⚔️",
    border: "border-amber-600/50",
  },
  Silver: {
    gradient: "from-slate-400 via-gray-300 to-slate-500",
    glow: "shadow-[0_0_20px_rgba(148,163,184,0.4)]",
    text: "text-slate-100",
    accent: "bg-slate-400/20",
    bar: "from-slate-500 to-slate-300",
    icon: "🛡️",
    border: "border-slate-400/50",
  },
  Gold: {
    gradient: "from-yellow-500 via-amber-400 to-yellow-600",
    glow: "shadow-[0_0_25px_rgba(234,179,8,0.5)]",
    text: "text-yellow-100",
    accent: "bg-yellow-400/20",
    bar: "from-yellow-600 to-yellow-400",
    icon: "⚜️",
    border: "border-yellow-500/50",
  },
  Platinum: {
    gradient: "from-cyan-400 via-teal-300 to-emerald-400",
    glow: "shadow-[0_0_25px_rgba(34,211,238,0.4)]",
    text: "text-cyan-100",
    accent: "bg-cyan-400/20",
    bar: "from-teal-500 to-cyan-400",
    icon: "💎",
    border: "border-cyan-400/50",
  },
  Diamond: {
    gradient: "from-blue-400 via-indigo-400 to-violet-500",
    glow: "shadow-[0_0_30px_rgba(99,102,241,0.5)]",
    text: "text-blue-100",
    accent: "bg-indigo-400/20",
    bar: "from-indigo-500 to-blue-400",
    icon: "💠",
    border: "border-indigo-400/50",
  },
  Crown: {
    gradient: "from-purple-500 via-fuchsia-500 to-pink-500",
    glow: "shadow-[0_0_35px_rgba(168,85,247,0.5)]",
    text: "text-purple-100",
    accent: "bg-purple-400/20",
    bar: "from-purple-600 to-fuchsia-400",
    icon: "👑",
    border: "border-purple-400/50",
  },
  Ace: {
    gradient: "from-orange-500 via-red-500 to-rose-600",
    glow: "shadow-[0_0_35px_rgba(239,68,68,0.5)]",
    text: "text-orange-100",
    accent: "bg-red-400/20",
    bar: "from-red-600 to-orange-400",
    icon: "🔥",
    border: "border-red-500/50",
  },
  "Ace Master": {
    gradient: "from-red-600 via-rose-500 to-pink-600",
    glow: "shadow-[0_0_40px_rgba(225,29,72,0.6)]",
    text: "text-red-100",
    accent: "bg-rose-400/20",
    bar: "from-rose-600 to-red-400",
    icon: "⚡",
    border: "border-rose-500/50",
  },
  Conqueror: {
    gradient: "from-yellow-400 via-amber-300 to-yellow-500",
    glow: "shadow-[0_0_50px_rgba(250,204,21,0.6),0_0_100px_rgba(250,204,21,0.2)]",
    text: "text-yellow-900",
    accent: "bg-yellow-300/30",
    bar: "from-yellow-500 to-amber-300",
    icon: "🏆",
    border: "border-yellow-400/60",
  },
};

const RankBadge = ({ hours, showProgress = true, size = "md" }) => {
  const rank = getRank(hours);
  const progress = getRankProgress(hours);
  const nextRank = getNextRank(hours);
  const style = TIER_STYLES[rank.tier] || TIER_STYLES.Bronze;

  const sizeConfig = {
    sm: { badge: "px-3 py-1.5", icon: "text-lg", name: "text-xs", div: "text-[10px]" },
    md: { badge: "px-5 py-2.5", icon: "text-3xl", name: "text-sm", div: "text-xs" },
    lg: { badge: "px-7 py-3.5", icon: "text-4xl", name: "text-base", div: "text-sm" },
  };
  const s = sizeConfig[size];

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Main Badge */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className={`relative bg-gradient-to-br ${style.gradient} ${style.glow} rounded-2xl ${s.badge} flex items-center gap-3 border ${style.border} overflow-hidden`}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-[shimmer_3s_infinite]" />

        {/* Icon with pulse ring */}
        <div className="relative">
          <span className={`${s.icon} relative z-10 drop-shadow-lg`}>{style.icon}</span>
          <div className={`absolute inset-0 ${style.accent} rounded-full blur-md animate-pulse`} />
        </div>

        {/* Rank text */}
        <div className="relative z-10 flex flex-col">
          <span className={`font-display font-extrabold ${s.name} ${style.text} tracking-wider uppercase drop-shadow-md`}>
            {rank.tier}
          </span>
          {rank.division && (
            <span className={`${s.div} ${style.text} opacity-80 font-bold tracking-widest`}>
              {rank.division}
            </span>
          )}
        </div>
      </motion.div>

      {/* Progress bar */}
      {showProgress && nextRank && (
        <div className="w-full max-w-[220px]">
          <div className="flex justify-between text-[10px] text-muted-foreground mb-1 font-medium">
            <span>{rank.name}</span>
            <span>{nextRank.name}</span>
          </div>
          <div className="h-2.5 rounded-full bg-secondary/80 overflow-hidden border border-border/50 backdrop-blur-sm">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              className={`h-full rounded-full bg-gradient-to-r ${style.bar} relative`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]" />
            </motion.div>
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-1.5 font-medium">
            {hours.toFixed(1)}h / {nextRank.minHours}h
          </p>
        </div>
      )}
    </div>
  );
};

export default RankBadge;
