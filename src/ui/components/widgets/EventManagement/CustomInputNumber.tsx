import { Add, Remove } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import React from "react";

type CustomInputNumberProps = {
  value: Number;
  setValue: (value: React.SetStateAction<number>) => void;
  isMinutes?: boolean;
};

const CustomInputNumber = (props: CustomInputNumberProps) => {
  return (
    <TextField
      type="number"
      value={props.value}
      onChange={(val) => {
        props.setValue(Number(val.target.value));
      }}
      sx={{
        width: props.isMinutes ? "48%" : "100%",
        backgroundColor: "#0A0A0A",
        "& .MuiInputLabel-root": {
          textAlign: "center",
        },
        "& .MuiInputBase-root": {
          textAlign: "center",
        },
      }}
      InputProps={{
        style: {
          direction: "ltr",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        },
        sx: {
          "&::placeholder": {
            color: "white",
            textAlign: "center",
          },
        },
        startAdornment: (
          <InputAdornment position="start">
            <IconButton
              onClick={() => {
                if (props.value === 0) return;
                props.setValue(props.value.valueOf() - 1);
              }}
            >
              <Remove />
            </IconButton>
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => {
                props.setValue(props.value.valueOf() + 1);
              }}
            >
              <Add />
            </IconButton>
          </InputAdornment>
        ),
      }}
      inputProps={{
        placeholder: "Select",
        style: {
          height: "50px",
          padding: 0,
          paddingLeft: 8,
          textAlign: "center",
        },
      }}
    ></TextField>
  );
};

export default React.memo(CustomInputNumber);
