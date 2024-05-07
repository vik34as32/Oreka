import { Box, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ColorPicker from "./ColorPicker";
import { GridTheme, Theme } from "./ThemeTemplateModal";

export type ColorRangeProps = {
  selectedTheme: Theme
  index: number;
  changeValue: (index: number, color: string, fontColor: string) => void;
  
};

const ThemeColorPicker = (props: ColorRangeProps) => {

  const [fieldColor, setFieldColor] = useState<string>(props.selectedTheme.color[props.index]);
  const [fontColor, setFontColor] = useState<string>(props.selectedTheme.fontColor[props.index]);

  useEffect(() => {
    setFieldColor(props.selectedTheme.color[props.index]);
    setFontColor(props.selectedTheme.fontColor[props.index]);
  }, [props.selectedTheme]);

  const handleFieldColorChange = (color: string) => {
    setFieldColor(color);
    props.changeValue(props.index, color, fontColor);
  };

  const handleFontColorChange = (color: string) => {
    setFontColor(color);
    props.changeValue(props.index, fieldColor, color);
  };


  return (
    <Grid
      container
      spacing={GridTheme.spacing}
      sx={{ mt: 0.5 }}
    >
      <Grid item xs={GridTheme.col1}>
        <Box
          
          sx={{
            width: 40,
            height: 40,
            backgroundColor: fieldColor,

          }}
        >
          <ColorPicker
            index={props.index}
            defaultColor={fieldColor}
            onChange={handleFieldColorChange}
          />
        </Box>
      </Grid>
      <Grid item xs={GridTheme.col2}>
        <Box
          
          sx={{
            width: 40,
            height: 40,
            backgroundColor: fontColor,

          }}
        >
          <ColorPicker
            index={props.index}
            defaultColor={fontColor}
            onChange={handleFontColorChange}
          />
        </Box>
      </Grid>
      <Grid item xs={GridTheme.col3}>
        <Box
          border={1}
          borderColor="#2B3348"
          alignContent={"center"}
          sx={{
            backgroundColor: fieldColor,
            p: 1
          }}
        >
          <Typography sx={{ color: fontColor }}>Sample Text</Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ThemeColorPicker;
