import { useState } from "react";
import { Plus, Users, Lock, Unlock, Copy, Trash2, DoorOpen, Radio, Wifi, Crown, Sparkles, Search, Volume2 } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const ROOM_THEMES = [
  { emoji: "🔥", bg: "from-orange-500/8 to-amber-500/5", border: "border-orange-300/20", dot: "bg-orange-400" },
  { emoji: "💎", bg: "from-blue-500/8 to-cyan-500/5", border: "border-blue-300/20", dot: "bg-blue-400" },
  { emoji: "🎯", bg: "from-emerald-500/8 to-green-500/5", border: "border-emerald-300/20", dot: "bg-emerald-400" },
  { emoji: "⚡", bg: "from-violet-500/8 to-purple-500/5", border: "border-violet-300/20", dot: "bg-violet-400" },
  { emoji: "🚀", bg: "from-pink-500/8 to-rose-500/5", border: "border-pink-300/20", dot: "bg-pink-400" },
  { emoji: "🧠", bg: "from-cyan-500/8 to-teal-500/5", border: "border-cyan-300/20", dot: "bg-cyan-400" },
];

const getTheme = (id) => ROOM_THEMES[parseInt(id, 10) % ROOM_THEMES.length] || ROOM_THEMES[0];

const INITIAL_ROOMS = [
  { id: "1", name: "DSA Grinders", code: "DSA-420", isPrivate: false, members: [
    { name: "Alex", status: "studying", avatar: "🧑‍💻" },
    { name: "CodeWiz", status: "idle", avatar: "🧙" },
    { name: "ByteMe", status: "studying", avatar: "🤖" },
  ], maxMembers: 10, topic: "Binary Trees & Graphs" },
  { id: "2", name: "System Design Gang", code: "SYS-069", isPrivate: true, members: [
    { name: "Alex", status: "studying", avatar: "🧑‍💻" },
    { name: "ArchMaster", status: "studying", avatar: "🏗️" },
  ], maxMembers: 5, topic: "Load Balancers" },
  { id: "3", name: "Frontend Wizards", code: "FRN-777", isPrivate: false, members: [
    { name: "ReactFan", status: "studying", avatar: "⚛️" },
    { name: "CSSKing", status: "idle", avatar: "🎨" },
    { name: "TypeHero", status: "studying", avatar: "📘" },
    { name: "NodeNinja", status: "studying", avatar: "🥷" },
  ], maxMembers: 8, topic: "React Performance" },
  { id: "4", name: "Late Night Coders", code: "LNC-042", isPrivate: false, members: [
    { name: "NightOwl", status: "studying", avatar: "🦉" },
  ], maxMembers: 6, topic: "LeetCode Dailies" },
];

const MemberAvatar = ({ member, index }) => (
  <motion.div
    initial={{ scale: 0, x: -5 }}
    animate={{ scale: 1, x: 0 }}
    transition={{ delay: index * 0.05, type: "spring" }}
    className="relative group/avatar"
  >
    <div className={`w-8 h-8 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-sm ${
      index > 0 ? "-ml-2" : ""
    }`}>
      {member.avatar}
    </div>
    {member.status === "studying" && (
      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-background" />
    )}
    {/* Tooltip */}
    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[9px] font-bold px-2 py-0.5 rounded-md opacity-0 group-hover/avatar:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
      {member.name}
    </div>
  </motion.div>
);

const RoomCard = ({ room, theme, onCopy, onDelete, onJoin }) => {
  const studyingCount = room.members.filter((m) => m.status === "studying").length;
  const isFull = room.members.length >= room.maxMembers;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 25, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, x: -30, filter: "blur(4px)" }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={`relative rounded-2xl border ${theme.border} overflow-hidden group hover:shadow-lg hover:shadow-primary/5 transition-shadow duration-300`}
    >
      {/* Top stripe */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${theme.bg.replace('/8', '/40').replace('/5', '/20')}`} />

      <div className={`relative bg-gradient-to-br ${theme.bg} backdrop-blur-sm p-5`}>
        {/* Watermark */}
        <div className="absolute top-4 right-5 text-4xl opacity-[0.06] pointer-events-none select-none">
          {theme.emoji}
        </div>

        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-display font-bold text-base text-foreground truncate">{room.name}</h3>
              {room.isPrivate ? (
                <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider bg-purple-100 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400 px-2 py-0.5 rounded-md">
                  <Lock className="w-2.5 h-2.5" /> Private
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 px-2 py-0.5 rounded-md">
                  <Unlock className="w-2.5 h-2.5" /> Open
                </span>
              )}
            </div>
            {room.topic && (
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-primary" />
                {room.topic}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => onCopy(room.code)}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all"
              title="Copy room code"
            >
              <Copy className="w-3.5 h-3.5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => onDelete(room.id)}
              className="p-2 rounded-xl text-muted-foreground/30 hover:text-destructive hover:bg-destructive/5 opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </div>

        {/* Members + Join */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Member avatars */}
            <div className="flex items-center">
              {room.members.slice(0, 5).map((m, i) => (
                <MemberAvatar key={m.name} member={m} index={i} />
              ))}
              {room.members.length > 5 && (
                <div className="w-8 h-8 -ml-2 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                  +{room.members.length - 5}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                <Users className="w-3 h-3" /> {room.members.length}/{room.maxMembers}
              </span>
              <span className="text-[10px] text-emerald-500 font-medium flex items-center gap-1">
                <Wifi className="w-3 h-3" /> {studyingCount} studying
              </span>
            </div>
          </div>

          {/* Room code + Join */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-muted-foreground bg-secondary/80 px-2.5 py-1 rounded-lg border border-border/30">
              {room.code}
            </span>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onJoin(room)}
              disabled={isFull}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-display font-bold transition-all ${
                isFull
                  ? "bg-secondary text-muted-foreground cursor-not-allowed"
                  : "bg-foreground text-background shadow-md hover:shadow-lg"
              }`}
            >
              <DoorOpen className="w-3.5 h-3.5" />
              {isFull ? "Full" : "Join"}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const StudyRooms = () => {
  const [rooms, setRooms] = useState(INITIAL_ROOMS);
  const [newRoomName, setNewRoomName] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, public, private

  const createRoom = () => {
    if (!newRoomName.trim()) return;
    const code = `${newRoomName.slice(0, 3).toUpperCase()}-${Math.floor(Math.random() * 999)}`;
    setRooms([
      {
        id: Date.now().toString(),
        name: newRoomName,
        code,
        isPrivate,
        members: [{ name: "You", status: "studying", avatar: "🧑‍💻" }],
        maxMembers: 10,
        topic: newTopic || null,
      },
      ...rooms,
    ]);
    setNewRoomName("");
    setNewTopic("");
    setShowCreate(false);
    toast.success("Room created!");
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success("Room code copied!");
  };

  const joinRoom = (room) => {
    toast.success(`Joined "${room.name}"!`);
  };

  const deleteRoom = (id) => setRooms(rooms.filter((r) => r.id !== id));

  const filteredRooms = rooms.filter((r) => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.code.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || (filterType === "public" && !r.isPrivate) || (filterType === "private" && r.isPrivate);
    return matchSearch && matchType;
  });

  const totalStudying = rooms.reduce((s, r) => s + r.members.filter((m) => m.status === "studying").length, 0);

  return (
    <PageTransition>
      <div className="min-h-screen p-4 md:p-8 pt-20 max-w-3xl mx-auto space-y-5">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} className="flex items-end justify-between">
          <div>
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2"
            >
              <Volume2 className="w-3.5 h-3.5" />
              Study Together
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-display font-black text-foreground tracking-tight leading-none">
              Study Rooms
            </h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowCreate(!showCreate)}
            className="flex items-center gap-2 bg-foreground text-background px-5 py-2.5 rounded-xl font-display font-bold text-sm shadow-lg"
          >
            <Plus className="w-4 h-4" /> New Room
          </motion.button>
        </motion.div>

        {/* Live banner */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3 glass rounded-2xl p-4 soft-shadow"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Wifi className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-background animate-pulse" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-display font-bold text-foreground">
              {totalStudying} student{totalStudying !== 1 ? "s" : ""} studying right now
            </p>
            <p className="text-[10px] text-muted-foreground">
              {rooms.length} active room{rooms.length !== 1 ? "s" : ""} • Join one to boost focus
            </p>
          </div>
          <div className="flex -space-x-1.5">
            {["🧑‍💻", "🧙", "🤖", "⚛️"].map((e, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="w-7 h-7 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-xs"
              >
                {e}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Create Room Form */}
        <AnimatePresence>
          {showCreate && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
              className="overflow-hidden"
            >
              <div className="glass rounded-2xl p-5 soft-shadow border border-primary/10 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-xs font-display font-bold text-foreground">Create Room</span>
                </div>
                <input
                  type="text" value={newRoomName} onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="Room name..."
                  className="w-full bg-background text-foreground rounded-xl px-4 py-3 text-sm font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 border border-border/50"
                  onKeyDown={(e) => e.key === "Enter" && createRoom()}
                  autoFocus
                />
                <input
                  type="text" value={newTopic} onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="Current topic (optional)..."
                  className="w-full bg-background/50 text-foreground rounded-xl px-4 py-2.5 text-xs placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/20 border border-border/30"
                />
                <div className="flex items-center gap-3">
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setIsPrivate(!isPrivate)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      isPrivate
                        ? "bg-purple-100 text-purple-600 border-purple-200 dark:bg-purple-500/15 dark:text-purple-400 dark:border-purple-500/20"
                        : "bg-secondary/50 text-muted-foreground border-border/30 hover:text-foreground"
                    }`}
                  >
                    {isPrivate ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                    {isPrivate ? "Private" : "Public"}
                  </motion.button>
                  <div className="flex-1" />
                  <button onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
                    Cancel
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={createRoom}
                    className="bg-foreground text-background px-5 py-2 rounded-xl text-xs font-bold shadow-md"
                  >
                    Create
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search + Filters */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search rooms..."
              className="w-full bg-secondary/50 text-foreground rounded-xl pl-10 pr-4 py-2.5 text-xs placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 border border-border/30"
            />
          </div>
          <div className="flex gap-0.5 bg-secondary/60 rounded-xl p-0.5 border border-border/30 shrink-0">
            {[
              { key: "all", label: "All" },
              { key: "public", label: "Open" },
              { key: "private", label: "Private" },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilterType(f.key)}
                className="relative px-3.5 py-1.5 rounded-[10px] text-xs font-bold transition-all"
              >
                {filterType === f.key && (
                  <motion.div
                    layoutId="room-filter"
                    className="absolute inset-0 bg-foreground rounded-[10px]"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className={`relative z-10 ${filterType === f.key ? "text-background" : "text-muted-foreground"}`}>
                  {f.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Room List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                theme={getTheme(room.id)}
                onCopy={copyCode}
                onDelete={deleteRoom}
                onJoin={joinRoom}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Empty */}
        {filteredRooms.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="text-6xl mb-5 inline-block"
            >
              🏠
            </motion.div>
            <p className="font-display font-black text-foreground text-xl">No rooms found</p>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
              {search ? "Try a different search term" : "Create the first room to start studying together!"}
            </p>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
};

export default StudyRooms;
