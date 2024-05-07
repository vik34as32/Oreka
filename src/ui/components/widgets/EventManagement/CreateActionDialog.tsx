import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect, useRef, useState } from "react";
import CustomInputLabel from "./CustomInputLabel";
import DropDownWithTreeOption from "./DropDownWithTreeOption";
import AttachmentLink from "@svg/AttachmentLink.svg";
import PhotoImage from "@svg/PhotoImage.svg";
import Smiley from "@svg/Smiley.svg";
import TextSizeSquare from "@svg/TextSizeSquare.svg";
import { ActionData } from "./CreateNewAlert";

type CreateActionDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSaveAction: (createdAction: ActionData) => void;
  actionData?: ActionData;
  isEdit: boolean;
};

const CreateActionDialog = (props: CreateActionDialogProps) => {
  const actionTypeData = [
    {
      label: "Message",
      nodeId: "1",
      children: [
        { label: "Send to Oreka", parent: "Message", nodeId: "2" },
        { label: "Send to Telegram", parent: "Message", nodeId: "3" },
        { label: "Send to Email", parent: "Message", nodeId: "4" },
        { label: "Post Message to Channel", parent: "Message", nodeId: "5" },
      ],
    },
    {
      label: "Gateway Respond",
      nodeId: "6",
      children: [
        {
          label: "Confirm by Request Price",
          parent: "Gateway Respond",
          nodeId: "7",
        },
        {
          label: "Confirm by Market Price",
          parent: "Gateway Respond",
          nodeId: "8",
        },
        { label: "Cancel Order", parent: "Gateway Respond", nodeId: "9" },
        { label: "Confirm Order", parent: "Gateway Respond", nodeId: "10" },
      ],
    },
    {
      label: "Account",
      nodeId: "11",
      children: [
        { label: "Disable Account", parent: "Account", nodeId: "12" },
        { label: "Disable Trade", parent: "Account", nodeId: "13" },
        { label: "Disable Experts", parent: "Account", nodeId: "14" },
        { label: "Change Leverage", parent: "Account", nodeId: "15" },
        { label: "Change Group", parent: "Account", nodeId: "16" },
        { label: "Credit", parent: "Account", nodeId: "17" },
        { label: "Balance", parent: "Account", nodeId: "18" },
        { label: "Cancel All Pending Order", parent: "Account", nodeId: "19" },
        { label: "Place Order", parent: "Account", nodeId: "20" },
      ],
    },
    {
      label: "Configuration",
      nodeId: "21",
      children: [
        {
          label: "Update Symbol",
          parent: "Configuration",
          nodeId: "22",
        },
        {
          label: "Update Group",
          parent: "Configuration",
          nodeId: "23",
        },
      ],
    },
    {
      label: "External",
      nodeId: "24",
      children: [
        {
          label: "Send Web Request",
          parent: "External",
          nodeId: "25",
        },
        {
          label: "API Call",
          parent: "External",
          nodeId: "26",
        },
      ],
    },
    {
      label: "Report Creation",
      nodeId: "27",
      children: [
        {
          label: "Top Ten Profit Trader",
          parent: "Report Creation",
          nodeId: "28",
        },
      ],
    },
  ];

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const sendByData = ["Trigger"];

  const [createdAction, setCreatedAction] = useState<ActionData>({
    actionName: props.isEdit ? props.actionData!.actionName : "",
    action: props.isEdit ? props.actionData!.action : "",
    actionSendBy: props.isEdit ? props.actionData!.actionSendBy : "",
    actionSendTo: props.isEdit ? props.actionData!.actionSendTo : "",
    actionTrigger: props.isEdit ? props.actionData!.actionTrigger : "",
  });

  const handleActionNodeSelect = (
    _event: React.SyntheticEvent<Element, Event>,
    nodeId: string
  ) => {
    actionTypeData.forEach((data) => {
      if (data.nodeId === nodeId) return;
      data.children.forEach((childNode) => {
        if (childNode.nodeId === nodeId) {
          setCreatedAction((prevData) => {
            return {
              ...prevData,
              action: data.label + " > " + childNode.label,
            };
          });
        }
      });
    });
  };

  return (
    <Dialog
      open={props.open}
      fullWidth
      PaperProps={{
        sx: {
          background: "#13171F",
          width: 800,
          height: 560,
        },
      }}
      maxWidth={false}
    >
      <DialogTitle
        style={{ display: "flex", justifyContent: "space-between" }}
        sx={{ pt: 1, pb: 1 }}
      >
        <Typography
          className="header-text"
          sx={{ display: "contents", alignContent: "center" }}
        >
          Create New Action
        </Typography>
        <IconButton onClick={() => props.setOpen(false)}>
          <CloseIcon fontSize="small" sx={{ color: "#6A7187" }} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Box display={"flex"}>
          <Box sx={{ width: "50%", mr: 2 }}>
            <CustomInputLabel label="Name" />
            <TextField
              onChange={(val) => {
                setCreatedAction((prevData) => ({
                  ...prevData,
                  actionName: val.target.value,
                }));
              }}
              value={createdAction.actionName}
              sx={{
                backgroundColor: "#0A0A0A",
                width: "100%",
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
                placeholder: "Enter Action name",
                style: {
                  height: "50px",
                  padding: 0,
                  paddingLeft: 8,
                },
              }}
            ></TextField>
            <CustomInputLabel label="Action" />
            <DropDownWithTreeOption
              dropdownOptions={actionTypeData}
              handleNodeSelect={handleActionNodeSelect}
              value={createdAction.action}
              isTrigger={false}
            />
          </Box>
          <Box sx={{ width: "50%" }}>
            <CustomInputLabel label="Send by" />
            <FormControl fullWidth>
              <InputLabel id="demo-multiple-checkbox-label">
                {createdAction.actionSendBy === "" ? "Select" : ""}
              </InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                SelectDisplayProps={{ style: { padding: "13.5px 14px" } }}
                sx={{
                  backgroundColor: "#0A0A0A",
                  "& > .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#2B3349",
                  },
                }}
                placeholder="Select"
                value={createdAction.actionSendBy}
                onChange={(val) => {
                  setCreatedAction((prevData) => {
                    return {
                      ...prevData,
                      actionSendBy: val.target.value,
                    };
                  });
                }}
                inputProps={{
                  style: { height: "40px", padding: 0, paddingLeft: 8 },
                }}
                input={<OutlinedInput inputProps={{ placeholder: "Select" }} />}
                renderValue={(selected) => selected}
                MenuProps={MenuProps}
              >
                {sendByData.map((option) => (
                  <MenuItem key={option} value={option}>
                    <ListItemText primary={option} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <CustomInputLabel label="Send to" />
            <TextField
              onChange={(event) => {
                setCreatedAction((prevData) => {
                  return {
                    ...prevData,
                    actionSendTo: event.target.value,
                  };
                });
              }}
              value={createdAction.actionSendTo}
              sx={{
                backgroundColor: "#0A0A0A",
                width: "100%",
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
                placeholder: "Enter receivers here",
                style: {
                  height: "50px",
                  padding: 0,
                  paddingLeft: 8,
                },
              }}
            ></TextField>
          </Box>
        </Box>
        <CustomInputLabel label="Trigger" />
        <TextField
          multiline
          value={createdAction.actionTrigger}
          onChange={(event) => {
            setCreatedAction((prevData) => {
              return {
                ...prevData,
                actionTrigger: event.target.value,
              };
            });
          }}
          sx={{
            backgroundColor: "#0A0A0A",
            width: "100%",
            "& label.Mui-focused": {
              color: "#222634",
            },
            "& .MuiInput-underline:after": {
              borderBottomColor: "#222634",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#222634",
                borderWidth: "2px",
                borderBottomColor: "transparent",
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
              },
              "&:hover fieldset": {
                borderColor: "#222634",
                borderBottomColor: "transparent",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#222634",
                borderBottomColor: "transparent",
              },
            },
          }}
          inputProps={{
            placeholder: "Enter message text",
            style: {
              height: "100px",
              padding: 0,
              paddingLeft: 8,
            },
          }}
        ></TextField>
        <Box
          sx={{
            backgroundColor: "#13171F",
            borderColor: "#222634",
            borderStyle: "solid",
            borderTopColor: "transparent",
            borderWidth: "2px",
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box display={"flex"} gap={2} padding={1.5} alignItems={"center"}>
            <Box sx={{ cursor: "pointer" }}>
              <AttachmentLink />
            </Box>
            <Box sx={{ cursor: "pointer" }}>
              <Smiley />
            </Box>
            <Box sx={{ cursor: "pointer" }}>
              <PhotoImage />
            </Box>
            <Box sx={{ cursor: "pointer" }}>
              <TextSizeSquare />
            </Box>
          </Box>
          <Box sx={{ padding: 1 }}>
            <Button
              variant="outlined"
              sx={{
                borderColor: "#2B3349",
                color: "white",
                textTransform: "none",
                padding: "4px 16px",
                borderRadius: "3px",
                ":hover": {
                  borderColor: "#2B3349",
                  color: "white",
                },
              }}
            >
              Insert Macros
            </Button>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ mr: 2 }}>
        <Button
          tabIndex={9}
          variant="outlined"
          onClick={() => {
            props.setOpen(false);
          }}
          sx={{
            borderColor: "#2B3349",
            color: "white",
            textTransform: "none",
            padding: "12px 40px",
            borderRadius: "3px",
          }}
        >
          Cancel
        </Button>
        <Button
          tabIndex={9}
          onClick={() => {
            setCreatedAction({
              action: "",
              actionName: "",
              actionSendBy: "",
              actionSendTo: "",
              actionTrigger: "",
            });
            props.handleSaveAction(createdAction);
            props.setOpen(false);
          }}
          variant="contained"
          sx={{ textTransform: "none", padding: "12px 32px" }}
        >
          Save Action
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(CreateActionDialog);
