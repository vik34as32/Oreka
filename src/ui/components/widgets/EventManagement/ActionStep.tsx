import { DeleteOutline, DragIndicator } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import CreateActionDialog from "./CreateActionDialog";
import { ActionData } from "./CreateNewAlert";

type ActionStepProps = {
  actions: ActionData[];
  setActions: React.Dispatch<React.SetStateAction<ActionData[]>>;
};

const ActionStep = (props: ActionStepProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const handleSaveAction = (createdAction: ActionData) => {
    props.setActions([...props.actions, createdAction]);
  };

  const handleDeleteAction = (index: number) => {
    props.setActions((prevActions) => {
      const updatedActions = [...prevActions];
      updatedActions.splice(index, 1);
      return updatedActions;
    });
  };

  return (
    <>
      <Box
        sx={{
          width: 1,
          mt: 2,
          border: "#2B3348",
          borderWidth: "1px",
          borderStyle: "solid",
          height: "475px",
          paddingTop: 0.5,
          backgroundColor: "#0A0A0A",
        }}
      >
        <Box
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gap={4}
          sx={{
            backgroundColor: "#1D222F",
            paddingTop: 0.5,
            paddingBottom: 0.5,
          }}
        >
          <Box gridColumn="span 1" display={"flex"} alignItems={"center"}>
            <Typography
              sx={{
                pl: 8,
                fontFamily: "Inter",
                fontSize: 14,
                color: "#A9B2CC",
                fontWeight: 500,
              }}
            >
              Order
            </Typography>
          </Box>
          <Box gridColumn="span 8" display={"flex"} alignItems={"center"}>
            <Typography
              sx={{
                fontFamily: "Inter",
                fontSize: 14,
                color: "#A9B2CC",
                fontWeight: 500,
              }}
            >
              Name
            </Typography>
          </Box>
          <Box gridColumn="span 3" display={"flex"} justifyContent={"flex-end"}>
            <Button
              variant="contained"
              sx={{
                textTransform: "none",
                fontFamily: "Inter",
                fontSize: 14,
                padding: "8px 16px 8px 16px",
                borderRadius: "4px",
                height: "28px",
                mr: 1.5,
              }}
              onClick={() => {
                setIsEdit(false);
                setOpen(true);
              }}
            >
              Create New Action
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            maxHeight: "375px",
            overflow: "scroll",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {props.actions.map((currentAction, index) => (
            <Box
              display="grid"
              gridTemplateColumns="repeat(12, 1fr)"
              gap={4}
              sx={{
                paddingTop: 0.5,
                paddingBottom: 0.5,
                border: "#1D222F",
                borderStyle: "solid",
                borderWidth: "1px",
              }}
            >
              <Box
                gridColumn="span 1"
                display={"flex"}
                alignItems={"center"}
                onClick={() => {
                  setSelectedIndex(index);
                  setOpen(true);
                  setIsEdit(true);
                }}
              >
                <Box
                  display={"flex"}
                  flexDirection={"row"}
                  alignItems={"center"}
                >
                  <DragIndicator
                    sx={{ color: "#6A7187", ml: 1, fontSize: 30 }}
                  />
                  <Typography
                    sx={{
                      fontFamily: "Inter",
                      fontSize: 14,
                      color: "#A9B2CC",
                      fontWeight: 500,
                      ml: 5,
                    }}
                  >
                    {index + 1}
                  </Typography>
                </Box>
              </Box>
              <Box
                gridColumn="span 8"
                display={"flex"}
                alignItems={"center"}
                onClick={() => {
                  setSelectedIndex(index);
                  setOpen(true);
                  setIsEdit(true);
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Inter",
                    fontSize: 14,
                    color: "#A9B2CC",
                    fontWeight: 500,
                    ml: 2,
                  }}
                >
                  {currentAction.actionName}
                </Typography>
              </Box>
              <Box
                gridColumn="span 3"
                display={"flex"}
                justifyContent={"flex-end"}
              >
                <DeleteOutline
                  sx={{ mt: 0.5, mr: 4, cursor: "pointer" }}
                  onClick={() => {
                    setIsEdit(false);
                    handleDeleteAction(index);
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
      {open && (
        <CreateActionDialog
          open={open}
          setOpen={setOpen}
          handleSaveAction={handleSaveAction}
          isEdit={isEdit}
          actionData={props.actions[selectedIndex]}
        />
      )}
    </>
  );
};

export default React.memo(ActionStep);
