import { Navigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext"

const PrivateRoute = ({ children }) => {
    const { session, loading } = UserAuth();

    if (loading) {
        return <div className="h-screen w-screen flex items-center justify-center">Loading...</div>
    }

    if (!session) {
        return <Navigate to="/" />;
    }
    return children;
}

export default PrivateRoute