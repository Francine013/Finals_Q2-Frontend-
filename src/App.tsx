import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { TodoProvider } from "./context/TodoContext";
import { Navbar, ChainBanner, Footer } from "./components/Layout";
import { TodoPage } from "./pages/TodoPage";
import { AboutPage } from "./pages/AboutPage";

export default function App() {
  return (
    <ThemeProvider>
      <TodoProvider>
        <Navbar />
        <ChainBanner />
        <Routes>
          <Route path="/" element={<TodoPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
        <Footer />
      </TodoProvider>
    </ThemeProvider>
  );
}
