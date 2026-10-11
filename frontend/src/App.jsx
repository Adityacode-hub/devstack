import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Questions from "./pages/Questions";
import AskQuestion from "./pages/AskQuestion";
import QuestionDetail from "./pages/QuestionDetail";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected application routes */}
        <Route
          path="/questions"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Questions />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/questions/ask"
          element={
            <ProtectedRoute>
              <AppLayout>
                <AskQuestion />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/questions/:id"
          element={
            <ProtectedRoute>
              <AppLayout>
                <QuestionDetail />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Profile />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Unknown route */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;