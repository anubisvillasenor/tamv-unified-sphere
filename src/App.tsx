import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Feed from "./pages/Feed";
import Isabella from "./pages/Isabella";
import About from "./pages/About";
import University from "./pages/University";
import Gallery from "./pages/Gallery";
import Messages from "./pages/Messages";
import Reels from "./pages/Reels";
import Streaming from "./pages/Streaming";
import Groups from "./pages/Groups";
import BookPI from "./pages/BookPI";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/reels" element={<Reels />} />
            <Route path="/streaming" element={<Streaming />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/isabella" element={<Isabella />} />
            <Route path="/about" element={<About />} />
            <Route path="/university" element={<University />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/bookpi" element={<BookPI />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
