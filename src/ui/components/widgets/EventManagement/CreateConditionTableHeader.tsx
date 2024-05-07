import { Box, Typography } from "@mui/material";
import React from "react";

const CreateConditionTableHeader = () => {
  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(12, 1fr)"
      gap={2}
      sx={{
        backgroundColor: "#1D222F",
        paddingTop: 0.5,
        paddingBottom: 0.5,
      }}
    >
      <Box gridColumn="span 5">
        <Typography
          sx={{
            pl: 8,
            fontFamily: "Inter",
            fontSize: 14,
            color: "#A9B2CC",
            fontWeight: 500,
          }}
        >
          Type
        </Typography>
      </Box>
      <Box gridColumn="span 3">
        <Typography
          sx={{
            fontFamily: "Inter",
            fontSize: 14,
            color: "#A9B2CC",
            fontWeight: 500,
          }}
        >
          Condition
        </Typography>
      </Box>
      <Box gridColumn="span 4">
        <Typography
          sx={{
            fontFamily: "Inter",
            fontSize: 14,
            color: "#A9B2CC",
            fontWeight: 500,
          }}
        >
          Value
        </Typography>
      </Box>
    </Box>
  );
};

export default React.memo(CreateConditionTableHeader);
