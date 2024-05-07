import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { ReactElement, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { WidgetConfigsType } from "../../custom-widget/WidgetConfig";

const ADDON_BACKEND_URL = import.meta.env.VITE_ADDON_BACKEND_URL;

export interface FomulaEditModalProps {
  open: boolean;
  setConfigs:(configs:WidgetConfigsType) => void;
  onClose: () => void;
}
const FormulaEditModal: React.FC<FomulaEditModalProps> = (
  props: FomulaEditModalProps
): ReactElement => {
  const [formula, setFormula] = useState<string>("");
  const handleSubmit = async () => {
    const res = await fetch(`${ADDON_BACKEND_URL}/configs?formula=${formula}`);
    const result = await res.json();
    setFormula("");
    props.setConfigs(result.configs);
    props.onClose();
  };
  return (
    <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth="md">
      <DialogTitle
        style={{ display: "flex", justifyContent: "space-between" }}
        sx={{ pt: 1, pb: 1 }}
      >
        <Typography variant="h6" fontWeight={700}>
          {"Edit Formula"}
        </Typography>
        <IconButton onClick={props.onClose}>
          <CloseIcon fontSize="small" sx={{ color: "#6A7187" }} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 1 }}>
        <TextField
          size="small"
          type={"text"}
          value={formula}
          onChange={(e) => setFormula(e.target.value)}
          InputProps={{
            className: "normal-text",
            sx: {
              height: 45,
              background: "#0A0A0A",
            },
          }}
          sx={{ width: 1 }}
          variant="outlined"
        />
        <DialogActions>
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default FormulaEditModal;
