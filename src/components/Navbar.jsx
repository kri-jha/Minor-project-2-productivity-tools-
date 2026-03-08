import { Link, useLocation } from "react-router-dom";
import { User, Timer, ListTodo, Users, Home, Sparkles } from "lucide-react";

const Navbar = () => {
  const { pathname } = useLocation();

  const links = [
    { to: "/", icon: <Home className="w-5 h-5" />, label: "Home" },
    { to: "/profile", icon: <User className="w-5 h-5" />, label: "Profile" },
    { to: "/timer", icon: <Timer className="w-5 h-5" />, label: "Timer" },
    { to: "/quests", icon: <ListTodo className="w-5 h-5" />, label: "Quests" },
    { to: "/rooms", icon: <Users className="w-5 h-5" />, label: "Rooms" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border md:top-0 md:bottom-auto md:border-t-0 md:border-b shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-around md:justify-start md:gap-1 px-2 py-2">
        <div className="hidden md:flex items-center gap-2 mr-6 px-3">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="font-display font-bold text-sm text-primary">Productivity</span>
        </div>
        {links.map((link) => {
          const active = pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex flex-col md:flex-row items-center gap-0.5 md:gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                active
                  ? "text-primary bg-primary/8"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
