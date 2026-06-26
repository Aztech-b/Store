import NavBar from "./components/NavBar";
import { ThemeProvider } from "./hooks/useTheme";

function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <div className="min-w-screen flex justify-center">
                <div className="max-w-max-content w-full">
                    <NavBar />
                </div>
            </div>
        </ThemeProvider>
    );
}

export default App;
