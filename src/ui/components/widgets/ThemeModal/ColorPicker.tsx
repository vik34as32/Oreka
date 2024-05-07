import React, { useState, useEffect, useRef } from "react";
import { SketchPicker, ColorResult } from "react-color";
import { Box } from "@mui/material";

type ColorPickerProps = {
  defaultColor: string;
  onChange: (color: string) => void;
  index: number;
};

const ColorPicker: React.FC<ColorPickerProps> = ({ defaultColor, onChange, index }) => {
  const [displayPicker, setDisplayPicker] = useState(false);
  const [color, setColor] = useState(defaultColor);
  const pickerRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    setDisplayPicker(!displayPicker);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
      setDisplayPicker(false);
    }
  };

  const handleChange = (color: ColorResult) => {
    setColor(color.hex);
    onChange(color.hex);
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    setColor(defaultColor);
  }, [defaultColor]);

  return (
    <Box border={1} borderColor="#2B3348" sx={{ position: "relative", width: 40, height: 40 }} ref={pickerRef}>
      <Box
        sx={{ width: "100%", height: "100%", cursor: "pointer", backgroundColor: color }}
        onClick={handleClick}
      />
      {displayPicker && (
        <Box sx={{ 
          position: "absolute",
          zIndex: 999,
          ...(index === 0 ? { top: "100%",left: "120%" } : null),
          ...(index === 1 || index === 2 ? { top: "-130%", left: "120%" } : null),
          ...(index === 3 ? { top: "-230%", left: "120%" } : null),
          ...(index > 3 ? { bottom: "100%",left: "120%" } : null),
          }}>
          <SketchPicker color={color} onChange={handleChange} />
        </Box>
      )}
    </Box>
  );
};

export default ColorPicker;
