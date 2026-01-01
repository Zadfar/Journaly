import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [session, setSession] = useState();
    const [loading, setLoading] = useState(true);

    // signup
    const signUpNewUser = async (email, password, fullName, avatarUrl) => {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: fullName,
                    avatar_url: avatarUrl, 
                }
            },
        });

        if (error) {
            console.error("There was an error signing up:",  error);
            return { success: false, error };
        }

        return { success: true, data };
    }

    // signin
    const signInUser = async (email, password ) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            })

            if (error) {
                console.error("sign-in error: ", error);
                return { success: false, error: error.message };
            }
            
            return { success: true, data};
        } catch (error) {
            console.error("There was an error signing in: ", error);
        }
    }

    // signin with google
    const signInUserGoogle = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                }
            }
        })
    }

    // signout
    const signOut = () => {
        const { error } = supabase.auth.signOut();

        if (error) {
            console.error("There was an error signing out:", error);
        }
    }

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        }
    }, []);

    return (
        <AuthContext.Provider value={{ session, signUpNewUser, signInUser, signOut, signInUserGoogle, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const UserAuth = () => {
    return useContext(AuthContext)
}