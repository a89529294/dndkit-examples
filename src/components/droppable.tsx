import { useDroppable } from "@dnd-kit/core";
import { ReactNode } from "react";

function Droppable({ children, id }: { children: ReactNode; id?: string }) {
  // only id and setNodeRef are mandatory
  const { isOver, setNodeRef } = useDroppable({
    id: id ?? "droppable",
    data: {
      accepts: ["type1", "type2"],
    },
  });

  const style = {
    color: isOver ? "green" : undefined,
    height: "200px",
    border: "1px solid black",
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
}
export default Droppable;
