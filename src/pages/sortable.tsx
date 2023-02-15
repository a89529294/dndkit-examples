import { useEffect, useRef, useState } from "react";
import {
  DndContext,
  useSensor,
  useSensors,
  UniqueIdentifier,
  MouseSensor,
  TouchSensor,
  MeasuringStrategy,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { SortableItem } from "../components/sortable-item";
import {
  collisionDetectionStrategy,
  createRange,
  dropAnimation,
  getIndex,
  onDragCancel,
  onDragEnd,
  onDragOver,
} from "../utils";
import DroppableContainer from "../components/droppable-contaienr";
import { createPortal } from "react-dom";
import { Item } from "../components/Item";

export type Items = Record<string, UniqueIdentifier[]>;

function Sortable() {
  const [items, setItems] = useState<Items>({
    A: createRange(3, (index) => `A${index + 1}`),
    B: createRange(3, (index) => `B${index + 1}`),
    C: createRange(3, (index) => `C${index + 1}`),
    D: createRange(3, (index) => `D${index + 1}`),
  });
  const [containers, setContainers] = useState(Object.keys(items) as UniqueIdentifier[]);
  const [clonedItems, setClonedItems] = useState<Items | null>(null);

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const lastOverId = useRef<UniqueIdentifier | null>(null);
  const recentlyMovedToNewContainer = useRef(false);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false;
    });
  }, [items]);

  function handleRemove(containerID: UniqueIdentifier) {
    setContainers((containers) => containers.filter((id) => id !== containerID));
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={(arg) =>
        collisionDetectionStrategy(arg, {
          activeId,
          items,
          lastOverId,
          recentlyMovedToNewContainer,
        })
      }
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
      onDragStart={({ active }) => {
        setActiveId(active.id);
        setClonedItems(items);
      }}
      onDragOver={(e) => onDragOver(e, { items, recentlyMovedToNewContainer, setItems })}
      onDragEnd={(e) => onDragEnd(e, { items, setActiveId, setContainers, setItems })}
      onDragCancel={() => onDragCancel({ clonedItems, setActiveId, setClonedItems, setItems })}>
      <div className="flex gap-10">
        {containers.map((containerId) => (
          <DroppableContainer
            key={containerId}
            id={containerId}
            items={items[containerId]}
            onRemove={() => handleRemove(containerId)}>
            <SortableContext items={items[containerId]} strategy={verticalListSortingStrategy}>
              {items[containerId].map((value, index) => {
                return <SortableItem key={value} id={value} index={index} />;
              })}
            </SortableContext>
          </DroppableContainer>
        ))}
      </div>
      {createPortal(
        <DragOverlay dropAnimation={dropAnimation}>
          {activeId ? renderSortableItemDragOverlay(activeId) : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}

function renderSortableItemDragOverlay(id: UniqueIdentifier) {
  return <Item value={id} dragOverlay />;
}

export default Sortable;
