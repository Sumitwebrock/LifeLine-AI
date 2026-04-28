import { createBrowserRouter } from "react-router";
import { RootLayout } from "./layouts/RootLayout";
import { LandingPage } from "./pages/LandingPage";
import { LoginSignupPage } from "./pages/LoginSignupPage";
import { DashboardPage } from "./pages/DashboardPage";
import { MapPage } from "./pages/MapPage";
// import { EmergenciesPage } from "./pages/EmergenciesPage";
import { RespondersPage } from "./pages/RespondersPage";
import { ResourcesPage } from "./pages/ResourcesPage";
import { AIInsightsPage } from "./pages/AIInsightsPage";
import { AlertsPage } from "./pages/AlertsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SettingsPage } from "./pages/SettingsPage";
import { ResponderPortalPage } from "./pages/ResponderPortalPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/login",
    Component: LoginSignupPage,
  },
  {
    path: "/responder",
    Component: ResponderPortalPage,
  },
  {
    path: "/app",
    Component: RootLayout,
    children: [
      { index: true, Component: DashboardPage },
      { path: "map", Component: MapPage },
      // { path: "emergencies", Component: EmergenciesPage },
      { path: "responders", Component: RespondersPage },
      { path: "resources", Component: ResourcesPage },
      { path: "insights", Component: AIInsightsPage },
      { path: "alerts", Component: AlertsPage },
      { path: "profile", Component: ProfilePage },
      { path: "settings", Component: SettingsPage },
      { path: "*", Component: NotFoundPage },
    ],
  },
  {
    path: "*",
    Component: NotFoundPage,
  },
]);
