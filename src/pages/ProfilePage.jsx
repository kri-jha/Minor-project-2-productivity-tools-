import { mockUser, generateStreakData } from "@/lib/mockData";
import RankBadge from "@/components/RankBadge";
import StreakGrid from "@/components/StreakGrid";
import ProductivityCharts from "@/components/ProductivityCharts";
import { Trophy, Flame, Users, Globe, Clock, Star, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import PageTransition from "@/components/PageTransition";

// Generate empty streak data (all zeros) for real users — no fake green dots
const generateEmptyStreakData = () => {
  const data = [];
  const today = new Date();
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({ date: date.toISOString().split("T")[0], percentage: 0, level: 0 });
  }
  return data;
};

const streakData = generateEmptyStreakData();

const ProfilePage = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Loading profile...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!user) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center space-y-4">
            <p className="text-4xl">🔒</p>
            <h2 className="text-xl font-display font-bold text-foreground">Sign in to view your profile</h2>
            <p className="text-muted-foreground text-sm">Track your progress, rank, and streaks</p>
            <Link
              to="/signin"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-bold text-sm"
            >
              Sign In
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  // Use profile data from DB, fallback to mock for display
  const displayUser = {
    name: profile?.name || user.email?.split("@")[0] || "User",
    email: profile?.email || user.email,
    contactNo: profile?.contact_no || "",
    aboutMe: profile?.about_me || "Hey there! I'm using Productivity to level up 🚀",
    totalStudyHours: Number(profile?.total_study_hours) || 0,
    points: profile?.points || 0,
    currentStreak: profile?.current_streak || 0,
    maxStreak: profile?.max_streak || 0,
    countryRank: profile?.country_rank || 0,
    friendRank: profile?.friend_rank || 0,
    friendsCount: profile?.friends_count || 0,
  };

  return (
    <PageTransition>
    <div className="min-h-screen p-4 md:p-8 pt-20 max-w-6xl mx-auto space-y-6">
      {/* Header Card */}
      <div className="glass rounded-2xl p-6 soft-shadow">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative">
            <div className="w-28 h-28 rounded-2xl bg-secondary flex items-center justify-center text-5xl border border-border">
              🧑‍💻
            </div>
            <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-xs font-display font-bold">
              Lv{Math.floor(displayUser.totalStudyHours / 50)}
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-display font-extrabold text-foreground">{displayUser.name}</h1>
            <p className="text-muted-foreground text-sm mt-1">{displayUser.email}</p>
            {displayUser.contactNo && (
              <p className="text-muted-foreground text-xs mt-0.5">📱 {displayUser.contactNo}</p>
            )}
            <p className="text-foreground/80 text-sm mt-3 max-w-md">{displayUser.aboutMe}</p>
            <div className="mt-4">
              <RankBadge hours={displayUser.totalStudyHours} size="md" />
            </div>
          </div>

          <div className="flex flex-col items-center gap-1 bg-primary/5 rounded-xl px-5 py-3 border border-primary/10">
            <Zap className="w-5 h-5 text-primary" />
            <p className="text-2xl font-display font-bold text-primary">{displayUser.points.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">XP Points</p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { icon: <Flame className="w-5 h-5 text-neon-orange" />, label: "Current Streak", value: `${displayUser.currentStreak} days` },
          { icon: <Star className="w-5 h-5 text-neon-cyan" />, label: "Max Streak", value: `${displayUser.maxStreak} days` },
          { icon: <Clock className="w-5 h-5 text-neon-purple" />, label: "Total Hours", value: `${displayUser.totalStudyHours}h` },
          { icon: <Globe className="w-5 h-5 text-primary" />, label: "Country Rank", value: displayUser.countryRank ? `#${displayUser.countryRank}` : "--" },
          { icon: <Users className="w-5 h-5 text-neon-pink" />, label: "Friend Rank", value: displayUser.friendRank ? `#${displayUser.friendRank} / ${displayUser.friendsCount}` : "--" },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-xl p-4 text-center soft-shadow">
            <div className="flex justify-center mb-2">{stat.icon}</div>
            <p className="text-lg font-display font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <StreakGrid data={streakData} />
      <ProductivityCharts />
    </div>
    </PageTransition>
  );
};

export default ProfilePage;
