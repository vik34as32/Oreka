import { Box, Button } from "@mui/material";
import React, { useState } from "react";
import DealingPanelDatePicker from "./DealingPanelDatePicker";
import { PropaneSharp } from "@mui/icons-material";

type AddDurationProps = {
  startDateTime: number;
  endDateTime: number;
  showNowText: boolean;
  handleStartDateTimeChange: (dateTime: number) => void;
  handleEndDateTimeChange: (dateTime: number) => void;
  toggleNowText: (isNowVisible: boolean) => void;
  fetchDealingData : () => void;
};

const AddDuration: React.FC<AddDurationProps> = ({
  startDateTime,
  endDateTime,
  showNowText,
  handleStartDateTimeChange,
  handleEndDateTimeChange,
  toggleNowText,
  fetchDealingData
}) => {
  return (
    <Box
      display={"flex"}
      flexDirection={"row"}
      alignItems={"center"}
      pl={2}
      gap={2}
      pt={0.5}
      pb={0.5}
    >
      <DealingPanelDatePicker
        dateChangeCallback={handleStartDateTimeChange}
        defaultTime={startDateTime}
        nowActionAvailable={false}
      />
      <DealingPanelDatePicker
        dateChangeCallback={handleEndDateTimeChange}
        defaultTime={endDateTime}
        showNowText={showNowText}
        toggleNowText={toggleNowText}
        nowActionAvailable={true}
      />
      <Button
        onClick={() => fetchDealingData()}
        variant="contained"
        sx={{
          textTransform: "capitalize",
          paddingLeft: 1,
          paddingRight: 1,
          paddingTop: 0,
          paddingBottom: 0,
        }}
      >
        Get Data
      </Button>
    </Box>
  );
};

export default AddDuration;
