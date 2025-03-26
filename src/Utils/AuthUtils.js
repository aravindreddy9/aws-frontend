import { jwtDecode } from 'jwt-decode';

export const getUserRoleFromToken = () => {
  const token = sessionStorage.getItem("idToken");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    const groups = decoded["cognito:groups"] || [];
    const role = groups[0] || "User";
    return role;
  } catch (error) {
    console.error("Failed to decode token", error);
    return null;
  }
};

export const signOut = async () => {
    try {
        sessionStorage.removeItem("idToken");
      
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };
