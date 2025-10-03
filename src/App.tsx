import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SavedBooksProvider } from './context/SavedBooksContext';
import ThemeBackground from './components/common/ThemeBackground';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import MainBookApp from './components/books/MainBookApp';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SavedBooksProvider>
        <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <div className="min-h-screen relative">
          {/* Animated background */}
          <ThemeBackground />

            {/* Content */}
            <div className="relative z-10">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <MainBookApp />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
            
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#ffffff',
                  color: '#000000',
                },
              }}
            />
          </div>
          </Router>
        </SavedBooksProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;