import {
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps,
} from "@mui/material";
import {
  DateTimePicker,
  LocalizationProvider,
  PickersLocaleText,
  TimePicker,
  enUS,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { ArrowDropDown } from "@mui/icons-material";
import React, { useState } from "react";

type CustomDateTimePickerProps = {
  dateTimeValue: string;
  setDateTimeValue: React.Dispatch<React.SetStateAction<string>>;
  isExpiry: boolean;
  noExpiry?: boolean;
  setNoExpiry?: React.Dispatch<React.SetStateAction<boolean>>;
};

const CustomDateTimePicker = (props: CustomDateTimePickerProps) => {
  const [openDateTimePicker, setOpenDateTimePicker] = useState<boolean>(false);

  const customEnUSLocaleText: Partial<PickersLocaleText<any>> = {
    ...enUS.components.MuiLocalizationProvider.defaultProps.localeText,
    todayButtonLabel: "No Expiry",
  };
  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      localeText={customEnUSLocaleText}
    >
      <DateTimePicker
        open={openDateTimePicker}
        disableFuture
        componentsProps={{
          actionBar: props.isExpiry ? { actions: ["today"] } : {},
        }}
        renderInput={(params: TextFieldProps) => (
          <TextField
            {...params}
            onClick={() => {
              setOpenDateTimePicker(true);
            }}
            value={
              props.isExpiry && props.noExpiry
                ? "No Expiry"
                : props.dateTimeValue
                ? dayjs(props.dateTimeValue).format("YYYY-MM-DD hh:mm A")
                : ""
            }
            sx={{
              width: "100%",
              backgroundColor: "#0A0A0A",
            }}
            InputLabelProps={{
              shrink: false,
            }}
            InputProps={{
              readOnly: true,
              sx: {
                "&.Mui-error .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#2B3349",
                },
              },
              style: {
                direction: "ltr",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <ArrowDropDown />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            inputProps={{
              placeholder:
                props.isExpiry && props.noExpiry ? "No Expiry" : "Select",
              style: {
                height: "50px",
                padding: 0,
                paddingLeft: 12,
              },
            }}
          />
        )}
        onChange={(value) => {
          const currentTimestamp = Math.floor(Date.now() / 1000);
          if (
            currentTimestamp === dayjs(value).unix() &&
            props.isExpiry &&
            props.setNoExpiry
          ) {
            props.setNoExpiry(true);
          }
          props.setDateTimeValue(dayjs(value).format("YYYY-MM-DD HH:mm"));
        }}
        value={
          props.isExpiry && props.noExpiry ? null : dayjs(props.dateTimeValue)
        }
        onClose={() => {
          setOpenDateTimePicker(false);
        }}
      />
    </LocalizationProvider>
  );
};

export default React.memo(CustomDateTimePicker);
