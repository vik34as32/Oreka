import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { CSSProperties } from "react";

type confirmationDialogProps = {
  message: string;
  open: boolean;
  onClose: (confirm: boolean) => void;
};

const ConfirmationDialog = (props: confirmationDialogProps) => {
  const handleClose = () => {
    props.onClose(false);
  };

  const handleConfirm = () => {
    props.onClose(true);
  };

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ fontSize: "14px" }}>
          {"Confirmation"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" sx={style}>
            {props.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" sx={style}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            sx={style}
            autoFocus
            variant="contained"
            color="error"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const style: CSSProperties = {
  fontSize: "12px",
};

export default ConfirmationDialog;
