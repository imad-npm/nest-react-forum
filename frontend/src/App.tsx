import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthGuard from './features/auth/components/AuthGard';
import EmailVerification from './features/auth/pages/EmailVerification';
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import VerificationResult from './features/auth/pages/VerificationResult';
import { CommunityPage } from './features/communities/pages/CommunityPage';
import ExploreCommunitiesPage from './features/communities/pages/ExploreCommunitiesPage';
import MyCommunitiesPage from './features/communities/pages/MyCommunitiesPage';
import FeedPage from './features/feed/pages/FeedPage';
import CreatePostPage from './features/posts/pages/CreatePostPage';
import PostDetailPage from './features/posts/pages/PostDetailPage';
import MainLayout from './layout/MainLayout';
import ModLayout from './layout/ModLayout';
import { ModQueuesPage } from './features/communities/pages/QueuesPage';
import { MembersPage } from './features/community-memberships/pages/MembersPage';
import { ModeratorsPage } from './features/community-memberships/pages/ModeratorsPage';
import { RestrictedUsersPage } from './features/community-restrictions/pages/RestrictedUsersPage';
import { ProfilePage } from './features/profile/pages/ProfilePage';
import { useAuth } from './features/auth/hooks/useAuth';
import SettingsPage from './features/settings/pages/SettingsPage';
import EmailChangeVerifyPage from './features/user/pages/EmailChangeVerifyPage';
import SearchResultsPage from './features/search/pages/SearchResultsPage'; // Import SearchResultsPage
import NotificationsPage from './features/notifications/pages/NotificationsPage';

import ForgotPassword from './features/auth/pages/ForgotPassword';
import ResetPassword from './features/auth/pages/ResetPassword';
import GoogleAuthCallback from './features/auth/pages/GoogleAuthCallback'; // Import GoogleAuthCallback
import { useNotificationsSSE } from './features/notifications/hooks/useNotificationsSSE';
import { GuestGuard } from './features/auth/components/GuestGuard';
import ModGuard from './features/community-memberships/guards/ModGuard';
import ForbiddenPage from './pages/403';

const SessionLoader = ({ children }: { children: React.ReactNode }) => {
  const { isUserLoading } = useAuth();



  if (isUserLoading) {
    return <div>Loading session...</div>;
  }

  return <>{children}</>;
};


export default function App() {
  useNotificationsSSE()
  return (
    <BrowserRouter>
      <SessionLoader>
        <Routes>
          {/* --- Public Auth Routes (No Sidebars) --- */}
          <Route path="/login" element={<GuestGuard><Login /></GuestGuard>} />
          <Route path="/register" element={<GuestGuard><Register /></GuestGuard>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/email-verification" element={<EmailVerification />} />
          <Route path="/verify-email" element={<VerificationResult />} />
          <Route path="/email/change/verify" element={<EmailChangeVerifyPage />} />
          <Route path="/auth/google/callback" element={<GoogleAuthCallback />} /> {/* New Google OAuth Callback Route */}
<Route path="/403" element={<ForbiddenPage />} />

          {/* --- Standard User Routes (with LeftSidebar) --- */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<AuthGuard><FeedPage /></AuthGuard>} />
            <Route path="/posts/:id" element={<AuthGuard><PostDetailPage /></AuthGuard>} />
            <Route path="/submit" element={<AuthGuard><CreatePostPage /></AuthGuard>} />
            <Route path="/communities/:communityId" element={<AuthGuard><CommunityPage /></AuthGuard>} />
            <Route path="/my-communities" element={<AuthGuard><MyCommunitiesPage /></AuthGuard>} />
            <Route path="/explore-communities" element={<AuthGuard><ExploreCommunitiesPage /></AuthGuard>} />
            <Route path="/profile/:userId" element={<AuthGuard><ProfilePage /></AuthGuard>} /> {/* Changed Route */}
            <Route path="/settings" element={<AuthGuard><SettingsPage /></AuthGuard>} />
            <Route path="/search" element={<AuthGuard><SearchResultsPage /></AuthGuard>} /> {/* New Search Results Route */}
            <Route path="/notifications" element={<AuthGuard><NotificationsPage /></AuthGuard>} />
          </Route>

          {/* --- Moderation Routes (with ModSidebar) --- */}
          <Route path="/mod/community/:communityId" element={<AuthGuard><ModGuard><ModLayout /></ModGuard>
            </AuthGuard>}>
            <Route index element={<Navigate to="queues" replace />} />
            <Route path="queues" element={<ModQueuesPage />} />
            <Route path="members" element={<MembersPage />} />
            <Route path="moderators" element={<ModeratorsPage />} />
            <Route path="restricted-users" element={<RestrictedUsersPage />} /> {/* New Route */}
          </Route>
        </Routes>
      </SessionLoader>
    </BrowserRouter>
  );
}