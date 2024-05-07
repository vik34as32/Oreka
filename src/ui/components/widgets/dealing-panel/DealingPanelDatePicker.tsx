import React, { useRef, useState } from "react";
import { ArrowDropUp } from "@mui/icons-material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Box, TextField } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { PickersLocaleText } from "@mui/x-date-pickers/locales";
import { enUS } from "@mui/x-date-pickers/locales/enUS";
import moment, { Moment } from "moment";

type DateComponentProps = {
  dateChangeCallback: (unixTimeStamp: number) => void;
  defaultTime: number;
  showNowText?: boolean;
  toggleNowText?: (isNowVisible: boolean) => void;
  nowActionAvailable: boolean;
};

const DealingPanelDatePicker: React.FC<DateComponentProps> = ({
  dateChangeCallback,
  defaultTime,
  showNowText,
  toggleNowText,
  nowActionAvailable
}) => {

  const timeRef = useRef<Moment>(moment(defaultTime));
  const [open, setOpen] = useState<boolean>(false);

  const setValue = (value: string | null) => {
    timeRef.current = moment(value);
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (toggleNowText !== undefined) {
      toggleNowText(currentTimestamp === moment(value).unix());
    }
  };

  const openDatePicker = () => {
    setOpen(true);
  };

  const customEnUSLocaleText: Partial<PickersLocaleText<any>> = {
    ...enUS.components.MuiLocalizationProvider.defaultProps.localeText,
    todayButtonLabel: "Now",
  };

  return (
    <Box
      className={"datepicker"}
      sx={{
        display: "flex",
        overflow: "visible",
        justifyContent: "center",
        border: 1,
        height:26,
        borderColor: "#2B3349",
      }}
    >
      <LocalizationProvider
        dateAdapter={AdapterMoment}
        localeText={customEnUSLocaleText}
      >
        <DateTimePicker
          open={open}
          onOpen={() => setOpen(true)}
          disableFuture
          ampm={true}
          onClose={() => {
            setOpen(false);
            dateChangeCallback(timeRef.current.unix());
          }}
          componentsProps={{
            actionBar: nowActionAvailable ? { actions: ["today"] } : {},
          }}
          renderInput={(props) => (
            <TextField
              {...props}
              size={"small"}
              sx={{ border: "" }}
              variant={"standard"}
              placeholder="Now"
              inputProps={{
                placeholder: "Now",
              }}
              InputProps={{
                disableUnderline: true,
                sx: {
                  maxWidth: 170,
                },
              }}
              value={
                showNowText ? "Now" : moment(defaultTime).format("YYYY-MM-DD hh:mm A")
              }
              onClick={(e) => openDatePicker()}
            />
          )}
          value={showNowText ? null : moment(defaultTime).format("YYYY-MM-DD HH:mm")}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          timeIcon={undefined}
          dateRangeIcon={undefined}
        />
      </LocalizationProvider>
      {open ? (
        <ArrowDropUp
          fontSize="small"
          sx={{ fontWeight: 500 }}
          onClick={() => setOpen(false)}
        />
      ) : (
        <ArrowDropDownIcon fontSize="small" onClick={() => setOpen(true)} />
      )}
    </Box>
  );
};

export default DealingPanelDatePicker;
