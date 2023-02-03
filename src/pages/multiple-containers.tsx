import { useState } from "react";
import { DndContext, DragEndEvent, UniqueIdentifier, useDndMonitor } from "@dnd-kit/core";

import Droppable from "../components/droppable";
import Draggable from "../components/draggable";

function MultipleContainers() {
  const containers = ["A", "B", "C"];
  const [parent, setParent] = useState<UniqueIdentifier | null>(null);
  const draggableMarkup = <Draggable id="draggable">Drag me</Draggable>;

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="h-20">{parent === null ? draggableMarkup : null}</div>
      {containers.map((id) => (
        <Droppable key={id} id={id}>
          {parent === id ? draggableMarkup : "Drop here"}
        </Droppable>
      ))}
    </DndContext>
  );

  function handleDragEnd(event: DragEndEvent) {
    // active which is the draggable item, over which is the droppable area
    const { over, active } = event;
    // console.log(over, active);
    // If the item is dropped over a container, set it as the parent
    // otherwise reset the parent to `null`
    setParent(over ? over.id : null);
  }
}

export default MultipleContainers;
