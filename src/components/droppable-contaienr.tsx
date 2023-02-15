import { UniqueIdentifier } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { AnimateLayoutChanges, defaultAnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";
import clsx from "clsx";
import { ReactNode } from "react";
import styles from "./Container.module.css";

const animateLayoutChanges: AnimateLayoutChanges = (args) =>
  defaultAnimateLayoutChanges({ ...args, wasDragging: true });

//               id={containerId}
//               label={minimal ? undefined : `Column ${containerId}`}
//               columns={columns}
//               items={items[containerId]}
//               onRemove={() => handleRemove(containerId)}

function DroppableContainer({
  children,
  id,
  items,
  onRemove,
  ...props
}: {
  children: ReactNode;
  id: UniqueIdentifier;
  items: UniqueIdentifier[];
  onRemove: () => void;
  style?: React.CSSProperties;
}) {
  const { active, attributes, isDragging, listeners, over, setNodeRef, transition, transform } = useSortable({
    id,
    data: {
      type: "container",
      children: items,
    },
    animateLayoutChanges,
  });
  const isOverContainer = over
    ? (id === over.id && active?.data.current?.type !== "container") || items.includes(over.id)
    : false;

  return (
    <div
      ref={setNodeRef}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : undefined,
      }}
      className={clsx(isOverContainer && styles.hover, styles.scrollable, styles.shadow)}
      {...props}>
      {children}
    </div>
  );
}

export default DroppableContainer;
