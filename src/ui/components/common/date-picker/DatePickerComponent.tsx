import { TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import React, { ReactElement, useState } from "react";

export interface DatePickerComponentProps {
  label:string;
  onDateSelect: (date: Dayjs | null) => void;
}

const DatePickerComponent: React.FC<DatePickerComponentProps> = (
  props: DatePickerComponentProps
): ReactElement => {
  const [date, setDate] = useState<Dayjs | null>(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={props.label}
        value={date}
        inputFormat="DD-MM-YYYY"
        disableFuture
        onChange={(newValue) => {
          setDate(newValue);
          props.onDateSelect(newValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            sx={{ width: 1 }}
            size="small"
            InputProps={{
              ...params.InputProps,
              sx: {
                height: 40,
                color: "#D5E2F0",
                fontSize: 14,
                fontFamily: "Inter",
              },
            }}
          />
        )}
      />
    </LocalizationProvider>
  );
};

export default React.memo(DatePickerComponent);
