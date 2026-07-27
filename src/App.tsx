import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { DashboardShell } from "./components/DashboardShell";
import { Onboarding } from "./pages/Onboarding";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Home } from "./pages/Home";
import { NewProtocolWizard } from "./pages/NewProtocolWizard";
import { ProtocolList } from "./pages/ProtocolList";
import { ProtocolDetail } from "./pages/ProtocolDetail";
import { CalendarPage } from "./pages/Calendar";
import { Profile } from "./pages/Profile";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/home" replace /> : <Onboarding />} />
      <Route path="/anmelden" element={user ? <Navigate to="/home" replace /> : <Login />} />
      <Route
        path="/registrieren"
        element={user ? <Navigate to="/home" replace /> : <Register />}
      />

      <Route
        path="/home"
        element={
          <RequireAuth>
            <DashboardShell>
              <Home />
            </DashboardShell>
          </RequireAuth>
        }
      />
      <Route
        path="/neu"
        element={
          <RequireAuth>
            <DashboardShell panel={false}>
              <NewProtocolWizard />
            </DashboardShell>
          </RequireAuth>
        }
      />
      <Route
        path="/protokolle"
        element={
          <RequireAuth>
            <DashboardShell>
              <ProtocolList />
            </DashboardShell>
          </RequireAuth>
        }
      />
      <Route
        path="/protokolle/:id"
        element={
          <RequireAuth>
            <DashboardShell panel={false}>
              <ProtocolDetail />
            </DashboardShell>
          </RequireAuth>
        }
      />
      <Route
        path="/protokolle/:id/bearbeiten"
        element={
          <RequireAuth>
            <DashboardShell panel={false}>
              <NewProtocolWizard />
            </DashboardShell>
          </RequireAuth>
        }
      />
      <Route
        path="/kalender"
        element={
          <RequireAuth>
            <DashboardShell>
              <CalendarPage />
            </DashboardShell>
          </RequireAuth>
        }
      />
      <Route
        path="/profil"
        element={
          <RequireAuth>
            <DashboardShell>
              <Profile />
            </DashboardShell>
          </RequireAuth>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
