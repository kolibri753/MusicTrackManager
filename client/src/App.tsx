import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useTheme } from "@/hooks";
import { Footer, Header } from "@/components";
import TracksPage from "@/pages/TracksPage";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { theme } = useTheme();
  const toastTheme = theme === "dark" ? "light" : "dark";

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/tracks" />} />
        <Route path="/tracks" element={<TracksPage />} />
      </Routes>
      <Footer />

      <ToastContainer
        data-testid="toast-container"
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme={toastTheme}
      />
    </BrowserRouter>
  );
}

export default App;
