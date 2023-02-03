import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { ReactNode } from "react";

function Draggable({ children, id }: { children: ReactNode; id?: string }) {
  // attributes mostly for accessibility
  // listeners is an object of the form {onKeyDown:f, onPointerDown:f }
  // transform is null when the draggable item is stationary, if its being dragged it becomes
  // {x:number, y:number, scaleX:number, scaleY:number}
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id ?? "draggable",
    data: {
      type: "type1",
    },
  });

  // The following are equivalent
  //   const style = {
  //     transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
  //   };
  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <button
      className="border p-2 border-blue-300 touch-none"
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}>
      {children}
    </button>
  );
}
export default Draggable;
