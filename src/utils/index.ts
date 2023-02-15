import {
  closestCenter,
  CollisionDetection,
  defaultDropAnimationSideEffects,
  DragEndEvent,
  DragOverEvent,
  DropAnimation,
  getFirstCollision,
  pointerWithin,
  rectIntersection,
  UniqueIdentifier,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Dispatch, MutableRefObject, SetStateAction } from "react";
import { Items } from "../pages/sortable";

export const createRange = (count: number, transform: (arg: number) => string) => {
  return new Array(count).fill("").map((_, index) => transform(index));
};

export const collisionDetectionStrategy = (
  args: Parameters<CollisionDetection>[0],
  {
    activeId,
    items,
    lastOverId,
    recentlyMovedToNewContainer,
  }: {
    activeId: UniqueIdentifier | null;
    items: Items;
    lastOverId: MutableRefObject<UniqueIdentifier | null>;
    recentlyMovedToNewContainer: MutableRefObject<boolean>;
  }
) => {
  if (activeId && activeId in items) {
    return closestCenter({
      ...args,
      droppableContainers: args.droppableContainers.filter((container) => container.id in items),
    });
  }

  // Start by finding any intersecting droppable
  const pointerIntersections = pointerWithin(args);
  const intersections =
    pointerIntersections.length > 0
      ? // If there are droppables intersecting with the pointer, return those
        pointerIntersections
      : rectIntersection(args);
  let overId = getFirstCollision(intersections, "id");

  if (overId != null) {
    if (overId in items) {
      const containerItems = items[overId];

      // If a container is matched and it contains items (columns 'A', 'B', 'C')
      if (containerItems.length > 0) {
        // Return the closest droppable within that container
        overId = closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(
            (container) => container.id !== overId && containerItems.includes(container.id)
          ),
        })[0]?.id;
      }
    }

    lastOverId.current = overId;

    return [{ id: overId }];
  }

  // When a draggable item moves to a new container, the layout may shift
  // and the `overId` may become `null`. We manually set the cached `lastOverId`
  // to the id of the draggable item that was moved to the new container, otherwise
  // the previous `overId` will be returned which can cause items to incorrectly shift positions
  if (recentlyMovedToNewContainer.current) {
    lastOverId.current = activeId;
  }

  // If no droppable is matched, return the last match
  return lastOverId.current ? [{ id: lastOverId.current }] : [];
};

export const findContainer = (id: UniqueIdentifier, items: Items) => {
  if (id in items) return id;

  return Object.keys(items).find((key) => items[key].includes(id));
};

export const getIndex = (id: UniqueIdentifier, items: Items) => {
  const container = findContainer(id, items);

  if (!container) return -1;

  const index = items[container].indexOf(id);

  return index;
};

export const onDragCancel = ({
  clonedItems,
  setItems,
  setActiveId,
  setClonedItems,
}: {
  clonedItems: Items | null;
  setItems: Dispatch<SetStateAction<Items>>;
  setActiveId: Dispatch<SetStateAction<UniqueIdentifier | null>>;
  setClonedItems: Dispatch<SetStateAction<Items | null>>;
}) => {
  if (clonedItems) {
    // Reset items to their original state in case items have been
    // Dragged across containers
    setItems(clonedItems);
  }

  setActiveId(null);
  setClonedItems(null);
};

export const onDragOver = (
  { active, over }: DragOverEvent,
  {
    items,
    setItems,
    recentlyMovedToNewContainer,
  }: {
    items: Items;
    setItems: Dispatch<SetStateAction<Items>>;
    recentlyMovedToNewContainer: MutableRefObject<boolean>;
  }
) => {
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
};

export const onDragEnd = (
  { active, over }: DragEndEvent,
  {
    items,
    setContainers,
    setActiveId,
    setItems,
  }: {
    items: Items;
    setContainers: Dispatch<SetStateAction<UniqueIdentifier[]>>;
    setActiveId: Dispatch<SetStateAction<UniqueIdentifier | null>>;
    setItems: Dispatch<SetStateAction<Items>>;
  }
) => {
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
};

export const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.5",
      },
    },
  }),
};
