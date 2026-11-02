import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';

// Lazy Loaded Pages
const HomePage = lazy(() => import('./pages/HomePage'));
const CreatePage = lazy(() => import('./pages/CreatePage'));
const TemplatesPage = lazy(() => import('./pages/TemplatesPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const GuestInvitePage = lazy(() => import('./pages/GuestInvitePage'));
const DemoPage = lazy(() => import('./pages/DemoPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const RefundPage = lazy(() => import('./pages/RefundPage'));
const ShippingPage = lazy(() => import('./pages/ShippingPage'));
const AffiliatePage = lazy(() => import('./pages/AffiliatePage'));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function PageLoader() {
  return (
    <div className="min-h-screen bg-[#fbf8f1] flex items-center justify-center text-xs text-[#722f37] font-serif">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-[#722f37] border-t-transparent rounded-full animate-spin" />
        <span>Loading Zareqia...</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/dashboard/:slug" element={<DashboardPage />} />
          <Route path="/i/:slug" element={<GuestInvitePage />} />
          <Route path="/invite/demo" element={<DemoPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/refund" element={<RefundPage />} />
          <Route path="/shipping" element={<ShippingPage />} />
          <Route path="/affiliate" element={<AffiliatePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
