import { useState } from "react";
import { Plus, Users, Lock, Unlock, Copy, Trash2 } from "lucide-react";
import PageTransition from "@/components/PageTransition";

const StudyRooms = () => {
  const [rooms, setRooms] = useState([
    { id: "1", name: "DSA Grinders 🔥", code: "DSA-420", isPrivate: false, members: ["Alex", "CodeWiz", "ByteMe"], maxMembers: 10 },
    { id: "2", name: "System Design Gang", code: "SYS-069", isPrivate: true, members: ["Alex", "ArchMaster"], maxMembers: 5 },
  ]);
  const [newRoomName, setNewRoomName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  const createRoom = () => {
    if (!newRoomName.trim()) return;
    const code = `${newRoomName.slice(0, 3).toUpperCase()}-${Math.floor(Math.random() * 999)}`;
    setRooms([...rooms, {
      id: Date.now().toString(),
      name: newRoomName,
      code,
      isPrivate,
      members: ["Alex"],
      maxMembers: 10,
    }]);
    setNewRoomName("");
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <PageTransition>
    <div className="min-h-screen p-4 md:p-8 pt-20 max-w-3xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-display font-extrabold text-foreground">🏠 Study Rooms</h1>
        <p className="text-muted-foreground text-sm mt-1">Create or join a room to study with friends</p>
      </div>

      {/* Create Room */}
      <div className="glass rounded-xl p-4 soft-shadow">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text" value={newRoomName} onChange={(e) => setNewRoomName(e.target.value)}
            placeholder="Room name..."
            className="flex-1 bg-secondary text-foreground rounded-lg px-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            onKeyDown={(e) => e.key === "Enter" && createRoom()}
          />
          <button
            onClick={() => setIsPrivate(!isPrivate)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              isPrivate ? "bg-neon-purple/10 text-neon-purple" : "bg-secondary text-muted-foreground"
            }`}
          >
            {isPrivate ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            {isPrivate ? "Private" : "Public"}
          </button>
          <button onClick={createRoom} className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded-xl font-display font-bold text-sm hover:opacity-90 transition-all">
            <Plus className="w-4 h-4" /> Create
          </button>
        </div>
      </div>

      {/* Rooms List */}
      <div className="space-y-3">
        {rooms.map((room) => (
          <div key={room.id} className="glass rounded-xl p-4 soft-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-sm text-foreground">{room.name}</h3>
                  {room.isPrivate && <Lock className="w-3 h-3 text-neon-purple" />}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Users className="w-3 h-3" /> {room.members.length}/{room.maxMembers}
                  </span>
                  <button onClick={() => copyCode(room.code)} className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors">
                    <Copy className="w-3 h-3" /> {room.code}
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="bg-primary text-primary-foreground px-4 py-1.5 rounded-lg text-xs font-display font-bold hover:opacity-90 transition-all">Join</button>
                <button onClick={() => setRooms(rooms.filter((r) => r.id !== room.id))} className="text-muted-foreground hover:text-destructive transition-colors p-1.5">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex gap-1 mt-3 flex-wrap">
              {room.members.map((m) => (
                <span key={m} className="bg-secondary text-foreground text-xs px-2 py-0.5 rounded-full">{m}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyRooms;
