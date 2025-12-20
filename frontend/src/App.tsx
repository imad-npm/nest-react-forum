import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import AuthGuard from './features/auth/components/AuthGard';
import Header from './layout/Header';
import LeftSidebar from './layout/LeftSidebar';
import EmailVerification from './features/auth/pages/EmailVerification';
import VerificationResult from './features/auth/pages/VerificationResult';
import FeedPage from './features/feed/pages/FeedPage';
import PostDetailPage from './features/posts/pages/PostDetailPage'; // Import PostDetailPage
import { CommunityPage } from './features/communities/pages/CommunityPage';
import MyCommunitiesPage from './features/communities/pages/MyCommunitiesPage';
import ExploreCommunitiesPage from './features/communities/pages/ExploreCommunitiesPage'; // Import ExploreCommunitiesPage

function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="flex">
        <LeftSidebar />
        <main className="flex-grow p-4">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/email-verification" element={<EmailVerification />} />
            <Route path="/verify-email" element={<VerificationResult />} />
            <Route
              path="/"
              element={
                <AuthGuard>
                  <FeedPage />
                </AuthGuard>
              }
            />
            <Route
              path="/posts/:id"
              element={
                <AuthGuard>
                  <PostDetailPage />
                </AuthGuard>
              }
            />
            {/* Add other routes here */}
            <Route
              path="/communities/:communityId"
              element={
                <AuthGuard>
                  <CommunityPage />
                </AuthGuard>
              }
            />
            <Route
              path="/my-communities"
              element={
                <AuthGuard>
                  <MyCommunitiesPage />
                </AuthGuard>
              }
            />
            <Route
              path="/explore-communities"
              element={
                <AuthGuard>
                  <ExploreCommunitiesPage />
                </AuthGuard>
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;