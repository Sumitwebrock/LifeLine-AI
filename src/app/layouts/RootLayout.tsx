import { Outlet } from "react-router";
import { LeftSidebar } from "../components/LeftSidebar";

export function RootLayout() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-[#F8FAFC] flex" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Left Sidebar */}
      <LeftSidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
