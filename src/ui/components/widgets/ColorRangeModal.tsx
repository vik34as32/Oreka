import { Box, Grid, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { GridTheme } from "./ColorTempleteModal";
import { Theme } from "./ThemeModal/ThemeTemplateModal";

export type ColorRangeProps = {
  selectedTheme: Theme
  index: number;
  changeValue: (index: number, value: number) => void;
  range: number[];
};

const ColorRangeModal = (props: ColorRangeProps) => {

  const localRange = props.range;

  const [inputText, setInputText] = useState<string>(String(props.range[props.index]));

  const handleInputChange = (event: any) => {
    if(props.index === 6){
      return;
    }
    let newValue = event.target.value;
    setInputText(String(newValue));
    if (!isNaN(newValue)) {
      newValue = parseInt(newValue, 10);
      if (!isNaN(newValue)) {
        props.changeValue(props.index, newValue);
      }
    }
  }

  const handlePrevValue = () => {
    if (props.index === 0) return props.range[props.index] + " or greater";
    if (props.index === 6) return props.range[props.index] + " or lesser"
    else return props.range[props.index] + " to " + props.range[props.index - 1];
  };

  useEffect(() => {
    setInputText(String(props.range[props.index]));
  }, [props.range]);



  const handleOnBlur = (event: any) => {
    if(props.index === 6){
      return;
    }
    let newValue = parseInt(event.target.value, 10);
    if (!isNaN(newValue)) {
      setInputText(String(newValue));
      props.changeValue(props.index, newValue);
    } else {
      setInputText(String(0));
      props.changeValue(props.index, 0);
    }
  }


  return (
    <Grid
      container
      spacing={GridTheme.spacing}
      sx={{ mt: 0.5 }}
    >
      <Grid item xs={GridTheme.col1}>
        <Box
          border={1}
          borderColor="#2B3348"
          sx={{
            width: 40,
            height: 40,
            backgroundColor: props.selectedTheme.color[props.index],

          }}
        />
      </Grid>
      <Grid item xs={GridTheme.col2}>
        <TextField
          sx={{ background: "#0A0A0A", mr: 5, borderRadius : 1, borderColor : "#2B3349"}}
          size="small"
          margin="none"
          type="text"
          value={inputText}
          InputProps={{
            className : "normal-text"
          }}
          onBlur={(e) => handleOnBlur(e)}
          onChange={(e) => handleInputChange(e)}
          variant="outlined"
        />
      </Grid>
      <Grid item xs={GridTheme.col3}>
        <Box
          border={1}
          borderColor="#2B3348"
          alignContent={"center"}
          sx={{
            backgroundColor: props.selectedTheme.color[props.index],
            p: 1,
            color: "white",
          }}
        >
          <span style={{color : props.selectedTheme.fontColor[props.index]}} className="normal-text">
            {handlePrevValue()}
          </span>
          
        </Box>
      </Grid>
    </Grid>
  );
};

export default ColorRangeModal;
