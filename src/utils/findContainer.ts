import { UniqueIdentifier } from "@dnd-kit/core";
import { Items } from "../pages/SortableMultipleLists";

export default function findContainer(id: UniqueIdentifier, items: Items) {
  if (id in items) {
    return id;
  }

  return Object.keys(items).find((key) => items[key].includes(id));
}
