import CloseIcon from "@mui/icons-material/Close";
import {
Box,
Button,
Dialog,
DialogActions,
DialogContent,
DialogTitle,
IconButton,
Typography,
} from "@mui/material";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import React, {
ReactElement,
useCallback,
useRef,
useState
} from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { setAlertMessage } from "../../../redux/action-handlers/app/AppActions";
import {
deleteDataRequest,
verifyPosition,
} from "../../../redux/action-handlers/app/SaturdayDeleteActions";
import { getGroupsFromItemStates } from "../../../utilities/SettingUtilities";
import { Item } from "../common/checkbox-tree-group/CheckBoxList";
import { ItemState } from "../common/checkbox-tree-group/CheckBoxTree";
import FileUpload from "../common/file-upload/FileUpload";
import GroupSelect, {
GroupSelectHandles,
} from "../common/group-select/GroupSelect";
import Progress from "../common/loader/Progress";
import CircularProgressBar from "../common/progress-bar/CicularProgressBar";
import Stepper, { StepData } from "../common/stepper/Stepper";
import SaturdayDeleteConfirmation, {
PositionConfirmation,
} from "./SaturdayDeleteConfirmation";

interface TradeDeleteProps {
  open: boolean;
  handleClose: () => void;
  verifyPosition: (fileName: string) => void;
  setAlertMessage: (message: string, type: string) => void;
  messages: { [id: string]: string }[];
  status: "match" | "mismatch";
  deleteDataRequest: (groups: string[]) => void;
  deleteDataStatus: { deleted: number; pending: number };
}

const steps: StepData[] = [
  { label: "Step-1" },
  { label: "Step-2" },
  { label: "Step-3" },
];
const columnDefs: ColDef[] = [
  {
    field: "message",
    headerName: "Message",
  },
];
const TradeDelete = (props: TradeDeleteProps): ReactElement => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const stepperRef = useRef<any | undefined>(undefined);
  const groupSelectRef = useRef<GroupSelectHandles | undefined>(undefined);

  const handleBack = () => {
    if (!stepperRef.current) return;
    if (activeStep > 0) setActiveStep(activeStep - 1);
    stepperRef.current.prev();
  };
  const handleNext = () => {
    if (!stepperRef.current) return;
    if (activeStep === 1) {
      sendDataDeleteRequest();
    }
    if (activeStep < steps.length) setActiveStep(activeStep + 1);
    stepperRef.current.next();
  };
  const onFileUploaded = useCallback((fileData: string[] | null) => {
    if (fileData && fileData.length > 0) {
      props.setAlertMessage("File uploaded successfully", "success");
      props.verifyPosition(fileData[0]);
    } else {
      props.setAlertMessage("Error in uploaded file", "error");
    }
  }, []);

  const sendDataDeleteRequest = useCallback(() => {
    if (!groupSelectRef.current) return;
    const itemStates: ItemState[] = groupSelectRef.current.getItemStates();
    const items: Item[] = groupSelectRef.current.getItems();
    const groups = getGroupsFromItemStates(items, itemStates);
    props.deleteDataRequest(groups);
  }, [props.deleteDataRequest]);

  const getComponent = () => {
    switch (activeStep) {
      case 0:
        return (
          <>
            <Box sx={{ justifyItems: "center" }}>
              <Typography
                sx={{
                  mb: 1,
                  pl: 2,
                  color: "#D5E2F0",
                  fontFamily: "Inter",
                  fontSize: 16,
                }}
              >
                Upload MT Position File
              </Typography>
              <Box sx={{ p: 1 }}>
                <FileUpload onFileUploaded={onFileUploaded} />
              </Box>
              <div
                className={`ag-theme-balham-dark`}
                style={{
                  height: 200,
                  width: "100%",
                  display: props.status === "match" ? "none" : "initial",
                }}
              >
                <AgGridReact
                  rowData={props.messages}
                  defaultColDef={{ resizable: true, sortable: true }}
                  columnDefs={columnDefs}
                  animateRows={true}
                ></AgGridReact>
              </div>
            </Box>
          </>
        );
      case 1:
        return <GroupSelect ref={groupSelectRef} />;
      case 2:
        return (
          <Box sx={{textAlign:'center'}}>
            <Typography>Deleting Trade ...</Typography>
            <CircularProgressBar
            size={200}
              value={
                props.deleteDataStatus
                  ? (100 * props.deleteDataStatus.deleted) /
                    (props.deleteDataStatus.pending +
                      props.deleteDataStatus.deleted)
                  : 0
              }
            />
          </Box>
        );
    }
  };

  return (
    <>
      <Dialog
        open={props.open}
        fullWidth
        PaperProps={{
          sx: {
            background: "#020305",
            width: 500,
            height: 500,
          },
        }}
        maxWidth={false}
        onClose={() => props.handleClose()}
      >
        <DialogTitle
          style={{
            display: "flex",
            justifyContent: "space-between",
            height: 40,
          }}
          sx={{ pt: 1, pb: 1 }}
        >
          <Typography className="header-text">Trade Delete</Typography>
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
              alignContent: "center",
              pt: 2,
            }}
          >
            {getComponent()}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            tabIndex={9}
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
            onClick={handleNext}
            variant="contained"
            sx={{ textTransform: "none", width: "136px" }}
          >
            Next
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const data: PositionConfirmation[] = [
  {
    time: "2023-06-28 00:00:00",
    message: "deleted successfully",
    type: "success",
  },
  {
    time: "2023-06-28 00:00:00",
    message: "deleted successfully",
    type: "success",
  },
  {
    time: "2023-06-28 00:00:00",
    message: "deleted successfully",
    type: "success",
  },
];

const Step2 = () => {
  return (
    <>
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
          Position Transfer Process
        </Typography>

        <Box sx={{ mb: 2 }}></Box>
        <SaturdayDeleteConfirmation
          confirmationMessages={data}
        ></SaturdayDeleteConfirmation>
      </Box>
    </>
  );
};

const Step3 = () => {
  return <></>;
};

const Step4 = () => {
  return (
    <>
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
          Position Transfer Process
        </Typography>

        <Progress value={20}></Progress>
        <Box sx={{ mb: 2 }}></Box>
        <SaturdayDeleteConfirmation
          confirmationMessages={data}
        ></SaturdayDeleteConfirmation>
      </Box>
    </>
  );
};
function mapStateToProps(state: any) {
  return {
    messages: state.saturdayDelete.tradeDelete.messages,
    status: state.saturdayDelete.tradeDelete.status,
    deleteDataStatus: state.saturdayDelete.tradeDelete.deleteDataStatus,
  };
}
function mapDispatchToProps(dispatch: Dispatch) {
  return {
    verifyPosition: (fileName: string) => verifyPosition(fileName),
    setAlertMessage: (message: string, type: string) =>
      dispatch(setAlertMessage(message, type)),
    deleteDataRequest: (groups: string[]) => deleteDataRequest(groups),
  };
}
export default React.memo(
  connect(mapStateToProps, mapDispatchToProps)(TradeDelete)
);
