
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Blog from "./pages/Blog";
import BlogArticle from "./pages/BlogArticle";
import InvestmentFirms from "./pages/InvestmentFirms";
import InvestmentFirmDetail from "./pages/InvestmentFirmDetail";
import AccountingFirms from "./pages/AccountingFirms";
import AccountingFirmDetail from "./pages/AccountingFirmDetail";
import Advisors from "./pages/Advisors";
import AdvisorDetail from "./pages/AdvisorDetail";
import SignUp from "./pages/auth/SignUp";
import SignIn from "./pages/auth/SignIn";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import PageLayout from "@/components/layout/PageLayout";

// Admin pages
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminEntityDashboard from "./pages/admin/AdminEntityDashboard";
import BlogEditor from "./pages/admin/BlogEditor";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const AppRoutes = () => (
  <PageLayout>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogArticle />} />
        <Route path="/investment-firms" element={<InvestmentFirms />} />
        <Route path="/investment-firms/:slug" element={<InvestmentFirmDetail />} />
        <Route path="/accounting-firms" element={<AccountingFirms />} />
        <Route path="/accounting-firms/:slug" element={<AccountingFirmDetail />} />
        <Route path="/advisors" element={<Advisors />} />
        <Route path="/advisors/:slug" element={<AdvisorDetail />} />
        
        {/* Auth routes */}
        <Route path="/auth/signup" element={<SignUp />} />
        <Route path="/auth/signin" element={<SignIn />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        
        {/* Admin routes - protected */}
        <Route path="/admin/blog" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/entities" element={
          <ProtectedRoute>
            <AdminEntityDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/blog/new" element={
          <ProtectedRoute>
            <BlogEditor />
          </ProtectedRoute>
        } />
        <Route path="/admin/blog/edit/:slug" element={
          <ProtectedRoute>
            <BlogEditor />
          </ProtectedRoute>
        } />
        
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
  </PageLayout>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <AppRoutes />
            <Toaster />
            <Sonner />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
