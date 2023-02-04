import { Fragment, useState } from "react";
import { DndContext, DragEndEvent, UniqueIdentifier, useDndMonitor } from "@dnd-kit/core";

import Droppable from "../components/droppable";
import Draggable from "../components/draggable";

type Item = {
  id: string;
  component: JSX.Element;
  containerId: UniqueIdentifier | null;
};

function MultipleContainers() {
  const containerIds = ["A", "B", "C"];
  const [items, setItems] = useState<Item[]>([
    {
      id: "draggable-1",
      component: <Draggable id="draggable-1">Drag me One</Draggable>,
      containerId: null,
    },
    {
      id: "draggable-2",
      component: <Draggable id="draggable-2">Drag me Two</Draggable>,
      containerId: null,
    },
  ]);

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="h-20">
        {items.map((item) => !item.containerId && <Fragment key={item.id}>{item.component}</Fragment>)}
      </div>
      {containerIds.map((id) => (
        <Droppable id={id} key={id}>
          {items
            .filter((item) => item.containerId === id)
            .map((item) => (
              <Fragment key={item.id}>{item.component}</Fragment>
            ))}
        </Droppable>
      ))}
    </DndContext>
  );

  function handleDragEnd(event: DragEndEvent) {
    // active is the draggable item, over is the droppable area
    const { over, active } = event;

    if (over && active) {
      setItems((items) => items.map((item) => (item.id === active.id ? { ...item, containerId: over.id } : item)));
    }
    if (!over && active) {
      setItems((items) => items.map((item) => (item.id === active.id ? { ...item, containerId: null } : item)));
    }
  }
}

export default MultipleContainers;
