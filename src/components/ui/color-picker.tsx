import { cn } from "@/lib/utils";
import * as React from "react";

export interface Color {
  name: string;
  value: string;
}

interface ColorSwatchProps {
  color: Color;
  isSelected: boolean;
  onColorChange: (color: Color) => void;
  size?: "sm" | "md" | "lg";
  atLeastOneColorSelected: boolean;
}

export const sizeClasses = {
  sm: "size-6",
  md: "size-8",
  lg: "size-10",
};

export function ColorSwatch({
  color,
  isSelected,
  onColorChange,
  size = "md",
  atLeastOneColorSelected,
}: ColorSwatchProps) {
  const displayName = color.name;
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <button
      className={cn(
        "rounded-full ring ring-accent cursor-pointer transition-[outline,box-shadow,opacity] relative overflow-hidden",
        sizeClasses[size],
        isSelected
          ? "ring-2 opacity-100 ring-primary/80"
          : atLeastOneColorSelected
          ? "opacity-40 hover:ring-primary/30 hover:opacity-70"
          : "opacity-100"
      )}
      title={displayName}
      onClick={() => onColorChange(color)}
      aria-pressed={isSelected}
      aria-label={`Select color: ${displayName}`}
    >
      <div className="w-full h-full" style={{ backgroundColor: color.value }} />
      <span className="sr-only">{displayName}</span>
    </button>
  );
}

interface ColorPickerProps {
  colors: Color[];
  selectedColors: Color[];
  onColorChange: (color: Color) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ColorPicker({
  colors,
  selectedColors,
  onColorChange,
  size = "md",
  className,
}: ColorPickerProps) {
  const atLeastOneColor = selectedColors.length > 0;

  // Helper function to compare colors for selection state
  const isColorSelected = (color: Color) => {
    return selectedColors.some((selectedColor) => {
      if (Array.isArray(color) && Array.isArray(selectedColor)) {
        return (
          color[0].value === selectedColor[0].value &&
          color[1].value === selectedColor[1].value
        );
      } else if (!Array.isArray(color) && !Array.isArray(selectedColor)) {
        return color.value === selectedColor.value;
      }
      return false;
    });
  };

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {colors.map((color) => (
        <div key={color.value} className={sizeClasses[size]}>
          <ColorSwatch
            color={color}
            isSelected={isColorSelected(color)}
            onColorChange={onColorChange}
            size={size}
            atLeastOneColorSelected={atLeastOneColor}
          />
        </div>
      ))}
    </div>
  );
}
