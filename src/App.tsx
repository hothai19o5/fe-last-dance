import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, AuthProvider } from "@/context";
import { DashboardLayout } from "@/components/layout";
import {
  LoginPage,
  DashboardPage,
  UsersPage,
  UserDetailPage,
  DevicesPage,
  SettingsPage,
} from "@/pages";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/users/:id" element={<UserDetailPage />} />
              <Route path="/devices" element={<DevicesPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
