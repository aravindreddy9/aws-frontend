import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "./Components/Auth";
import AdminPage from "./Components/Admin";
import User from "./Components/User";
import Developer from "./Components/Developer";
import ProtectedRoute from "./Components/ProtectedRoute";

// Dummy function – Replace with real logic
const getCurrentUserRole = () => {
  return sessionStorage.getItem("userRole"); // 'Admins', 'Devs', 'Users'
};

function App() {
  const userRole = getCurrentUserRole();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["Admins"]} userRole={userRole}>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRoles={["Users"]} userRole={userRole}>
              <User />
            </ProtectedRoute>
          }
        />

        <Route
          path="/developer"
          element={
            <ProtectedRoute allowedRoles={["Devs"]} userRole={userRole}>
              <Developer />
            </ProtectedRoute>
          }
        />
        
        {/* Optional: Add unauthorized page */}
        <Route path="/unauthorized" element={<div>Unauthorized Access!!!</div>} />
      </Routes>
    </Router>
  );
}

export default App;
