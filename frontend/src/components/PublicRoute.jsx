import { Navigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { session, loading } = UserAuth();

  if (loading) {
     return <div className="h-screen w-screen flex items-center justify-center">Loading...</div>;
  }

  if (session) {
    return <Navigate to="/home" />;
  }

  return children;
};

export default PublicRoute;