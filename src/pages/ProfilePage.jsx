import RankBadge from "@/components/RankBadge";
import AllRanksModal from "@/components/AllRanksModal";
import StreakGrid from "@/components/StreakGrid";
import ProductivityCharts from "@/components/ProductivityCharts";
import { Flame, Users, Globe, Clock, Star, Zap, Pencil } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import { useState, useRef, useMemo } from "react";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Generate streak heatmap data from an array of date strings ["2025-04-01", ...]
// Generate streak heatmap data from an array of date strings ["2025-04-01", ...]
const generateStreakData = (days) => {
  const studyDays = Array.isArray(days) ? days : [];
  const studySet = new Set(studyDays);
  const data = [];
  const today = new Date();
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const studied = studySet.has(dateStr);
    data.push({ date: dateStr, percentage: studied ? 100 : 0, level: studied ? 4 : 0 });
  }
  return data;
};

// Calculate current streak from sorted study days
const calcCurrentStreak = (days) => {
  const studyDays = Array.isArray(days) ? days : [];
  if (!studyDays.length) return 0;
  const sorted = [...studyDays].sort().reverse(); // newest first
  let streak = 0;
  const today = new Date().toISOString().split("T")[0];
  let checkDate = today;
  for (const day of sorted) {
    if (day === checkDate) {
      streak++;
      const d = new Date(checkDate);
      d.setDate(d.getDate() - 1);
      checkDate = d.toISOString().split("T")[0];
    } else break;
  }
  return streak;
};

const calcMaxStreak = (days) => {
  const studyDays = Array.isArray(days) ? days : [];
  if (!studyDays.length) return 0;
  const sorted = [...studyDays].sort();
  let max = 1, curr = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const cur = new Date(sorted[i]);
    const diff = Math.round((cur - prev) / (1000 * 60 * 60 * 24));
    if (diff === 1) { curr++; max = Math.max(max, curr); }
    else if (diff > 0) curr = 1;
  }
  return max;
};

const ProfilePage = () => {
  const { user, profile, loading, refreshProfile } = useAuth();
  const [editOpen, setEditOpen] = useState(false);
  const [ranksOpen, setRanksOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", aboutMe: "", contactNo: "" });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Live presence: check if user is currently in a study room
  const [isLive, setIsLive] = useState(() => !!localStorage.getItem("gazen_in_room"));
  useEffect(() => {
    const check = () => setIsLive(!!localStorage.getItem("gazen_in_room"));
    // Poll every 3 seconds (lightweight, since it's just localStorage)
    const interval = setInterval(check, 3000);
    window.addEventListener("storage", check);
    return () => { clearInterval(interval); window.removeEventListener("storage", check); };
  }, []);

  // Derived streak and heatmap data from real profile
  const streakData = generateStreakData(profile?.studyDays);
  const currentStreak = calcCurrentStreak(profile?.studyDays);
  const maxStreak = calcMaxStreak(profile?.studyDays);
  const totalStudyHours = Math.floor((profile?.totalStudySeconds || 0) / 3600);

  const openEdit = () => {
    setForm({
      name: profile?.full_name || profile?.username || user?.email?.split("@")[0] || "",
      aboutMe: profile?.bio || "",
      contactNo: profile?.contact_no || "",
    });
    setAvatarFile(null);
    setAvatarPreview(null);
    setEditOpen(true);
  };

  const handleAvatarSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    const trimmedName = form.name.trim();
    if (!trimmedName) {
      toast.error("Name cannot be empty");
      return;
    }
    if (trimmedName.length > 100) {
      toast.error("Name must be less than 100 characters");
      return;
    }
    if (form.aboutMe.length > 500) {
      toast.error("About me must be less than 500 characters");
      return;
    }
    if (form.contactNo.length > 30) {
      toast.error("Contact number must be less than 30 characters");
      return;
    }

    setSaving(true);

    let avatarUrl = profile?.avatar_url || null;

    try {
      // Upload avatar if selected
      if (avatarFile) {
        const formData = new FormData();
        formData.append("avatar", avatarFile);
        
        const uploadRes = await fetch("/api/users/avatar", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`
          },
          body: formData
        });
        
        if (!uploadRes.ok) throw new Error("Failed to upload avatar");
        const uploadData = await uploadRes.json();
        avatarUrl = uploadData.avatar_url;
      }

      const updateRes = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`
        },
        body: JSON.stringify({
          full_name: trimmedName,
          about_me: form.aboutMe.trim(),
          contact_no: form.contactNo.trim() || null,
          avatar_url: avatarUrl,
        })
      });

      if (!updateRes.ok) throw new Error("Failed to update profile");
      
      toast.success("Profile updated!");
      await refreshProfile();
      setEditOpen(false);
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading || (user && !profile)) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-muted-foreground text-sm font-medium">Initializing profile stats...</p>
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

  const displayUser = {
    name: profile?.full_name || profile?.username || user?.email?.split("@")[0] || "User",
    email: user?.email || "",
    contactNo: profile?.contact_no || "",
    aboutMe: profile?.bio || "",
    totalStudyHours,
    points: profile?.xp || 0,
    currentStreak,
    maxStreak,
    countryRank: 0,
    friendRank: 0,
    friendsCount: 0,
  };

  return (
    <PageTransition>
      <div className="min-h-screen p-4 md:p-8 pt-20 max-w-6xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="glass rounded-2xl p-6 soft-shadow">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <Avatar className="w-28 h-28 rounded-2xl border border-border">
                {profile?.avatar_url ? (
                  <AvatarImage src={profile.avatar_url} alt={displayUser.name} className="object-cover" />
                ) : null}
                <AvatarFallback className="rounded-2xl bg-secondary text-5xl">🧑‍💻</AvatarFallback>
              </Avatar>
              {/* Live green dot — shown when user is inside a Study Room */}
              {isLive && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4" title="Currently in a study room">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-background"></span>
                </span>
              )}
              <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-xs font-display font-bold">
                Lv{Math.floor(displayUser.totalStudyHours / 50)}
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <h1 className="text-3xl font-display font-extrabold text-foreground">{displayUser.name}</h1>
                <button
                  onClick={openEdit}
                  className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                  title="Edit profile"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
              <p className="text-muted-foreground text-sm mt-1">{displayUser.email}</p>
              {displayUser.contactNo && (
                <p className="text-muted-foreground text-xs mt-0.5">📱 {displayUser.contactNo}</p>
              )}
              {displayUser.aboutMe && (
                <p className="text-foreground/80 text-sm mt-3 max-w-md">{displayUser.aboutMe}</p>
              )}
              <div className="mt-4 cursor-pointer" onClick={() => setRanksOpen(true)}>
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

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-3">
              <div
                className="relative w-24 h-24 rounded-2xl overflow-hidden cursor-pointer group border border-border bg-secondary"
                onClick={() => fileInputRef.current?.click()}
              >
                {avatarPreview || profile?.avatar_url ? (
                  <img
                    src={avatarPreview || profile?.avatar_url}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">🧑‍💻</div>
                )}
                <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-6 h-6 text-foreground" />
                </div>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-primary hover:underline"
              >
                Change photo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarSelect}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                maxLength={100}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-about">About Me</Label>
              <Textarea
                id="edit-about"
                value={form.aboutMe}
                onChange={(e) => setForm((f) => ({ ...f, aboutMe: e.target.value }))}
                maxLength={500}
                placeholder="Tell us about yourself..."
                rows={3}
              />
              <p className="text-xs text-muted-foreground text-right">{form.aboutMe.length}/500</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-contact">Contact Number</Label>
              <Input
                id="edit-contact"
                value={form.contactNo}
                onChange={(e) => setForm((f) => ({ ...f, contactNo: e.target.value }))}
                maxLength={30}
                placeholder="+1 234 567 8900"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setEditOpen(false)} disabled={saving}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AllRanksModal
        open={ranksOpen}
        onClose={() => setRanksOpen(false)}
        currentHours={displayUser.totalStudyHours}
      />
    </PageTransition>
  );
};

export default ProfilePage;
