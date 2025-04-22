import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TracksPage from "@/pages/TracksPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/tracks" />} />
        <Route path="/tracks" element={<TracksPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
