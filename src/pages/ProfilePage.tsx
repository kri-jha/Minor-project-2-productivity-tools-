import { mockUser, generateStreakData } from "@/lib/mockData";
import RankBadge from "@/components/RankBadge";
import StreakGrid from "@/components/StreakGrid";
import ProductivityCharts from "@/components/ProductivityCharts";
import { Trophy, Flame, Users, Globe, Clock, Star, Zap } from "lucide-react";

const streakData = generateStreakData();

const ProfilePage = () => {
  const user = mockUser;

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header Card */}
      <div className="glass rounded-2xl p-6 glow-green">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-28 h-28 rounded-2xl bg-secondary flex items-center justify-center text-5xl neon-border">
              🧑‍💻
            </div>
            <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-xs font-display font-bold">
              Lv{Math.floor(user.totalStudyHours / 50)}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-display font-bold text-foreground text-glow-green">
              {user.name}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">{user.email}</p>
            {user.contactNo && (
              <p className="text-muted-foreground text-xs mt-0.5">📱 {user.contactNo}</p>
            )}
            <p className="text-foreground/80 text-sm mt-3 max-w-md">{user.aboutMe}</p>
            <div className="mt-4">
              <RankBadge hours={user.totalStudyHours} size="md" />
            </div>
          </div>

          {/* Points */}
          <div className="flex flex-col items-center gap-1 bg-secondary rounded-xl px-5 py-3">
            <Zap className="w-5 h-5 text-neon-orange" />
            <p className="text-2xl font-display font-bold text-neon-orange">{user.points.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">XP Points</p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { icon: <Flame className="w-5 h-5 text-neon-orange" />, label: "Current Streak", value: `${user.currentStreak} days`, glow: "glow-green" },
          { icon: <Star className="w-5 h-5 text-neon-cyan" />, label: "Max Streak", value: `${user.maxStreak} days`, glow: "" },
          { icon: <Clock className="w-5 h-5 text-neon-purple" />, label: "Total Hours", value: `${user.totalStudyHours}h`, glow: "" },
          { icon: <Globe className="w-5 h-5 text-primary" />, label: "Country Rank", value: `#${user.countryRank}`, glow: "" },
          { icon: <Users className="w-5 h-5 text-neon-pink" />, label: "Friend Rank", value: `#${user.friendRank} / ${user.friendsCount}`, glow: "" },
        ].map((stat) => (
          <div key={stat.label} className={`glass rounded-xl p-4 text-center ${stat.glow}`}>
            <div className="flex justify-center mb-2">{stat.icon}</div>
            <p className="text-lg font-display font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Streak Grid */}
      <StreakGrid data={streakData} />

      {/* Charts */}
      <ProductivityCharts />
    </div>
  );
};

export default ProfilePage;
