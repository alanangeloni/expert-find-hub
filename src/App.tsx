
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/layout/Header";
import Index from "./pages/Index";
import Advisors from "./pages/Advisors";
import AdvisorDetail from "./pages/AdvisorDetail";
import AdvisorRegistration from "./pages/AdvisorRegistration";
import AdvisorProfile from "./pages/AdvisorProfile";
import InvestmentFirms from "./pages/InvestmentFirms";
import InvestmentFirmDetail from "./pages/InvestmentFirmDetail";
import AccountingFirms from "./pages/AccountingFirms";
import AccountingFirmDetail from "./pages/AccountingFirmDetail";
import Blog from "./pages/Blog";
import BlogArticle from "./pages/BlogArticle";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import BlogEditor from "./pages/admin/BlogEditor";
import AdminEntityDashboard from "./pages/admin/AdminEntityDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen bg-background font-sans antialiased">
            <Header />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/advisors" element={<Advisors />} />
              <Route path="/advisor/:slug" element={<AdvisorDetail />} />
              <Route path="/advisor-registration" element={<AdvisorRegistration />} />
              <Route
                path="/advisor-profile"
                element={
                  <ProtectedRoute>
                    <AdvisorProfile />
                  </ProtectedRoute>
                }
              />
              <Route path="/investment-firms" element={<InvestmentFirms />} />
              <Route path="/investment-firm/:slug" element={<InvestmentFirmDetail />} />
              <Route path="/accounting-firms" element={<AccountingFirms />} />
              <Route path="/accounting-firm/:slug" element={<AccountingFirmDetail />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogArticle />} />
              <Route path="/auth/signin" element={<SignIn />} />
              <Route path="/auth/signup" element={<SignUp />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />
              <Route path="/auth/reset-password" element={<ResetPassword />} />
              <Route
                path="/admin/blog"
                element={
                  <ProtectedRoute>
                    <BlogEditor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/entities"
                element={
                  <ProtectedRoute>
                    <AdminEntityDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
