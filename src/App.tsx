import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ScrollToTop } from "@/components/ScrollToTop";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import KirklandsMemo from "./pages/memos/KirklandsMemo";
import LycraMemo from "./pages/memos/LycraMemo";
import PartyCityMemo from "./pages/memos/PartyCityMemo";
import RXLearning from "./pages/RXLearning";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename="/FulcrumMemo">
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/memos/kirklands" element={<KirklandsMemo />} />
            <Route path="/memos/lycra" element={<LycraMemo />} />
            <Route path="/memos/party-city" element={<PartyCityMemo />} />
            <Route path="/rx-learning" element={<RXLearning />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
