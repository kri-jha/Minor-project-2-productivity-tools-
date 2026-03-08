import { getStreakLevel } from "./ranks";

export const mockUser = {
  name: "Alex Johnson",
  email: "alex@productivity.io",
  avatar: "",
  contactNo: "+1 234 567 8900",
  aboutMe: "Grinding DSA & System Design 🚀 | Competitive programmer | Building cool stuff every day",
  totalStudyHours: 342,
  points: 15420,
  currentStreak: 23,
  maxStreak: 67,
  countryRank: 1247,
  friendRank: 3,
  friendsCount: 18,
};

export function generateStreakData() {
  const data = [];
  const today = new Date();
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayOfWeek = date.getDay();
    let percentage = 0;
    if (Math.random() > 0.25) {
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        percentage = Math.floor(Math.random() * 60) + 40;
      } else {
        percentage = Math.floor(Math.random() * 80) + 20;
      }
    }
    data.push({
      date: date.toISOString().split("T")[0],
      percentage,
      level: getStreakLevel(percentage),
    });
  }
  return data;
}

export function generateWeeklyData() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((day) => ({
    name: day,
    hours: +(Math.random() * 6 + 0.5).toFixed(1),
    tasks: Math.floor(Math.random() * 8) + 1,
  }));
}

export function generateMonthlyData() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months.map((month) => ({
    name: month,
    hours: Math.floor(Math.random() * 50) + 10,
    tasks: Math.floor(Math.random() * 30) + 5,
  }));
}

export function generateYearlyData() {
  return [
    { name: "2024", hours: 342, tasks: 890 },
    { name: "2025", hours: 210, tasks: 540 },
    { name: "2026", hours: 85, tasks: 220 },
  ];
}

export const mockTodos = [
  { id: "1", title: "Binary Trees - Chapter 5", description: "Complete all practice problems", percentage: 75, createdAt: new Date().toISOString() },
  { id: "2", title: "System Design - Load Balancer", description: "Watch video + notes", percentage: 40, createdAt: new Date().toISOString() },
  { id: "3", title: "React Hooks Deep Dive", description: "useEffect, useMemo, useCallback", percentage: 100, createdAt: new Date().toISOString() },
  { id: "4", title: "LeetCode Daily Challenge", description: "Solve 3 medium problems", percentage: 33, createdAt: new Date().toISOString() },
];
