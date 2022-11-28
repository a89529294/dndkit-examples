import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

import { SortableItem } from "../components/SortableItem";

function SortableSingleList() {
  const [items, setItems] = useState([1, 2, 3]);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <ul className="flex flex-col w-40 gap-5">
          {items.map((id) => (
            <SortableItem key={id} id={id} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    //   make sure the ids are numbers
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id as number);
        const newIndex = items.indexOf(over.id as number);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }
}

export default SortableSingleList;
