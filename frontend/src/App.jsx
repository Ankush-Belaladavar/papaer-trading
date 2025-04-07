import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from './components/Signup';
import Index from './components/Index';
// Lazy load components
const Home2 = lazy(() => import('./pages/Home2'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const About = lazy(() => import('./pages/About'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const Orders = lazy(() => import('./components/Profile/Orders'));
const GetStarted = lazy(() => import('./components/GetStarted'));
const ChooseAction = lazy(() => import('./components/ChooseAction'));
const StockWatchlist = lazy(() => import('./pages/StockWatchlist'));

const ProtectedRoute = ({ children, authenticated }) => {
  const location = useLocation();

  if (!authenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

const LoadingScreen = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return show ? (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.8)',
      zIndex: 1000
    }}>
      Loading...
    </div>
  ) : null;
};

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [initialAuthCheck, setInitialAuthCheck] = useState(true);
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();
  const navigate = useNavigate();

  // Check authentication status on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      setAuthenticated(true);
    }

    setInitialAuthCheck(false);
  }, []);

  const handleLogin = () => {
    setAuthenticated(true);
    // Redirect to Get Started page after login
    navigate('/get-started', { replace: true });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthenticated(false);
    navigate('/login');
  };

  if (initialAuthCheck) {
    return <LoadingScreen />;
  }

  // Hide Navbar & Footer on these paths
  const hidePaths = ['/login', '/signup', '/choose-action', '/get-started'];
  const showNavAndFooter = authenticated && !hidePaths.includes(location.pathname);

  return (
    <div className="app-container">
      {showNavAndFooter && <Navbar onLogout={handleLogout} currentUser={currentUser} />}

      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={
            authenticated ? (
              <Navigate to="/get-started" replace />
            ) : (
              <Index />
            )
          } />

          <Route path="/index" element={<Index />} />

          <Route path="/login" element={
            authenticated ? (
              <Navigate to="/get-started" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          } />

          <Route path="/signup" element={
            authenticated ? (
              <Navigate to="/get-started" replace />
            ) : (
              <Signup />
            )
          } />

          {/* Get Started page - accessible when authenticated */}
          <Route path="/get-started" element={
            authenticated ? (
              <div className="full-screen-route">
                <GetStarted />
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          } />

          <Route path="/home2" element={
            <ProtectedRoute authenticated={authenticated}>
              <Home2 />
            </ProtectedRoute>
          } />

          <Route path="/dashboard" element={
            <ProtectedRoute authenticated={authenticated}>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/about" element={
            <ProtectedRoute authenticated={authenticated}>
              <About />
            </ProtectedRoute>
          } />

          <Route path="/portfolio" element={
            <ProtectedRoute authenticated={authenticated}>
              <Portfolio />
            </ProtectedRoute>
          } />

          <Route path="/orders" element={
            <ProtectedRoute authenticated={authenticated}>
              <Orders />
            </ProtectedRoute>
          } />

          <Route path="/choose-action" element={
            <ProtectedRoute authenticated={authenticated}>
              <ChooseAction />
            </ProtectedRoute>
          } />

          <Route path="/stockWatchlist" element={
            <ProtectedRoute authenticated={authenticated}>
              <StockWatchlist />
            </ProtectedRoute>
          } />

          <Route path="*" element={
            <Navigate to={authenticated ? '/get-started' : '/'} replace />
          } />
        </Routes>
      </Suspense>

      {showNavAndFooter && <Footer />}
    </div>
  );
}

export default App;