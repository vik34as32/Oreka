import React, { Component } from "react";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Box, TextField } from "@mui/material";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment, { Moment } from "moment";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { ArrowDropUp } from "@mui/icons-material";

type DateComponentProps = {
    dateChangeCallback: (unixTimeStamp: number) => void;
    defaultTime: number
}

type DateComponentState = {
    time: Moment,
    open: boolean
}

class DateComponent extends Component<DateComponentProps, DateComponentState> {

    constructor(props: DateComponentProps) {
        super(props);
        this.state = {
            time: moment('11:59 PM','hh:mm A').subtract(1,'days'),
            open: false
        }
    }

    setValue(value: string | null) {
        this.setState({
            time: moment(value),
        })
    }

    OpenDatePicker() {
        this.setState({
            open: true
        })
    }

    render() {
        return (
            <Box className={"datepicker"} sx={{display:"flex",justifyContent:"center"}} >
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DateTimePicker
                        open={this.state.open}
                        onOpen={() => this.setState({ open: true })}
                        onClose={() => {
                            this.setState({ open: false });
                            this.props.dateChangeCallback(this.state.time.unix());
                        }}
                        renderInput={(props) =>
                            <TextField {...props}
                                size={"small"}
                                sx={{ border: "none" }}
                                variant={"standard"}
                                InputProps={{
                                    disableUnderline: true,
                                    sx:{
                                        maxWidth:170
                                    }
                                }}
                                onClick={(e) => this.OpenDatePicker()}
                            />
                        }
                        value={moment(this.state.time).format('YYYY-MM-DD HH:mm')}
                        onChange={(newValue) => {
                            this.setValue(newValue);
                        }}
                        timeIcon={undefined}
                        dateRangeIcon={undefined}
                    />
                </LocalizationProvider>
                {this.state.open ? <ArrowDropUp fontSize="small" sx={{fontWeight:500}} onClick={() => this.setState({open:false})}/> : <ArrowDropDownIcon fontSize="small" onClick={() => this.setState({open:true})}/>}
            </Box>
        );
    }
}

export default DateComponent;