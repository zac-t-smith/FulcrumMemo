import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ScrollToTop } from "@/components/ScrollToTop";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MemosPage from "./pages/Memos";
import Resume from "./pages/Resume";
import KirklandsMemo from "./pages/memos/KirklandsMemo";
import LycraMemo from "./pages/memos/LycraMemo";
import PartyCityMemo from "./pages/memos/PartyCityMemo";
import IranMemoPartIFull from "./pages/memos/IranMemoPartIFull";
import IranMemoPartIIFull from "./pages/memos/IranMemoPartIIFull";
import IranMemoPartIIIFull from "./pages/memos/IranMemoPartIIIFull";
import FieldNotesIndex from "./pages/field-notes/FieldNotesIndex";
import FieldNoteDay from "./pages/field-notes/FieldNoteDay";
import TimelinePage from "./pages/TimelinePage";

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
            <Route path="/resume" element={<Resume />} />
            <Route path="/memos" element={<MemosPage />} />
            <Route path="/memos/kirklands" element={<KirklandsMemo />} />
            <Route path="/memos/lycra" element={<LycraMemo />} />
            <Route path="/memos/party-city" element={<PartyCityMemo />} />
            <Route path="/memos/iran" element={<IranMemoPartIFull />} />
            <Route path="/memos/iran-part-ii" element={<IranMemoPartIIFull />} />
            <Route path="/memos/iran-part-iii" element={<IranMemoPartIIIFull />} />
            <Route path="/field-notes" element={<FieldNotesIndex />} />
            <Route path="/field-notes/:day" element={<FieldNoteDay />} />
            <Route path="/timeline" element={<TimelinePage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
