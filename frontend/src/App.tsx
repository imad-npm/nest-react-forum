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
import { ModMembersPage } from './features/communities/pages/MembersPage';
import { ModModeratorsPage } from './features/communities/pages/ModeratorsPage';
import { RestrictedUsersPage } from './features/community-restrictions/pages/RestrictedUsersPage';
import { ProfilePage } from './features/profile/pages/ProfilePage';
// ... other imports

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Public Auth Routes (No Sidebars) --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="/verify-email" element={<VerificationResult />} />

        {/* --- Standard User Routes (with LeftSidebar) --- */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<AuthGuard><FeedPage /></AuthGuard>} />
          <Route path="/posts/:id" element={<AuthGuard><PostDetailPage /></AuthGuard>} />
          <Route path="/submit" element={<AuthGuard><CreatePostPage /></AuthGuard>} />
          <Route path="/communities/:communityId" element={<AuthGuard><CommunityPage /></AuthGuard>} />
          <Route path="/my-communities" element={<AuthGuard><MyCommunitiesPage /></AuthGuard>} />
          <Route path="/explore-communities" element={<AuthGuard><ExploreCommunitiesPage /></AuthGuard>} />
          <Route path="/profile/:userId" element={<AuthGuard><ProfilePage /></AuthGuard>} /> {/* Changed Route */}
        </Route>

        {/* --- Moderation Routes (with ModSidebar) --- */}
        <Route path="/mod/community/:communityId" element={<AuthGuard><ModLayout /></AuthGuard>}>
          <Route index element={<Navigate to="queues" replace />} />
          <Route path="queues" element={<ModQueuesPage />} />
          <Route path="members" element={<ModMembersPage />} />
          <Route path="moderators" element={<ModModeratorsPage />} />
          <Route path="restricted-users" element={<RestrictedUsersPage />} /> {/* New Route */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}