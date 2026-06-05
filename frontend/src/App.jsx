import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AuthContextProvider } from "./context/AuthContext";
import { QueryClient,  QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from "./context/ThemeContext";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  );
}

export default App;