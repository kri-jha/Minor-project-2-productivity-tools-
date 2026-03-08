import { useState } from "react";
import { mockTodos } from "@/lib/mockData";
import { Plus, Trash2, CheckCircle, Circle, Sparkles } from "lucide-react";

const TodoPage = () => {
  const [tasks, setTasks] = useState(mockTodos);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const addTask = () => {
    if (!newTitle.trim()) return;
    const task = {
      id: Date.now().toString(),
      title: newTitle,
      description: newDesc,
      percentage: 0,
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, task]);
    setNewTitle("");
    setNewDesc("");
  };

  const updatePercentage = (id, value) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, percentage: Math.min(100, Math.max(0, value)) } : t)));
  };

  const removeTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const overallPercentage = tasks.length > 0
    ? Math.round(tasks.reduce((s, t) => s + t.percentage, 0) / tasks.length)
    : 0;

  const getProgressColor = (pct) => {
    if (pct >= 80) return "bg-accent";
    if (pct >= 50) return "bg-primary";
    if (pct >= 25) return "bg-neon-orange";
    return "bg-destructive";
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-3xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-display font-extrabold text-foreground">📝 Daily Quests</h1>
        <p className="text-muted-foreground text-sm mt-1">Complete your quests. Build your streak.</p>
      </div>

      {/* Overall Progress */}
      <div className="glass rounded-2xl p-6 glow-primary text-center soft-shadow">
        <p className="text-sm text-muted-foreground mb-2">Today's Overall Progress</p>
        <div className="flex items-center justify-center gap-4">
          <div className="relative w-24 h-24">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(220, 15%, 90%)" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="42" fill="none"
                stroke={overallPercentage >= 80 ? "hsl(160, 60%, 45%)" : overallPercentage >= 50 ? "hsl(220, 80%, 55%)" : "hsl(25, 90%, 55%)"}
                strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${(overallPercentage / 100) * 264} 264`}
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-xl font-display font-bold text-foreground">{overallPercentage}%</p>
            </div>
          </div>
          <div className="text-left">
            <p className="text-lg font-display font-bold text-foreground">
              {tasks.filter((t) => t.percentage === 100).length}/{tasks.length} Complete
            </p>
            <p className="text-xs text-muted-foreground">This % determines your streak color for today</p>
          </div>
        </div>
      </div>

      {/* Add Task */}
      <div className="glass rounded-xl p-4 soft-shadow">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 space-y-2">
            <input
              type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Quest title..."
              className="w-full bg-secondary text-foreground rounded-lg px-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              onKeyDown={(e) => e.key === "Enter" && addTask()}
            />
            <input
              type="text" value={newDesc} onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Description (optional)..."
              className="w-full bg-secondary text-foreground rounded-lg px-4 py-2 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
          <button onClick={addTask} className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded-xl font-display font-bold text-sm hover:opacity-90 transition-all self-end">
            <Plus className="w-4 h-4" /> Add Quest
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className={`glass rounded-xl p-4 transition-all soft-shadow ${task.percentage === 100 ? "border-accent/30 opacity-80" : ""}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                {task.percentage === 100 ? (
                  <CheckCircle className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                )}
                <div className="flex-1">
                  <p className={`font-medium text-sm ${task.percentage === 100 ? "line-through text-muted-foreground" : "text-foreground"}`}>{task.title}</p>
                  {task.description && <p className="text-xs text-muted-foreground mt-0.5">{task.description}</p>}
                </div>
              </div>
              <button onClick={() => removeTask(task.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-300 ${getProgressColor(task.percentage)}`} style={{ width: `${task.percentage}%` }} />
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <input
                  type="number" min={0} max={100} value={task.percentage}
                  onChange={(e) => updatePercentage(task.id, parseInt(e.target.value) || 0)}
                  className="w-14 bg-secondary text-foreground text-center rounded-md px-1 py-0.5 text-xs font-display focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <span className="text-xs text-muted-foreground">%</span>
              </div>
            </div>
            {task.percentage === 100 && (
              <div className="flex items-center gap-1 mt-2 text-xs text-accent">
                <Sparkles className="w-3 h-3" /> Quest Complete! +50 XP
              </div>
            )}
          </div>
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-4xl mb-3">🎯</p>
          <p className="font-display">No quests yet</p>
          <p className="text-sm">Add your first quest above!</p>
        </div>
      )}
    </div>
  );
};

export default TodoPage;
