import { InputLabel } from "@mui/material";
import React from "react";

type CustomInputLabelProps = {
  label: string;
};

const CustomInputLabel = (props: CustomInputLabelProps) => {
  return (
    <InputLabel
      sx={{
        color: "#D5E2F0",
        pb: 1,
        pt: 1,
        pl: 0.5,
        fontWeight: 400,
        fontSize: 14,
        fontFamily: "Inter",
      }}
    >
      {props.label}
    </InputLabel>
  );
};

export default React.memo(CustomInputLabel);
