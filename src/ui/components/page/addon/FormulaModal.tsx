import CloseIcon from "@mui/icons-material/Close";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import {
Alert,
Box,
Dialog,
DialogContent,
DialogTitle,
IconButton,
Snackbar,
Tooltip,
Typography
} from "@mui/material";
import React, { ReactElement, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

export interface FormulaModalProps {
  open: boolean;
  onClose: () => void;
  formula: string;
}
const FormulaModal: React.FC<FormulaModalProps> = (props): ReactElement => {
  const [open,setOpen] = useState<boolean>(false);
  const handleClose = () => {
    setOpen(false);
  }
  const handleCopy = () => {
    setOpen(true);
  }
  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle
        style={{ display: "flex", justifyContent: "space-between" }}
        sx={{ pt: 1, pb: 1 }}
      >
        <Typography variant="h6" fontWeight={700}>
          {"Formula"}
        </Typography>
        <IconButton onClick={props.onClose}>
          <CloseIcon fontSize="small" sx={{ color: "#6A7187" }} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 1 }}>
        <CopyToClipboard text={props.formula} onCopy={handleCopy}>
          <Box
            sx={{
              p: 1,
              background: "#1D2327",
              overflowX: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <CopyToClipboard text={props.formula} onCopy={handleCopy}>
              <Tooltip title="click to copy">
                <ContentCopyOutlinedIcon
                  sx={{ float: "right", cursor: "pointer" }}
                />
              </Tooltip>
            </CopyToClipboard>
            <Typography>{props.formula}</Typography>
          </Box>
        </CopyToClipboard>
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Formula copied !!
          </Alert>
        </Snackbar>
      </DialogContent>
    </Dialog>
  );
};
export default React.memo(FormulaModal);
