import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import AuthGuard from './features/auth/components/AuthGard';
import Header from './layout/Header';
import EmailVerification from './features/auth/pages/EmailVerification';
import VerificationResult from './features/auth/pages/VerificationResult';
import FeedPage from './features/feed/pages/FeedPage'; // Import FeedPage

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/email-verification" element={<EmailVerification />} />
          <Route path="/verify-email" element={<VerificationResult />} />
          <Route
            path="/"
            element={
              <AuthGuard>
                <FeedPage /> {/* Use FeedPage for the main route */}
              </AuthGuard>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;