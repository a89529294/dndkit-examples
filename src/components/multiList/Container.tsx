import React, { forwardRef } from "react";

import { Remove } from "./Remove";

export interface ContainerProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  label?: string;
  horizontal?: boolean;
  hover?: boolean;
  handleProps?: React.HTMLAttributes<any>;
  scrollable?: boolean;
  shadow?: boolean;
  placeholder?: boolean;
  unstyled?: boolean;
  onClick?(): void;
  onRemove?(): void;
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      children,
      style,
      handleProps,
      horizontal,
      hover,
      onClick,
      onRemove,
      label,
      placeholder,
      scrollable,
      shadow,
      unstyled,
      ...props
    },
    ref
  ) => {
    const Component = onClick ? "button" : "div";

    return (
      <Component
        {...props}
        ref={ref as any}
        style={style}
        onClick={onClick}
        tabIndex={onClick ? 0 : undefined}
        className="h-[50vh] overflow-y-auto">
        {label ? (
          <div className="w-40">
            {label}
            <div>{onRemove ? <Remove onClick={onRemove} /> : undefined}</div>
          </div>
        ) : null}
        {placeholder ? children : <ul className="flex flex-col gap-5">{children}</ul>}
      </Component>
    );
  }
);
