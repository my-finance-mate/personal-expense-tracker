import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import AuthProvider from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import GroupsPage from './pages/GroupsPage';
import GroupDetailPage from './pages/GroupDetailPage';
import CreateGroupPage from './pages/CreateGroupPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={<PrivateRoute />}>
                  <Route index element={<GroupsPage />} />
                  <Route path="/groups/create" element={<CreateGroupPage />} />
                  <Route path="/groups/:id" element={<GroupDetailPage />} />
                </Route>
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <ToastContainer position="bottom-right" />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;