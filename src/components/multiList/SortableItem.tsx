import { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import useMountStatus from "../../utils/useMountStatus";
import { CSS } from "@dnd-kit/utilities";
interface SortableItemProps {
  containerId: UniqueIdentifier;
  id: UniqueIdentifier;
  index: number;
  disabled?: boolean;
  getIndex(id: UniqueIdentifier): number;
}

export function SortableItem({ disabled, id, index, containerId, getIndex }: SortableItemProps) {
  const {
    setNodeRef,
    setActivatorNodeRef,
    listeners,
    isDragging,
    isSorting,
    over,
    overIndex,
    transform,
    transition,
    attributes,
  } = useSortable({
    id,
  });
  const mounted = useMountStatus();
  const mountedWhileDragging = isDragging && !mounted;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="py-5 bg-blue-200 grid place-items-center">
      {id}
    </li>
  );
}
