import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Index from "./pages/Index";
import ProfilePage from "./pages/ProfilePage";
import StudyTimer from "./pages/StudyTimer";
import TodoPage from "./pages/TodoPage";
import StudyRooms from "./pages/StudyRooms";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <div className="pt-0 md:pt-16 pb-20 md:pb-0">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/timer" element={<StudyTimer />} />
            <Route path="/quests" element={<TodoPage />} />
            <Route path="/rooms" element={<StudyRooms />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
