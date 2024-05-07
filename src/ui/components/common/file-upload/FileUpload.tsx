import { Box, Button } from "@mui/material";
import { MuiFileInput } from "mui-file-input";
import React, { ReactElement, useState } from "react";

export interface FileUploadProps {
  onFileUploaded: (res: string[] | null) => void;
  disabled?: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const FILE_UPLOAD_ENDPOINT = import.meta.env.VITE_FILE_UPLOAD_ENDPOINT;
const FileUpload: React.FC<FileUploadProps> = (
  props: FileUploadProps
): ReactElement => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = () => {
    if (file !== null) {
      const formData = new FormData();
      formData.append("File", file, file.name);
      fetch(`${API_BASE_URL}${FILE_UPLOAD_ENDPOINT}`, {
        method: "POST",
        body: formData,
        redirect: "follow",
      })
        .then((res) => res.json())
        .then((res) => props.onFileUploaded(res));
    } else props.onFileUploaded(null);
  };

  return (
    <Box sx={{ display: "flex", height: 40 }}>
      <MuiFileInput
        disabled={props.disabled}
        label="Choose file"
        placeholder="Choose a file"
        value={file}
        size="small"
        onChange={(file) => setFile(file)}
        sx={{ mr: 1, height: "inherit", width: 1 }}
        InputProps={{
          sx: {
            height: 40,
            color: "#D5E2F0",
            fontSize: 12,
            fontFamily: "Inter",
          },
        }}
        className="normal-text"
      />
      <Button
        disabled={props.disabled}
        onClick={() => handleFileUpload()}
        tabIndex={3}
        size="small"
        variant="contained"
        sx={{ textTransform: "none" }}
      >
        Upload
      </Button>
    </Box>
  );
};

export default React.memo(FileUpload);
