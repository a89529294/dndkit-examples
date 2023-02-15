import React, { useEffect } from "react";
import clsx from "clsx";
import type { DraggableSyntheticListeners } from "@dnd-kit/core";
import type { Transform } from "@dnd-kit/utilities";

import styles from "./Item.module.css";

export interface Props {
  dragOverlay?: boolean;
  dragging?: boolean;
  index?: number;
  fadeIn?: boolean;
  transform?: Transform | null;
  listeners?: DraggableSyntheticListeners;
  sorting?: boolean;
  style?: React.CSSProperties;
  transition?: string | null;
  value: React.ReactNode;
  onRemove?(): void;
}

export const Item = React.memo(
  React.forwardRef<HTMLLIElement, Props>(
    (
      {
        dragOverlay,
        dragging,
        fadeIn,
        index,
        listeners,
        onRemove,
        sorting,
        style,
        transition,
        transform,
        value,
        ...props
      },
      ref
    ) => {
      useEffect(() => {
        if (!dragOverlay) {
          return;
        }

        document.body.style.cursor = "grabbing";

        return () => {
          document.body.style.cursor = "";
        };
      }, [dragOverlay]);

      return (
        <li
          className={clsx(fadeIn && styles.fadeIn, sorting && styles.sorting, dragOverlay && styles.dragOverlay)}
          style={
            {
              "--translate-x": transform ? `${Math.round(transform.x)}px` : undefined,
              "--translate-y": transform ? `${Math.round(transform.y)}px` : undefined,
              "--scale-x": transform?.scaleX ? `${transform.scaleX}` : undefined,
              "--scale-y": transform?.scaleY ? `${transform.scaleY}` : undefined,
              "--index": index,
            } as React.CSSProperties
          }
          ref={ref}>
          <div
            className={clsx(
              styles.Item,
              dragging && styles.dragging,

              dragOverlay && styles.dragOverlay
            )}
            style={style}
            data-cypress="draggable-item"
            {...listeners}
            {...props}>
            {value}
            <span className={styles.Actions}>
              {onRemove ? (
                <button className={styles.Remove} onClick={onRemove}>
                  X
                </button>
              ) : null}
            </span>
          </div>
        </li>
      );
    }
  )
);
