import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { Outlet, RouterProvider, Link, ReactRouter, Route, RootRoute } from "@tanstack/react-router";
import "./index.css";

import Index from "./pages";
import SingleContainer from "./pages/single-container";
import MultipleContainers from "./pages/multiple-containers";
import UsingDragOverlay from "./pages/using-dragoverlay";
import Sortable from "./pages/sortable";

// Create a root route
const rootRoute = new RootRoute({
  component: Root,
});

function Root() {
  return (
    <div className="p-3">
      <div className="flex gap-3">
        <Link to="/">Index</Link> <Link to="/single-container">Single Container</Link>
        <Link to="/multiple-containers">Multiple Containers</Link>
        <Link to="/using-dragoverlay">Drag Overlay</Link>
        <Link to="/sortable">Sortable</Link>
      </div>
      <hr />
      <Outlet />
    </div>
  );
}

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Index,
});

const singleContainerRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/single-container",
  component: SingleContainer,
});

const multipleContainersRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/multiple-containers",
  component: MultipleContainers,
});

const usingDragOverlay = new Route({
  getParentRoute: () => rootRoute,
  path: "/using-dragoverlay",
  component: UsingDragOverlay,
});

const sortable = new Route({
  getParentRoute: () => rootRoute,
  path: "/sortable",
  component: Sortable,
});

// Create the route tree using your routes
const routeTree = rootRoute.addChildren([
  indexRoute,
  singleContainerRoute,
  multipleContainersRoute,
  usingDragOverlay,
  sortable,
]);

// Create the router using your route tree
const router = new ReactRouter({ routeTree });

// Register your router for maximum type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render our app!
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}
