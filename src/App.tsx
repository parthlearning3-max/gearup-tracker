import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MaintenanceProvider } from "@/contexts/MaintenanceContext";
import Index from "./pages/Index";
import RequestsPage from "./pages/RequestsPage";
import EquipmentPage from "./pages/EquipmentPage";
import TeamsPage from "./pages/TeamsPage";
import CalendarPage from "./pages/CalendarPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <MaintenanceProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/requests" element={<RequestsPage />} />
            <Route path="/equipment" element={<EquipmentPage />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </MaintenanceProvider>
  </QueryClientProvider>
);

export default App;
