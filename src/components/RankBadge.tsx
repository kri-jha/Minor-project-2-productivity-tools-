import { getRank, getRankProgress, getNextRank, RANK_ICONS } from "@/lib/ranks";

interface RankBadgeProps {
  hours: number;
  showProgress?: boolean;
  size?: "sm" | "md" | "lg";
}

const RankBadge = ({ hours, showProgress = true, size = "md" }: RankBadgeProps) => {
  const rank = getRank(hours);
  const progress = getRankProgress(hours);
  const nextRank = getNextRank(hours);
  const icon = RANK_ICONS[rank.tier] || "🏅";

  const sizeClasses = {
    sm: "text-sm px-3 py-1",
    md: "text-base px-4 py-2",
    lg: "text-lg px-6 py-3",
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`glass rounded-xl flex items-center gap-2 font-display font-bold tracking-wider ${sizeClasses[size]}`}
        style={{
          borderColor: `var(--${rank.color})`,
          boxShadow: `0 0 15px hsl(var(--${rank.color}) / 0.3)`,
        }}
      >
        <span className="text-2xl">{icon}</span>
        <span className={`text-${rank.color}`}>{rank.name}</span>
      </div>
      {showProgress && nextRank && (
        <div className="w-full max-w-[200px]">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>{rank.name}</span>
            <span>{nextRank.name}</span>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-center mt-1">
            {hours.toFixed(1)}h / {nextRank.minHours}h
          </p>
        </div>
      )}
    </div>
  );
};

export default RankBadge;
