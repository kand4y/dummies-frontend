import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/auth-context";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { RootPage } from "@/pages/root-page";
import { AuthPage } from "@/pages/auth-page";
import { UserPage } from "@/pages/user-page";
import { ProjectsPage } from "@/pages/projects-page";
import { ProjectDetailPage } from "@/pages/project-detail-page";
import { DummyDataPage } from "@/pages/dummy-data-page";
import { NotFoundPage } from "@/pages/not-found-page";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<RootPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/user"
            element={
              <ProtectedRoute>
                <UserPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <ProjectsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/:id"
            element={
              <ProtectedRoute>
                <ProjectDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/:id/:uuid"
            element={
              <ProtectedRoute>
                <DummyDataPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
