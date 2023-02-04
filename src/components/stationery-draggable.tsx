import { ReactNode } from "react";
import { UniqueIdentifier, useDraggable } from "@dnd-kit/core";

// Note that we are not applying transform onto our div
function StationeryDraggable({ id, children }: { id: UniqueIdentifier; children: ReactNode }) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: id,
  });

  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      {children}
    </div>
  );
}

export default StationeryDraggable;
