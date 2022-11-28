import React, { useState } from "react";
import { DndContext, DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import { Droppable } from "./components/Droppable";
import { Draggable } from "./components/Draggable";
import {
  Outlet,
  RouterProvider,
  Link,
  createReactRouter,
  createRouteConfig,
} from "@tanstack/react-router";

import "./App.css";
import BasicExample from "./pages/BasicExample";
import SortableSingleList from "./pages/SortableSingleList";
import SortableMultipleLists from "./pages/SortableMultipleLists";

const rootRoute = createRouteConfig();

const indexRoute = rootRoute.createRoute({
  path: "/",
  component: BasicExample,
});
const sortableSingleListRoute = rootRoute.createRoute({
  path: "/sortable-single-list",
  component: SortableSingleList,
});
const sortableMultipleListsRoute = rootRoute.createRoute({
  path: "/sortable-multi-lists",
  component: SortableMultipleLists,
});

const routeConfig = rootRoute.addChildren([
  indexRoute,
  sortableSingleListRoute,
  sortableMultipleListsRoute,
]);
const router = createReactRouter({ routeConfig });

function App() {
  return (
    <>
      <RouterProvider router={router}>
        <div className="flex gap-5">
          <Link to="/">Basic Example</Link>
          <Link to="/sortable-single-list">Sortable Single List</Link>
          <Link to="/sortable-multi-lists">Sortable Multi Lists</Link>
        </div>
        <hr />
        <Outlet />
      </RouterProvider>
    </>
  );
}

export default App;
