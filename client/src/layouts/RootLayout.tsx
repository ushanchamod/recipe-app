import { Outlet } from "react-router-dom";
import TopBar from "../components/TopBar";
import RecipePopup from "../components/RecipePopup";
import { usePopUpStore } from "../stores/usePopup";

const RootLayout = () => {
  const { recipe } = usePopUpStore();
  return (
    <div className="flex flex-col h-[100dvh]">
      {/* Top bar stays at top */}
      <TopBar />

      {/* Scrollable content area */}
      <main className="flex-1 overflow-y-auto bg-gray-100 h-full relative">
        {recipe && <RecipePopup />}
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
