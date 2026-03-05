import { Outlet } from "react-router-dom";
import { TopBar } from "./TopBar";

export function DashboardLayout() {
  return (
    <main className="min-h-screen bg-background">
      <div className="p-6 max-w-4xl mx-auto">
        <TopBar />
        <Outlet />
      </div>
    </main>
  );
}
