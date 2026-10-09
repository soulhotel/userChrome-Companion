import { createRoot } from "react-dom/client";
import { AppProvider } from "./config/state";
import { TooltipProvider } from "./shared/components/Tooltip";
import Settings from "./settings";

createRoot(document.getElementById("root")).render(
  <AppProvider>
    <TooltipProvider>
      <Settings />
    </TooltipProvider>
  </AppProvider>
);