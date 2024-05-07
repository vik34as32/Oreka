import { Alert, AlertColor, Snackbar } from "@mui/material";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { clearMessage } from "../../../../redux/action-handlers/app/AppActions";
export type MessageProps = {
  message: string;
  type: AlertColor;
  clearMessage:() => void;
};
const MessageComponent = (props: MessageProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const handleClose = (): void => {
    setOpen(false);
    props.clearMessage();
  };
  useEffect(() => {
    if (props.message.length) setOpen(true);
  }, [props.message]);

  return (
    <Snackbar
      open={open}
      autoHideDuration={2000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center"}}
    >
      <Alert onClose={handleClose} severity={props.type} sx={{ width: "100%" }}>
        {props.message}
      </Alert>
    </Snackbar>
  );
};
function mapStateToProps(state: any) {
  return {
    message: state.app.message.text,
    type: state.app.message.type
  };
}
function mapDispatchToProps(dispatch: Dispatch<any>) {
    return {
      clearMessage:() => dispatch(clearMessage())
    };
  }
export default connect(mapStateToProps, mapDispatchToProps)(MessageComponent);
