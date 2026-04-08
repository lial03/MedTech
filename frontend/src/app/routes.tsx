import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { NexusDashboard } from "./pages/NexusDashboard";
import { Assets } from "./pages/Assets";
import { WorkOrders } from "./pages/WorkOrders";
import { Inventory } from "./pages/Inventory";
import { Technicians } from "./pages/Technicians";
import { Analytics } from "./pages/Analytics";
import { Settings } from "./pages/Settings";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: NexusDashboard },
      { path: "assets", Component: Assets },
      { path: "work-orders", Component: WorkOrders },
      { path: "inventory", Component: Inventory },
      { path: "technicians", Component: Technicians },
      { path: "analytics", Component: Analytics },
      { path: "settings", Component: Settings },
      { path: "*", Component: NotFound },
    ],
  },
]);
