import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import SessionDetail from "@/pages/SessionDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<SessionDetail />} />
          <Route path="/editions/:id" element={<SessionDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
