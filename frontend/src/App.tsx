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
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;