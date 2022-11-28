import React, { ReactNode } from "react";
import { useDroppable } from "@dnd-kit/core";

export function Droppable(props: { children: ReactNode; id: string }) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  });
  const style = {
    color: isOver ? "green" : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  );
}
