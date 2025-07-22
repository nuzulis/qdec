import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import BasicTables from "./pages/Tables/BasicTables";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import ScanDeklarasi from "./pages/Tables/ScanDeklarasi";

export default function App() {
  return (
    <Router basename="/officer">
      <ScrollToTop />
      <Routes>
        {/* All pages with sidebar + header */}
        <Route element={<AppLayout />}>
          <Route
            index
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/basic-tables"
            element={
              <ProtectedRoute>
                <BasicTables />
              </ProtectedRoute>
            }
          />
          <Route
            path="/scan-deklarasi"
            element={
              <ProtectedRoute>
                <ScanDeklarasi />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Auth Layout (no sidebar) */}
        <Route path="/signin" element={<SignIn />} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
