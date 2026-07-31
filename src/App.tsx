import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { BottomNav } from "./components/BottomNav";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Onboarding } from "./pages/Onboarding";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Home } from "./pages/Home";
import { NewProtocolWizard } from "./pages/NewProtocolWizard";
import { ProtocolList } from "./pages/ProtocolList";
import { ProtocolDetail } from "./pages/ProtocolDetail";
import { CalendarPage } from "./pages/Calendar";
import { Profile } from "./pages/Profile";
import { Privacy } from "./pages/Privacy";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  return <>{children}</>;
}

function AppLayout({ children, nav = true }: { children: React.ReactNode; nav?: boolean }) {
  return (
    <div className="app-shell flex flex-col">
      <div className="flex-1">{children}</div>
      {nav && <BottomNav />}
    </div>
  );
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
      <Route path="/datenschutz" element={<Privacy />} />

      <Route
        path="/home"
        element={
          <RequireAuth>
            <AppLayout>
              <Home />
            </AppLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/neu"
        element={
          <RequireAuth>
            <AppLayout nav={false}>
              <NewProtocolWizard />
            </AppLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/protokolle"
        element={
          <RequireAuth>
            <AppLayout>
              <ProtocolList />
            </AppLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/protokolle/:id"
        element={
          <RequireAuth>
            <AppLayout nav={false}>
              <ProtocolDetail />
            </AppLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/protokolle/:id/bearbeiten"
        element={
          <RequireAuth>
            <AppLayout nav={false}>
              <NewProtocolWizard />
            </AppLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/kalender"
        element={
          <RequireAuth>
            <AppLayout>
              <CalendarPage />
            </AppLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/profil"
        element={
          <RequireAuth>
            <AppLayout>
              <Profile />
            </AppLayout>
          </RequireAuth>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
