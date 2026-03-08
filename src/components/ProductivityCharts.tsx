import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { useState } from "react";
import { generateWeeklyData, generateMonthlyData, generateYearlyData } from "@/lib/mockData";

const CHART_COLORS = [
  "hsl(160, 100%, 45%)",
  "hsl(190, 100%, 50%)",
  "hsl(270, 100%, 65%)",
  "hsl(25, 100%, 55%)",
];

const ProductivityCharts = () => {
  const [period, setPeriod] = useState<"weekly" | "monthly" | "yearly">("weekly");

  const dataMap = {
    weekly: generateWeeklyData(),
    monthly: generateMonthlyData(),
    yearly: generateYearlyData(),
  };

  const data = dataMap[period];
  const totalHours = data.reduce((s, d) => s + d.hours, 0);
  const totalTasks = data.reduce((s, d) => s + d.tasks, 0);

  const pieData = [
    { name: "Study", value: 65 },
    { name: "Practice", value: 20 },
    { name: "Review", value: 10 },
    { name: "Break", value: 5 },
  ];

  return (
    <div className="glass rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-sm font-semibold">📊 Productivity</h3>
        <div className="flex gap-1 bg-secondary rounded-lg p-1">
          {(["weekly", "monthly", "yearly"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                period === p ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-secondary rounded-lg p-3 text-center">
          <p className="text-2xl font-display font-bold text-primary">{totalHours.toFixed(1)}</p>
          <p className="text-xs text-muted-foreground">Total Hours</p>
        </div>
        <div className="bg-secondary rounded-lg p-3 text-center">
          <p className="text-2xl font-display font-bold text-neon-cyan">{totalTasks}</p>
          <p className="text-xs text-muted-foreground">Tasks Done</p>
        </div>
      </div>

      <div className="h-52 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(160, 100%, 45%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(160, 100%, 45%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(230, 15%, 18%)" />
            <XAxis dataKey="name" stroke="hsl(215, 15%, 55%)" fontSize={12} />
            <YAxis stroke="hsl(215, 15%, 55%)" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(230, 20%, 10%)",
                border: "1px solid hsl(230, 15%, 18%)",
                borderRadius: "8px",
                color: "hsl(210, 40%, 93%)",
              }}
            />
            <Area type="monotone" dataKey="hours" stroke="hsl(160, 100%, 45%)" fill="url(#colorHours)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="h-44">
        <p className="text-xs text-muted-foreground mb-2">Time Distribution</p>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={65}
              paddingAngle={3}
              dataKey="value"
            >
              {pieData.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(230, 20%, 10%)",
                border: "1px solid hsl(230, 15%, 18%)",
                borderRadius: "8px",
                color: "hsl(210, 40%, 93%)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-3 justify-center mt-1">
          {pieData.map((d, i) => (
            <div key={d.name} className="flex items-center gap-1 text-xs text-muted-foreground">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS[i] }} />
              {d.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductivityCharts;
