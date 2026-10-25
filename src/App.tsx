import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import RegisterVisitor from "./pages/RegisterVisitor";
import VisitorHistory from "./pages/VisitorHistory";
import VisitLogs from "./pages/VisitLogs";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/register" element={<RegisterVisitor />} />

        <Route path="/history" element={<VisitorHistory />} />

        <Route path="/visit-logs" element={<VisitLogs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
