import { createRoot } from "react-dom/client";
import { AppProvider } from "./config/state";
import { DragProvider } from "./sidebar/utils/dragDrop";
import { SearchProvider } from "./sidebar/utils/search";
import { TooltipProvider } from "./shared/components/Tooltip";
import Sidebar from "./sidebar";

const isPage = new URLSearchParams(window.location.search).get("mode") === "page";
document.documentElement.setAttribute(isPage ? "as-page" : "in-sidebar", "");

createRoot(document.getElementById("root")).render(
  <AppProvider>
    <DragProvider>
      <SearchProvider>
        <TooltipProvider>
          <Sidebar />
        </TooltipProvider>
      </SearchProvider>
    </DragProvider>
  </AppProvider>
);