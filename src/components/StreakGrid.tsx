interface StreakGridProps {
  data: { date: string; percentage: number; level: number }[];
}

const StreakGrid = ({ data }: StreakGridProps) => {
  // Group data into weeks (columns)
  const weeks: typeof data[] = [];
  let currentWeek: typeof data = [];

  data.forEach((day, i) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || i === data.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  const levelColors = [
    "bg-streak-0",
    "bg-streak-1",
    "bg-streak-2",
    "bg-streak-3",
    "bg-streak-4",
  ];

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="glass rounded-xl p-4 overflow-x-auto">
      <h3 className="font-display text-sm font-semibold text-foreground mb-3">
        📅 Study Streak
      </h3>
      <div className="flex gap-[3px] min-w-fit">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((day, di) => (
              <div
                key={di}
                className={`w-3 h-3 rounded-sm ${levelColors[day.level]} transition-colors hover:ring-1 hover:ring-primary cursor-pointer`}
                title={`${day.date}: ${day.percentage}% completed`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
        <span>Less</span>
        {levelColors.map((c, i) => (
          <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
};

export default StreakGrid;
