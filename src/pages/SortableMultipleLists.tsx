import { useRef, useState } from "react";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  UniqueIdentifier,
  MeasuringStrategy,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

import { SortableItem } from "../components/multiList/SortableItem";
import collisionDetectionStrategy from "../utils/customCollisionStrategy";
import createRange from "../utils/createRange";
import findContainer from "../utils/findContainer";
import DroppableContainer from "../components/multiList/DroppableContainer";

export type Items = Record<UniqueIdentifier, UniqueIdentifier[]>;

function SortableMultipleLists() {
  const [items, setItems] = useState<Items>(() => ({
    A: createRange(3, (index) => `A${index + 1}`),
    B: createRange(4, (index) => `B${index + 1}`),
    C: createRange(1, (index) => `C${index + 1}`),
    D: createRange(2, (index) => `D${index + 1}`),
  }));
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const lastOverId = useRef<UniqueIdentifier | null>(null);
  const recentlyMovedToNewContainer = useRef(false);
  const [clonedItems, setClonedItems] = useState<Items | null>(null);
  const [containers, setContainers] = useState(Object.keys(items) as UniqueIdentifier[]);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const isSortingContainer = activeId ? containers.includes(activeId) : false;

  function handleRemove(containerID: UniqueIdentifier) {
    setContainers((containers) => containers.filter((id) => id !== containerID));
  }

  const getIndex = (id: UniqueIdentifier) => {
    const container = findContainer(id, items);

    if (!container) {
      return -1;
    }

    const index = items[container].indexOf(id);

    return index;
  };

  const onDragCancel = () => {
    if (clonedItems) {
      // Reset items to their original state in case items have been
      // Dragged across containers
      setItems(clonedItems);
    }

    setActiveId(null);
    setClonedItems(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={(args) =>
        collisionDetectionStrategy(args, activeId, lastOverId, recentlyMovedToNewContainer, items)
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
      onDragOver={({ active, over }) => {
        const overId = over?.id;

        if (overId == null || active.id in items) {
          return;
        }

        const overContainer = findContainer(overId, items);
        const activeContainer = findContainer(active.id, items);

        if (!overContainer || !activeContainer) {
          return;
        }

        if (activeContainer !== overContainer) {
          setItems((items) => {
            const activeItems = items[activeContainer];
            const overItems = items[overContainer];
            const overIndex = overItems.indexOf(overId);
            const activeIndex = activeItems.indexOf(active.id);

            let newIndex: number;

            if (overId in items) {
              newIndex = overItems.length + 1;
            } else {
              const isBelowOverItem =
                over &&
                active.rect.current.translated &&
                active.rect.current.translated.top > over.rect.top + over.rect.height;

              const modifier = isBelowOverItem ? 1 : 0;

              newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
            }

            recentlyMovedToNewContainer.current = true;

            return {
              ...items,
              [activeContainer]: items[activeContainer].filter((item) => item !== active.id),
              [overContainer]: [
                ...items[overContainer].slice(0, newIndex),
                items[activeContainer][activeIndex],
                ...items[overContainer].slice(newIndex, items[overContainer].length),
              ],
            };
          });
        }
      }}
      onDragEnd={({ active, over }) => {
        if (active.id in items && over?.id) {
          setContainers((containers) => {
            const activeIndex = containers.indexOf(active.id);
            const overIndex = containers.indexOf(over.id);

            return arrayMove(containers, activeIndex, overIndex);
          });
        }

        const activeContainer = findContainer(active.id, items);

        if (!activeContainer) {
          setActiveId(null);
          return;
        }

        const overId = over?.id;

        if (overId == null) {
          setActiveId(null);
          return;
        }

        const overContainer = findContainer(overId, items);

        if (overContainer) {
          const activeIndex = items[activeContainer].indexOf(active.id);
          const overIndex = items[overContainer].indexOf(overId);

          if (activeIndex !== overIndex) {
            setItems((items) => ({
              ...items,
              [overContainer]: arrayMove(items[overContainer], activeIndex, overIndex),
            }));
          }
        }

        setActiveId(null);
      }}
      onDragCancel={onDragCancel}>
      <div
        style={{
          display: "inline-grid",
          boxSizing: "border-box",
          padding: 20,
          gridAutoFlow: "row",
        }}>
        {containers.map((containerId) => (
          <DroppableContainer
            key={containerId}
            id={containerId}
            label={`Column ${containerId}`}
            columns={1}
            items={items[containerId]}
            scrollable={true}
            style={{}}
            onRemove={() => handleRemove(containerId)}>
            <SortableContext items={items[containerId]} strategy={verticalListSortingStrategy}>
              {items[containerId].map((value, index) => {
                return (
                  <SortableItem
                    disabled={isSortingContainer}
                    key={value}
                    id={value}
                    index={index}
                    containerId={containerId}
                    getIndex={getIndex}
                  />
                );
              })}
            </SortableContext>
          </DroppableContainer>
        ))}
      </div>
      {/* {createPortal(
        <DragOverlay adjustScale={adjustScale} dropAnimation={dropAnimation}>
          {activeId
            ? containers.includes(activeId)
              ? renderContainerDragOverlay(activeId)
              : renderSortableItemDragOverlay(activeId)
            : null}
        </DragOverlay>,
        document.body
      )} */}
    </DndContext>
  );
}

export default SortableMultipleLists;
