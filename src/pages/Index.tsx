import { Link } from "react-router-dom";
import { Timer, ListTodo, User, Users, Zap, Trophy, Flame } from "lucide-react";
import { mockUser } from "@/lib/mockData";
import { getRank, RANK_ICONS } from "@/lib/ranks";

const Index = () => {
  const rank = getRank(mockUser.totalStudyHours);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8 text-center">
        {/* Hero */}
        <div className="space-y-4">
          <div className="text-6xl animate-float">🎮</div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground text-glow-green">
            StudyGG
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Level up your productivity. Track study hours. Climb the ranks. 
            <span className="text-primary"> no cap fr fr</span> 💯
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="glass rounded-xl p-4 glow-green">
            <Flame className="w-6 h-6 text-neon-orange mx-auto mb-1" />
            <p className="text-xl font-display font-bold text-foreground">{mockUser.currentStreak}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </div>
          <div className="glass rounded-xl p-4">
            <Trophy className="w-6 h-6 text-neon-cyan mx-auto mb-1" />
            <p className="text-xl font-display font-bold text-foreground">{rank.name}</p>
            <p className="text-xs text-muted-foreground">Current Rank</p>
          </div>
          <div className="glass rounded-xl p-4">
            <Zap className="w-6 h-6 text-neon-orange mx-auto mb-1" />
            <p className="text-xl font-display font-bold text-foreground">{mockUser.points.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">XP Points</p>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { to: "/timer", icon: <Timer className="w-8 h-8" />, label: "Start Studying", desc: "Focus timer with anti-cheat", color: "text-primary" },
            { to: "/quests", icon: <ListTodo className="w-8 h-8" />, label: "Daily Quests", desc: "Track your tasks", color: "text-neon-cyan" },
            { to: "/profile", icon: <User className="w-8 h-8" />, label: "Profile", desc: "Stats, rank & streaks", color: "text-neon-purple" },
            { to: "/rooms", icon: <Users className="w-8 h-8" />, label: "Study Rooms", desc: "Study with friends", color: "text-neon-pink" },
          ].map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className="glass rounded-xl p-5 hover:neon-border transition-all group text-left"
            >
              <div className={`${card.color} mb-2 group-hover:scale-110 transition-transform`}>{card.icon}</div>
              <p className="font-display font-bold text-sm text-foreground">{card.label}</p>
              <p className="text-xs text-muted-foreground">{card.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
