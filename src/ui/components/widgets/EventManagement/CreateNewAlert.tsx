import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  ListItemText,
  Menu,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
  TextFieldProps,
  Typography,
  styled,
} from "@mui/material";
import {
  ExpandMore,
  ChevronRight,
  Add,
  Remove,
  KeyboardArrowRight,
  KeyboardArrowLeft,
} from "@mui/icons-material";
import React, { useEffect, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { ArrowDropDown, Edit } from "@mui/icons-material";
import "../../../../assets/css/dropdown_treeview_option.css";
import TreeView from "@mui/lab/TreeView";
import { TreeItem } from "@mui/lab";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import DropDownWithTreeOption from "./DropDownWithTreeOption";
import CustomInputNumber from "./CustomInputNumber";
import CustomTimePicker from "./CustomDateTimePicker";
import CustomMultiSelectionDropDown from "./CustomMultiSelectionDropDown";
import CreateTrigger from "./CreateTrigger";
import CreateCondition from "./CreateCondition";
import ActionStep from "./ActionStep";

type CreateNewAlertProps = {
  open: boolean;
  handleClose: () => void;
};

export type OrConditionData = {
  orConditionType: string;
  orCompareCondition: string;
  orConditionValue: string;
};

export type ConditionData = {
  conditionType: string;
  compareCondition: string;
  conditionValue: string;
  orCondition: OrConditionData[];
};

export type ActionData = {
  actionName: string;
  actionSendBy: string;
  action: string;
  actionSendTo: string;
  actionTrigger: string;
};

const CreateNewAlert = (props: CreateNewAlertProps) => {
  const [alertName, setAlertName] = useState<string>("");
  const [triggerType, setTriggerType] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [expiryTime, setExpiryTime] = useState<string>("");
  const [noExpiry, setNoExpiry] = useState<boolean>(false);
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>([]);
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [daysOfMonth, setDaysOfMonth] = useState<string[]>([]);
  const [repetitions, setRepetitions] = useState<number>(0);
  const [days, setDays] = useState<number>(0);
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [conditions, setConditions] = useState<ConditionData[]>([]);
  const [selectedAndConditionIndex, setSelectedAndConditionIndex] =
    useState<number>(0);
  const [selectedOrConditionIndex, setSelectedOrConditionIndex] =
    useState<number>(0);
  const [actions, setActions] = useState<ActionData[]>([]);

  const handleAddAndCondition = () => {
    const newAndCondition: ConditionData = {
      conditionType: "",
      compareCondition: "",
      conditionValue: "",
      orCondition: [],
    };
    setConditions([...conditions, newAndCondition]);
    setSelectedAndConditionIndex(conditions.length);
  };

  const handleAddOrCondition = () => {
    setConditions((prevConditions) => {
      const updatedConditions = [...prevConditions];
      const currentCondition = updatedConditions[selectedAndConditionIndex];
      currentCondition.orCondition?.push({
        orConditionType: "",
        orCompareCondition: "",
        orConditionValue: "",
      });
      updatedConditions[selectedAndConditionIndex] = currentCondition;
      return updatedConditions;
    });
  };

  const handleDeleteAndCondition = (index: number) => {
    setConditions((prevConditions) => {
      const updatedConditions = [...prevConditions];
      updatedConditions.splice(index, 1);
      return updatedConditions;
    });
  };

  const handleDeleteOrCondition = (orConditionIndex: number) => {
    setConditions((prevConditions) => {
      const updatedConditions = [...prevConditions];
      const currentCondition = updatedConditions[selectedAndConditionIndex];
      currentCondition.orCondition.splice(orConditionIndex, 1);
      updatedConditions[selectedAndConditionIndex] = currentCondition;
      return updatedConditions;
    });
  };

  const handleAndCompareConditionChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    andConditionIndex: number
  ) => {
    setConditions((prevConditions) => {
      const updatedConditions = [...prevConditions];
      updatedConditions[andConditionIndex] = {
        ...updatedConditions[andConditionIndex],
        compareCondition: event.target.value,
      };
      return updatedConditions;
    });
  };

  const handleAndConditionValueChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    andConditionIndex: number
  ) => {
    setConditions((prevConditions) => {
      const updatedConditions = [...prevConditions];
      updatedConditions[andConditionIndex] = {
        ...updatedConditions[andConditionIndex],
        conditionValue: event.target.value,
      };
      return updatedConditions;
    });
  };

  const handleOrCompareConditionChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    andConditionIndex: number,
    orConditionIndex: number
  ) => {
    setConditions((prevConditions) => {
      const updatedConditions = [...prevConditions];
      const currentCondition = updatedConditions[andConditionIndex];
      currentCondition.orCondition[orConditionIndex].orCompareCondition =
        event.target.value;
      updatedConditions[andConditionIndex] = currentCondition;
      return updatedConditions;
    });
  };

  const handleOrConditionvalueChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    andConditionIndex: number,
    orConditionIndex: number
  ) => {
    setConditions((prevConditions) => {
      const updatedConditions = [...prevConditions];
      const currentCondition = updatedConditions[andConditionIndex];
      currentCondition.orCondition[orConditionIndex].orConditionValue =
        event.target.value;
      updatedConditions[andConditionIndex] = currentCondition;
      return updatedConditions;
    });
  };

  const handleAndConditionTypeChange = (
    conditionType: string,
    andConditionIndex: number
  ) => {
    setConditions((prevConditions) => {
      const updatedConditions = [...prevConditions];
      updatedConditions[andConditionIndex] = {
        ...updatedConditions[andConditionIndex],
        conditionType: conditionType,
      };
      return updatedConditions;
    });
  };

  const handleOrConditionTypeChange = (
    conditionType: string,
    andConditionIndex: number,
    orConditionIndex: number
  ) => {
    setConditions((prevConditions) => {
      const updatedConditions = [...prevConditions];
      const currentCondition = updatedConditions[andConditionIndex];
      currentCondition.orCondition[orConditionIndex].orConditionType =
        conditionType;
      updatedConditions[andConditionIndex] = currentCondition;
      return updatedConditions;
    });
  };

  return (
    <>
      <Dialog
        open={props.open}
        fullWidth
        PaperProps={{
          sx: {
            background: "#13171F",
            width: 1100,
            height: 760,
          },
        }}
        maxWidth={false}
        onClose={() => props.handleClose()}
      >
        <DialogTitle
          style={{ display: "flex", justifyContent: "space-between" }}
          sx={{ pt: 1, pb: 1 }}
        >
          <Typography
            className="header-text"
            sx={{ display: "contents", alignContent: "center" }}
          >
            Create New Alert
          </Typography>
          <IconButton onClick={() => props.handleClose()}>
            <CloseIcon fontSize="small" sx={{ color: "#6A7187" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", mb: 2 }}>
              <Typography
                sx={{
                  mr: 1,
                  color: "#D5E2F0",
                  fontFamily: "Inter",
                  fontSize: 16,
                }}
              >
                Alert Name
              </Typography>
              <TextField
                value={alertName}
                onChange={(
                  event: React.ChangeEvent<
                    HTMLInputElement | HTMLTextAreaElement
                  >
                ) => {
                  setAlertName(event.target.value);
                }}
                sx={{
                  backgroundColor: "#0A0A0A",
                  "& label.Mui-focused": {
                    color: "#6A7187",
                  },
                  "& .MuiInput-underline:after": {
                    borderBottomColor: "#6A7187",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#222634",
                      borderWidth: "2px",
                    },
                    "&:hover fieldset": {
                      borderColor: "#6A7187",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#6A7187",
                    },
                  },
                }}
                inputProps={{
                  placeholder: "Enter Alert name",
                  style: {
                    height: "30px",
                    padding: 0,
                    paddingLeft: 8,
                  },
                }}
              ></TextField>
            </Box>
            <Box display={"flex"}>
              <Chip
                label="Trigger"
                variant={activeStepIndex === 0 ? "filled" : "outlined"}
                color={activeStepIndex === 0 ? "primary" : "default"}
                onClick={() => {
                  setActiveStepIndex(0);
                }}
                sx={{ mr: 2, fontSize: 16, pt: 2, pb: 2, pl: 2, pr: 2 }}
              />
              <Chip
                label="Condition"
                variant={activeStepIndex === 1 ? "filled" : "outlined"}
                color={activeStepIndex === 1 ? "primary" : "default"}
                onClick={() => {
                  setActiveStepIndex(1);
                }}
                sx={{ mr: 2, fontSize: 16, pt: 2, pb: 2, pl: 2, pr: 2 }}
              />
              <Chip
                label="Action"
                variant={activeStepIndex === 2 ? "filled" : "outlined"}
                color={activeStepIndex === 2 ? "primary" : "default"}
                onClick={() => {
                  setActiveStepIndex(2);
                }}
                sx={{ mr: 2, fontSize: 16, pt: 2, pb: 2, pl: 2, pr: 2 }}
              />
            </Box>
            {activeStepIndex === 0 ? (
              <CreateTrigger
                triggerType={triggerType}
                setTriggerType={setTriggerType}
                days={days}
                setDays={setDays}
                daysOfMonth={daysOfMonth}
                setDaysOfMonth={setDaysOfMonth}
                daysOfWeek={daysOfWeek}
                setDaysOfWeek={setDaysOfWeek}
                startTime={startTime}
                setStartTime={setStartTime}
                expiryTime={expiryTime}
                setExpiryTime={setExpiryTime}
                hours={hours}
                setHours={setHours}
                minutes={minutes}
                setMinutes={setMinutes}
                noExpiry={noExpiry}
                setNoExpiry={setNoExpiry}
                repetitions={repetitions}
                setRepetitions={setRepetitions}
                selectedMonths={selectedMonths}
                setSelectedMonths={setSelectedMonths}
              />
            ) : activeStepIndex === 1 ? (
              <CreateCondition
                conditions={conditions}
                handleAddAndCondition={handleAddAndCondition}
                handleAddOrCondition={handleAddOrCondition}
                handleAndCompareConditionChange={
                  handleAndCompareConditionChange
                }
                handleAndConditionValueChange={handleAndConditionValueChange}
                handleDeleteAndCondition={handleDeleteAndCondition}
                handleDeleteOrCondition={handleDeleteOrCondition}
                handleOrCompareConditionChange={handleOrCompareConditionChange}
                handleOrConditionvalueChange={handleOrConditionvalueChange}
                selectedAndConditionIndex={selectedAndConditionIndex}
                setConditions={setConditions}
                setSelectedAndConditionIndex={setSelectedAndConditionIndex}
                selectedOrConditionIndex={selectedOrConditionIndex}
                setSelectedOrConditionIndex={setSelectedOrConditionIndex}
                handleAndConditionTypeChange={handleAndConditionTypeChange}
                handleOrConditionTypeChange={handleOrConditionTypeChange}
              />
            ) : (
              activeStepIndex === 2 && (
                <ActionStep actions={actions} setActions={setActions} />
              )
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ mr: 2 }}>
          <Button
            tabIndex={9}
            variant="outlined"
            disabled={activeStepIndex === 0}
            onClick={() => {
              setActiveStepIndex(activeStepIndex - 1);
            }}
            sx={{
              borderColor: "#2B3349",
              color: "white",
              textTransform: "none",
              padding: "12px 40px",
              borderRadius: "3px",
            }}
          >
            <KeyboardArrowLeft /> View previous tab
          </Button>
          <Button
            tabIndex={9}
            variant="outlined"
            disabled={activeStepIndex === 2}
            onClick={() => {
              setActiveStepIndex(activeStepIndex + 1);
            }}
            sx={{
              borderColor: "#2B3349",
              color: "white",
              textTransform: "none",
              padding: "12px 40px",
              borderRadius: "3px",
            }}
          >
            View next tab <KeyboardArrowRight />
          </Button>
          <Button
            tabIndex={9}
            variant="contained"
            sx={{ textTransform: "none", padding: "12px 40px" }}
          >
            Save Alert
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default React.memo(CreateNewAlert);
