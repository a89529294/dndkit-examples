import { ReactNode, useState } from "react";
import { DndContext, DragOverlay, DragStartEvent, UniqueIdentifier } from "@dnd-kit/core";

import StationeryDraggable from "../components/stationery-draggable";

/* The implementation details of <Item> and <ScrollableList> are not
 * relevant for this example and are therefore omitted. */

function UsingDragOverlay() {
  const [items] = useState(["1", "2", "3", "4", "5"]);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div>
        {items.map((id) => (
          <StationeryDraggable key={id} id={id}>
            <Item>{`Item ${id}`}</Item>
          </StationeryDraggable>
        ))}
      </div>

      <DragOverlay>{activeId ? <Item>{`Item ${activeId}`}</Item> : null}</DragOverlay>
    </DndContext>
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id);
  }

  function handleDragEnd() {
    setActiveId(null);
  }
}

function Item({ children }: { children: ReactNode }) {
  return <button className="p-1 border-blue-300 border touch-none">{children}</button>;
}

export default UsingDragOverlay;
