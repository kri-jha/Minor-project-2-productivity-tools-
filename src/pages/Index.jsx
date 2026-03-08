import { Link } from "react-router-dom";
import { Timer, ListTodo, User, Users, Zap, Trophy, Flame, Sparkles, ArrowRight } from "lucide-react";
import { mockUser } from "@/lib/mockData";
import { getRank, RANK_ICONS } from "@/lib/ranks";

const Index = () => {
  const rank = getRank(mockUser.totalStudyHours);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8 text-center">
        {/* Hero */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Level up your productivity
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-foreground">
            Productivity
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Track study hours. Build streaks. Climb the ranks.
            <span className="text-primary font-medium"> Let's go!</span> 💪
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="glass rounded-2xl p-4 soft-shadow">
            <Flame className="w-6 h-6 text-neon-orange mx-auto mb-1" />
            <p className="text-xl font-display font-bold text-foreground">{mockUser.currentStreak}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </div>
          <div className="glass rounded-2xl p-4 soft-shadow">
            <Trophy className="w-6 h-6 text-neon-cyan mx-auto mb-1" />
            <p className="text-xl font-display font-bold text-foreground">{rank.name}</p>
            <p className="text-xs text-muted-foreground">Current Rank</p>
          </div>
          <div className="glass rounded-2xl p-4 soft-shadow">
            <Zap className="w-6 h-6 text-neon-orange mx-auto mb-1" />
            <p className="text-xl font-display font-bold text-foreground">{mockUser.points.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">XP Points</p>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { to: "/timer", icon: <Timer className="w-7 h-7" />, label: "Start Studying", desc: "Focus timer with anti-cheat", color: "text-primary" },
            { to: "/quests", icon: <ListTodo className="w-7 h-7" />, label: "Daily Quests", desc: "Track your tasks", color: "text-neon-cyan" },
            { to: "/profile", icon: <User className="w-7 h-7" />, label: "Profile", desc: "Stats, rank & streaks", color: "text-neon-purple" },
            { to: "/rooms", icon: <Users className="w-7 h-7" />, label: "Study Rooms", desc: "Study with friends", color: "text-neon-pink" },
          ].map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className="glass rounded-2xl p-5 hover:shadow-md transition-all group text-left soft-shadow border border-border hover:border-primary/20"
            >
              <div className={`${card.color} mb-3 group-hover:scale-110 transition-transform`}>{card.icon}</div>
              <p className="font-display font-bold text-sm text-foreground">{card.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{card.desc}</p>
              <ArrowRight className="w-4 h-4 text-muted-foreground mt-2 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
