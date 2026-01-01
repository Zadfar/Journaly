import { createBrowserRouter } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import AppLayout from "./components/AppLayout";
import ProfilePage from "./pages/ProfilePage";
import JournalsPage from "./pages/JournalsPage";
import JournalEntryPage from "./pages/JournalEntryPage";
import InsightsPage from "./pages/InsightsPage";

export const router = createBrowserRouter([
    { 
        path: "/", 
        element: <PublicRoute><LandingPage /></PublicRoute> 
    },
    { 
        path: "/signup", 
        element: <PublicRoute><SignupPage /></PublicRoute> 
    },
    { 
        path: "/login", 
        element: <PublicRoute><LoginPage /></PublicRoute> 
    },
    { 
        path: "/home", 
        element: (
            <PrivateRoute>
                <AppLayout>
                    <HomePage />
                </AppLayout>
            </PrivateRoute>
        )
    }, 
    {
        path: "/profile",
        element: (
            <PrivateRoute>
                <AppLayout>
                    <ProfilePage />
                </AppLayout>
            </PrivateRoute>
        )
    },
    {
        path: "/journals",
        element: (
            <PrivateRoute>
                <AppLayout>
                    <JournalsPage />
                </AppLayout>
            </PrivateRoute>
        )
    },
    {
        path: "/journal/new",
        element: (
            <PrivateRoute>
                <AppLayout>
                    <JournalEntryPage />
                </AppLayout>
            </PrivateRoute>
        )
    },
    {
        path: "/journal/:id",
        element: (
            <PrivateRoute>
                <AppLayout>
                    <JournalEntryPage />
                </AppLayout>
            </PrivateRoute>
        )
    },
    {
        path: "/insights",
        element: (
            <PrivateRoute>
                <AppLayout>
                    <InsightsPage />
                </AppLayout>
            </PrivateRoute>
        )
    },
]);