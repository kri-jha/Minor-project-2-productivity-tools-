import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { useState } from "react";
import { generateWeeklyData, generateMonthlyData, generateYearlyData } from "@/lib/mockData";

const CHART_COLORS = [
  "hsl(220, 80%, 55%)",
  "hsl(160, 60%, 45%)",
  "hsl(260, 60%, 55%)",
  "hsl(25, 90%, 55%)",
];

const ProductivityCharts = () => {
  const [period, setPeriod] = useState("weekly");

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
    <div className="glass rounded-xl p-5 soft-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-sm font-semibold">📊 Productivity</h3>
        <div className="flex gap-1 bg-secondary rounded-lg p-1">
          {["weekly", "monthly", "yearly"].map((p) => (
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
        <div className="bg-primary/5 rounded-lg p-3 text-center border border-primary/10">
          <p className="text-2xl font-display font-bold text-primary">{totalHours.toFixed(1)}</p>
          <p className="text-xs text-muted-foreground">Total Hours</p>
        </div>
        <div className="bg-accent/5 rounded-lg p-3 text-center border border-accent/10">
          <p className="text-2xl font-display font-bold text-accent">{totalTasks}</p>
          <p className="text-xs text-muted-foreground">Tasks Done</p>
        </div>
      </div>

      <div className="h-52 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(220, 80%, 55%)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(220, 80%, 55%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" />
            <XAxis dataKey="name" stroke="hsl(220, 10%, 50%)" fontSize={12} />
            <YAxis stroke="hsl(220, 10%, 50%)" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0, 0%, 100%)",
                border: "1px solid hsl(220, 15%, 90%)",
                borderRadius: "8px",
                color: "hsl(220, 20%, 15%)",
              }}
            />
            <Area type="monotone" dataKey="hours" stroke="hsl(220, 80%, 55%)" fill="url(#colorHours)" strokeWidth={2} />
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
                backgroundColor: "hsl(0, 0%, 100%)",
                border: "1px solid hsl(220, 15%, 90%)",
                borderRadius: "8px",
                color: "hsl(220, 20%, 15%)",
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
