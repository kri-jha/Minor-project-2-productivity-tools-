import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";
import { useState, useMemo } from "react";
import { generateWeeklyData, generateMonthlyData, generateYearlyData } from "@/lib/mockData";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CheckCircle2, TrendingUp, BarChart3 } from "lucide-react";

const COLORS = {
  primary: "hsl(var(--primary))",
  accent: "hsl(160, 60%, 45%)",
  purple: "hsl(260, 60%, 55%)",
  orange: "hsl(25, 90%, 55%)",
  grid: "hsl(220, 15%, 92%)",
  axis: "hsl(220, 10%, 55%)",
};

const PERIOD_CONFIG = {
  weekly: { label: "Weekly", subtitle: "Last 7 days", icon: "📅" },
  monthly: { label: "Monthly", subtitle: "Last 30 days", icon: "🗓️" },
  yearly: { label: "Yearly", subtitle: "Last 365 days", icon: "📆" },
};

const pieData = [
  { name: "Study", value: 65, color: COLORS.primary },
  { name: "Practice", value: 20, color: COLORS.accent },
  { name: "Review", value: 10, color: COLORS.purple },
  { name: "Break", value: 5, color: COLORS.orange },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-background/95 backdrop-blur-md border border-border rounded-xl px-3 py-2 shadow-lg">
      <p className="text-xs font-display font-bold text-foreground">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-[11px] text-muted-foreground">
          {p.name}: <span className="font-semibold text-foreground">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="relative overflow-hidden rounded-xl p-4 border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors group"
  >
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${color} shrink-0`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-2xl font-display font-bold text-foreground leading-none">{value}</p>
        <p className="text-[10px] text-muted-foreground font-medium mt-0.5 uppercase tracking-wide">{label}</p>
      </div>
    </div>
  </motion.div>
);

const ProductivityCharts = () => {
  const [period, setPeriod] = useState("weekly");

  const data = useMemo(() => {
    if (period === "weekly") return generateWeeklyData();
    if (period === "monthly") return generateMonthlyData();
    return generateYearlyData();
  }, [period]);

  const totalHours = data.reduce((s, d) => s + d.hours, 0);
  const totalTasks = data.reduce((s, d) => s + d.tasks, 0);
  const avgHours = data.length > 0 ? (totalHours / data.length) : 0;
  const bestDay = data.reduce((best, d) => (d.hours > best.hours ? d : best), data[0]);
  const config = PERIOD_CONFIG[period];

  // For monthly, only show every 5th label to avoid clutter
  const tickFormatter = period === "monthly"
    ? (val, idx) => (idx % 5 === 0 ? val : "")
    : undefined;

  return (
    <div className="glass rounded-2xl p-5 md:p-6 soft-shadow space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-primary/10">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-foreground">Productivity</h3>
            <p className="text-[10px] text-muted-foreground">{config.subtitle}</p>
          </div>
        </div>

        <div className="flex gap-1 bg-secondary/80 rounded-xl p-1 border border-border/50">
          {Object.entries(PERIOD_CONFIG).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setPeriod(key)}
              className={`relative px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                period === key
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {period === key && (
                <motion.div
                  layoutId="period-pill"
                  className="absolute inset-0 bg-primary rounded-lg"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              <span className="relative z-10">{cfg.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={Clock} label="Total Hours" value={totalHours.toFixed(1)} color="bg-primary/10 text-primary" delay={0} />
        <StatCard icon={CheckCircle2} label="Tasks Done" value={totalTasks} color="bg-emerald-500/10 text-emerald-600" delay={0.05} />
        <StatCard icon={TrendingUp} label="Avg / Day" value={avgHours.toFixed(1) + "h"} color="bg-violet-500/10 text-violet-600" delay={0.1} />
        <StatCard icon={BarChart3} label="Best Day" value={bestDay?.hours > 0 ? bestDay.hours + "h" : "--"} color="bg-amber-500/10 text-amber-600" delay={0.15} />
      </div>

      {/* Area Chart */}
      <AnimatePresence mode="wait">
        <motion.div
          key={period}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          <div className="rounded-xl border border-border/50 bg-secondary/20 p-4">
            <p className="text-xs text-muted-foreground font-medium mb-3">Study Hours</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorHoursGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COLORS.primary} stopOpacity={0.25} />
                      <stop offset="100%" stopColor={COLORS.primary} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke={COLORS.axis}
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={tickFormatter}
                  />
                  <YAxis stroke={COLORS.axis} fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="hours"
                    stroke={COLORS.primary}
                    fill="url(#colorHoursGrad)"
                    strokeWidth={2.5}
                    dot={period === "weekly" ? { r: 4, fill: COLORS.primary, strokeWidth: 2, stroke: "hsl(var(--background))" } : false}
                    activeDot={{ r: 5, strokeWidth: 2, stroke: "hsl(var(--background))" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tasks Bar Chart */}
          <div className="rounded-xl border border-border/50 bg-secondary/20 p-4 mt-3">
            <p className="text-xs text-muted-foreground font-medium mb-3">Tasks Completed</p>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke={COLORS.axis}
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={tickFormatter}
                  />
                  <YAxis stroke={COLORS.axis} fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="tasks"
                    fill={COLORS.accent}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={period === "yearly" ? 40 : period === "monthly" ? 12 : 32}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Time Distribution Pie */}
      <div className="rounded-xl border border-border/50 bg-secondary/20 p-4">
        <p className="text-xs text-muted-foreground font-medium mb-2">Time Distribution</p>
        <div className="flex items-center gap-6">
          <div className="h-36 w-36 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={58}
                  paddingAngle={4}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-2">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                <span className="text-xs text-muted-foreground">{d.name}</span>
                <span className="text-xs font-bold text-foreground ml-auto">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductivityCharts;
