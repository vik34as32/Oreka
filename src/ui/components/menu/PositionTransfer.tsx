import CloseIcon from "@mui/icons-material/Close";
import {
Backdrop,
Box,
Button,
Checkbox,
Dialog,
DialogActions,
DialogContent,
DialogTitle,
IconButton,
Radio,
Typography,
} from "@mui/material";
import { Dayjs } from "dayjs";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { setAlertMessage } from "../../../redux/action-handlers/app/AppActions";
import {
dealTransferViaFile,
dealTransferViaSql,
tradeDateChange,
} from "../../../redux/action-handlers/app/SaturdayDeleteActions";
import { getGroupsFromItemStates } from "../../../utilities/SettingUtilities";
import { Item } from "../common/checkbox-tree-group/CheckBoxList";
import { ItemState } from "../common/checkbox-tree-group/CheckBoxTree";
import DatePickerComponent from "../common/date-picker/DatePickerComponent";
import FileUpload from "../common/file-upload/FileUpload";
import GroupSelect, {
GroupSelectHandles,
} from "../common/group-select/GroupSelect";
import CircularProgressBar from "../common/progress-bar/CicularProgressBar";
import Stepper, { StepData } from "../common/stepper/Stepper";

type PositionTransferProps = {
  open: boolean;
  handleClose: () => void;
  dealTransferViaSql: (groups: string[]) => void;
  dealTransferViaFile: (groups: string[], fileName: string) => void;
  setAlertMessage: (message: string, type: string) => void;
  positionTransferStatus: { transfered: number; pending: number };
  tradeDateChange: (from: Dayjs, to: Dayjs, changeDate: Dayjs) => void;
};

const steps: StepData[] = [{ label: "Step-1" }, { label: "Step-2" }];

const PositionTransfer = (props: PositionTransferProps) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const stepperRef = useRef<any | undefined>(undefined);
  const [selectedValue, setSelectedValue] = useState("file");
  const [fileName, setFileName] = useState<string>("");
  const [positionTransferStart, setPositionTransferStart] =
    useState<boolean>(false);
  const [positionTransferCompleted, setPositionTransferCompleted] =
    useState<boolean>(false);
  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [toDate, setToDate] = useState<Dayjs | null>(null);
  const [changeDate, setChangeDate] = useState<Dayjs | null>(null);

  const groupSelectRef = useRef<GroupSelectHandles | undefined>(undefined);

  useEffect(() => {
    if (props.open) {
      setPositionTransferStart(false);
      setPositionTransferCompleted(false);
    }
  }, [props.open]);

  useEffect(() => {
    if (positionTransferCompleted) {
      stepperRef.current.next();
      setPositionTransferCompleted(false);
      setActiveStep(1);
    }
  }, [positionTransferCompleted]);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };

  // const [completed, setCompleted] = useState<{
  //     [k: number]: boolean;
  // }>({});

  const dealTransfer = useCallback(() => {
    if (!groupSelectRef.current) return;
    const itemStates: ItemState[] = groupSelectRef.current.getItemStates();
    const items: Item[] = groupSelectRef.current.getItems();
    const groups = getGroupsFromItemStates(items, itemStates);
    if (groups.length === 0) {
      setPositionTransferStart(false);
      setPositionTransferCompleted(true);
      return;
    }
    if (selectedValue === "sql") {
      props.dealTransferViaSql(groups);
    } else {
      props.dealTransferViaFile(groups, fileName);
      setFileName("");
    }
  }, [selectedValue, fileName]);

  const handleBack = () => {
    if (!stepperRef.current) return;
    stepperRef.current.prev();
    setActiveStep((prevActiveStep) => {
      if (prevActiveStep > 0) {
        return prevActiveStep - 1;
      }
      return prevActiveStep;
    });
  };

  const handleNext = () => {
    if (!stepperRef.current) return;
    if (activeStep === 0) {
      setPositionTransferStart(true);
      dealTransfer();
    }
  };
  const handleDone = () => {
    if (fromDate && toDate && changeDate) {
      props.tradeDateChange(fromDate, toDate, changeDate);
      props.handleClose();
    } else props.setAlertMessage("Please select all dates", "warning");
  };

  const onFileUploaded = useCallback((fileData: string[] | null) => {
    if (!fileData || fileData.length === 0) {
      props.setAlertMessage("Error in uploaded file", "error");
      return;
    }
    props.setAlertMessage("File uploaded successfully", "success");
    setFileName(fileData[0]);
  }, []);

  const getComponent = () => {
    if (activeStep === 0) {
      return (
        <Box>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "space-around",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Radio
                sx={{
                  "& .MuiSvgIcon-root": {
                    fontSize: 20, // Adjust the font size as per your preference
                  },
                }}
                checked={selectedValue === "sql"}
                onChange={handleRadioChange}
                value="sql"
                name="radio-buttons"
                inputProps={{ "aria-label": "A" }}
              />
              <Typography className="normal-text">Via SQL</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Radio
                sx={{
                  "& .MuiSvgIcon-root": {
                    fontSize: 20, // Adjust the font size as per your preference
                  },
                }}
                checked={selectedValue === "file"}
                onChange={handleRadioChange}
                value="file"
                name="radio-buttons"
                inputProps={{ "aria-label": "B" }}
              />
              <Typography className="normal-text">Via File</Typography>
            </Box>
          </Box>

          <Typography
            sx={{ mb: 3, color: "#D5E2F0", fontFamily: "Inter", fontSize: 16 }}
          >
            Re upload MT Position File
          </Typography>
          <FileUpload
            disabled={selectedValue === "sql"}
            onFileUploaded={onFileUploaded}
          />

          <Box sx={{ mt: 1 }}>
            <GroupSelect ref={groupSelectRef} />
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={positionTransferStart}
            >
              <CircularProgressBar
                onComplete={() => {
                  setPositionTransferStart(false);
                  setPositionTransferCompleted(true);
                }}
                value={
                  props.positionTransferStatus
                    ? (100 * props.positionTransferStatus.transfered) /
                      (props.positionTransferStatus.pending +
                        props.positionTransferStatus.transfered)
                    : 0
                }
              />
            </Backdrop>
          </Box>
          {/* <Box>
                        <Typography sx={{ mb: 2, color: "#D5E2F0", fontFamily: "Inter", fontSize: 16 }}>
                            Date for Change
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Box
                                className={"datepicker"}
                                sx={{
                                    display: "flex",
                                    overflow: "visible",
                                    justifyContent: "center",
                                    border: 1,
                                    height: 40,
                                    borderColor: "#2B3349",
                                    alignItems: "center",
                                    mr: 2
                                }}
                            >
                                <DateComponent
                                    dateChangeCallback={onDateChange}
                                    defaultTime={Date.now()}
                                />
                            </Box>
                            <Checkbox defaultChecked />
                            <Typography>
                                Oreka Reset
                            </Typography>
                        </Box>
                    </Box> */}
        </Box>
      );
    } else if (activeStep === 1) {
      return (
        <Box
          sx={{
            height: "100%",
            mb: 2,
            color: "#D5E2F0",
            fontFamily: "Inter",
            fontSize: 16,
          }}
        >
          <Typography sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            Trade Date Change
          </Typography>
          <Box display={"flex"}>
            <Box display={"flex"} flexDirection={"column"} sx={{ p: 1 }}>
              <DatePickerComponent
                label="From Date"
                onDateSelect={(date) => setFromDate(date)}
              />
            </Box>
            <Box display={"flex"} flexDirection={"column"} sx={{ p: 1 }}>
              <DatePickerComponent
                label="To Date"
                onDateSelect={(date) => setToDate(date)}
              />
            </Box>
          </Box>
          <Box display={"flex"}>
            <Box
              display={"flex"}
              flexDirection={"column"}
              sx={{ p: 1, width: 0.5 }}
            >
              <DatePickerComponent
                label="Changed Date"
                onDateSelect={(date) => setChangeDate(date)}
              />
            </Box>
            <Box display={"flex"} sx={{ p: 1 }}>
              <Typography
                sx={{
                  alignSelf: "center",
                  color: "#D5E2F0",
                  fontFamily: "Inter",
                  fontSize: 14,
                }}
              >
                Oreka Reset
              </Typography>
              <Checkbox defaultChecked />
            </Box>
          </Box>
        </Box>
      );
    }
  };

  return (
    <Dialog
      open={props.open}
      fullWidth
      PaperProps={{
        sx: {
          background: "#020305",
          width: 500,
          height: 600,
        },
      }}
      maxWidth={false}
      onClose={() => props.handleClose()}
    >
      <DialogTitle
        style={{ display: "flex", justifyContent: "space-between", height: 40 }}
        sx={{ pt: 1, pb: 1 }}
      >
        <Typography className="header-text">Position Transfer</Typography>
        <IconButton onClick={() => props.handleClose()}>
          <CloseIcon fontSize="small" sx={{ color: "#6A7187" }} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Stepper
          activeStep={activeStep}
          stepData={steps}
          ref={(r) => (stepperRef.current = r)}
        />
        <Box
          sx={{
            background: "#020305",
            alignContent: "center",
            pt: 2,
            maxWidth: 500,
            height: 320,
          }}
        >
          {getComponent()}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          tabIndex={9}
          disabled={activeStep === 0}
          onClick={handleBack}
          variant="outlined"
          sx={{
            borderColor: "#2B3349",
            color: "white",
            width: "125px",
            textTransform: "none",
          }}
        >
          Back
        </Button>
        <Button
          tabIndex={10}
          onClick={activeStep + 1 === steps.length ? handleDone : handleNext}
          variant="contained"
          sx={{ textTransform: "none", width: "136px" }}
        >
          {activeStep + 1 === steps.length ? "Done" : "Next"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

function mapStateToProps(state: any) {
  return {
    positionTransferStatus: state.saturdayDelete.positionTransferStatus,
  };
}
function mapDispatchToProps(dispatch: Dispatch) {
  return {
    dealTransferViaSql: (groups: string[]) => dealTransferViaSql(groups),
    dealTransferViaFile: (groups: string[], fileName: string) =>
      dealTransferViaFile(groups, fileName),
    setAlertMessage: (message: string, type: string) =>
      dispatch(setAlertMessage(message, type)),
    tradeDateChange: (from: Dayjs, to: Dayjs, changeDate: Dayjs) =>
      tradeDateChange(from, to, changeDate),
  };
}

export default React.memo(
  connect(mapStateToProps, mapDispatchToProps)(PositionTransfer)
);
