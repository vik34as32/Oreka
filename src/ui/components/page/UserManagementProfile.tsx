import {
  Avatar,
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  TextField,
} from "@mui/material";
import React, { CSSProperties, useState } from "react";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  ExpandMoreOutlined,
  HowToRegOutlined,
  NotInterestedOutlined,
  PersonAddAltOutlined,
  Add,
  RemoveCircleOutlineSharp,
} from "@mui/icons-material";
import CheckBoxTreeView, {
  groups,
} from "../common/checkbox-treeview/CheckBoxTreeView";
import { connect } from "react-redux";
import { Dispatch } from "redux";
// import {
//   deleteUsersProfile,
//   fetchUsersProfile,
//   saveUsersProfile,
// } from "../../../redux/action-handlers/users/UsersActions";
import { setAlertMessage } from "../../../redux/action-handlers/app/AppActions";
import { UserRowDataType } from "./UserManagement";
import ConfirmationDialog from "../common/confirmation-dialog/ConfirmationDialog";

export type UserManagementProfileType = {
  login: number;
  Name: string;
  ipAdress: string;
};

export type UserDataType = {
  loginuser: string;
  password: string;
  name: string;
  fingerPrint: string[];
  groups: groups[];
  permission: groups[];
  tablecolumns: groups[];
};

type userProfile = {
  user: UserDataType;
  profile: UserManagementProfileType;
  createNew: boolean;
  onClose: () => void;
  // fetchUsersProfile: (login: string) => void;
  // saveUsersProfile: (user: UserDataType) => void;
  // deleteUsersProfile: (login: string) => void;
  setAlertMessage: (message: string, messageType: string) => void;
  onAdd: (login: string, name: string) => void;
  onDelete: (login: string) => void;
};

const UserManagementProfile = (props: userProfile) => {
  const [userData, setUserData] = useState<UserDataType>({
    loginuser: props.profile.login.toString(),
    name: props.profile.Name,
    password: "",
    fingerPrint: [],
    groups: [],
    permission: [],
    tablecolumns: [],
  });

  const [expanded, setExpanded] = React.useState<string | false>(false);
  const [edit, setEdit] = useState(false);
  const [checkBoxEditable, setCheckBoxEditable] = useState(false);
  const [newFingerprint, setNewFingerprint] = useState("");
  const [openDialogConfirm, setOpenDialogConfirm] = useState(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const handleEdit = () => {
    setEdit(true);
    setCheckBoxEditable(true);
  };

  React.useEffect(() => {
    props.fetchUsersProfile(props.profile.login.toString());
  }, []);

  React.useEffect(() => {
    setUserData(props.user);
    if (props.createNew) setCheckBoxEditable(true);
  }, [props.user]);

  if (props.user === null) {
    return <></>;
  }
  return (
    <Box
      sx={{
        height: "100vh",
        maxWidth: { lg: "500px" },
      }}
    >
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex" }}>
              <Avatar sx={avatar}>{props.profile.Name.substring(0, 1)}</Avatar>
              <Typography sx={name}>
                {props.profile.Name !== "NA" && props.profile.Name}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              {!props.createNew && !edit && (
                <React.Fragment>
                  <IconButton
                    aria-label="delete"
                    component="label"
                    onClick={() => {
                      setOpenDialogConfirm(true);
                    }}
                  >
                    <DeleteOutlineOutlinedIcon htmlColor="#6A7187" />
                  </IconButton>
                  <IconButton
                    aria-label="edit"
                    component="label"
                    onClick={handleEdit}
                  >
                    <EditOutlinedIcon htmlColor="#6A7187" />
                  </IconButton>
                </React.Fragment>
              )}
              {edit && (
                <React.Fragment>
                  <IconButton
                    aria-label="editDone"
                    component="label"
                    onClick={() => {
                      setEdit(false);
                      setCheckBoxEditable(false);
                      props.saveUsersProfile(userData);
                    }}
                  >
                    <HowToRegOutlined htmlColor="#6A7187" />
                  </IconButton>
                  <IconButton
                    aria-label="cancel"
                    component="label"
                    onClick={() => {
                      setEdit(false);
                      setCheckBoxEditable(false);
                      props.fetchUsersProfile(props.profile.login.toString());
                    }}
                  >
                    <NotInterestedOutlined htmlColor="#6A7187" />
                  </IconButton>
                </React.Fragment>
              )}
              {props.createNew && (
                <React.Fragment>
                  <IconButton
                    aria-label="add"
                    component="label"
                    onClick={() => {
                      if (
                        userData.loginuser === "" ||
                        userData.name === "" ||
                        userData.password === ""
                      ) {
                        props.setAlertMessage(
                          "Login, Name and Passwords are required!",
                          "error"
                        );
                        return;
                      }

                      props.saveUsersProfile(userData);
                      props.onAdd(userData.loginuser, userData.name);
                      props.setAlertMessage("New user has been added!", "info");
                      props.onClose();
                    }}
                  >
                    <PersonAddAltOutlined htmlColor="#6A7187" />
                  </IconButton>
                </React.Fragment>
              )}
            </Box>
          </Box>
          <Grid container spacing={1} sx={[gridCSS]}>
            {props.createNew && (
              <>
                <Grid item xs={2}>
                  Name:
                </Grid>
                <Grid item xs={10} sx={gridOffWhiteColor}>
                  <TextField
                    size="small"
                    variant="standard"
                    placeholder="New Name"
                    type="text"
                    inputProps={{ sx: { height: "12px", fontSize: "12px" } }}
                    onChange={(e) => {
                      setUserData((s) => ({ ...s, name: e.target.value }));
                    }}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={2}>
              Login Id:
            </Grid>
            <Grid item xs={10} sx={gridOffWhiteColor}>
              {props.createNew && (
                <TextField
                  size="small"
                  variant="standard"
                  placeholder="New Login ID"
                  type="number"
                  required
                  inputProps={{ sx: { height: "12px", fontSize: "12px" } }}
                  onChange={(e) => {
                    setUserData((s) => ({ ...s, loginuser: e.target.value }));
                  }}
                />
              )}
              {!props.createNew && props.profile.login}
            </Grid>
            <Grid item xs={2}>
              Password:
            </Grid>
            <Grid item xs={10} sx={gridOffWhiteColor}>
              {props.createNew && (
                <TextField
                  size="small"
                  variant="standard"
                  placeholder="New Password"
                  required
                  inputProps={{ sx: { height: "12px", fontSize: "12px" } }}
                  onChange={(e) => {
                    setUserData((s) => ({ ...s, password: e.target.value }));
                  }}
                />
              )}
              {edit && (
                <TextField
                  size="small"
                  variant="standard"
                  defaultValue={userData.password}
                  required
                  inputProps={{ sx: { height: "12px", fontSize: "12px" } }}
                  onChange={(e) => {
                    setUserData((s) => ({ ...s, password: e.target.value }));
                  }}
                />
              )}
              {!props.createNew && !edit && "*********************"}
            </Grid>
            <Grid item xs={12} sx={{ my: 1 }}></Grid>
            <Grid item xs={12}>
              Fingerprints:
            </Grid>
            <Grid item xs={12} sx={gridOffWhiteColor}>
              {(props.createNew || edit) && (
                <>
                  <Grid container spacing={2}>
                    {props.user.fingerPrint.map((v, i) => {
                      if (v === "") return <></>;
                      return (
                        <Grid item xs={4} key={i}>
                          {v.length > 12 && v.substring(0, 12) + "*****"}
                          {v.length <= 12 && v}
                          <sup
                            onClick={() => {
                              const data = { ...userData };
                              data.fingerPrint.splice(i, 1);
                              setUserData(data);
                            }}
                          >
                            <RemoveCircleOutlineSharp
                              sx={{
                                fontSize: ".8rem",
                                color: "red",
                                cursor: "pointer",
                              }}
                            />
                          </sup>
                        </Grid>
                      );
                    })}
                  </Grid>
                  <br />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <TextField
                      id="insertFingerprintText"
                      size="small"
                      variant="standard"
                      //defaultValue={userData.password}
                      inputProps={{ sx: { height: "12px", fontSize: "12px" } }}
                      onChange={(e) => {
                        setNewFingerprint(e.target.value);
                      }}
                    />
                    <Box>
                      <Add
                        onClick={() => {
                          userData.fingerPrint.push(newFingerprint);
                          setNewFingerprint("");
                          let input = document.getElementById(
                            "insertFingerprintText"
                          )! as HTMLInputElement;
                          input.value = "";
                        }}
                        sx={{
                          color: "action.active",
                          mr: 1,
                          size: "1rem",
                          cursor: "pointer",
                        }}
                      />
                    </Box>
                  </Box>
                </>
              )}
              {!props.createNew && !edit && (
                <Grid container spacing={2}>
                  {props.user.fingerPrint.map((v, i) => {
                    if (v === "") return <></>;
                    return (
                      <Grid item xs={4} key={i}>
                        {v.substring(0, 12) + "*****"}
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            </Grid>
          </Grid>
          <br />
          <Accordion
            TransitionProps={{ unmountOnExit: true }}
            sx={[
              {
                alignContent: "center",
                width: "inherit",
                border: "1px solid #222634",
              },
            ]}
            expanded={expanded === "panel1"}
            onChange={handleChange("panel1")}
          >
            <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
              <Typography
                sx={{ ...gridCSS, flexShrink: 0, ml: 0, pl: 0, mt: 0 }}
              >
                Groups
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box height={"10rem"} overflow={"auto"}>
                <CheckBoxTreeView
                  data={props.user.groups}
                  isEditable={checkBoxEditable}
                />
              </Box>
            </AccordionDetails>
          </Accordion>
          <Accordion
            TransitionProps={{ unmountOnExit: true }}
            sx={[{ width: "inherit" }]}
            expanded={expanded === "panel2"}
            onChange={handleChange("panel2")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreOutlined />}
              aria-controls="panel2bh-content"
              id="panel2bh-header"
            >
              <Typography
                sx={{ ...gridCSS, flexShrink: 0, ml: 0, pl: 0, mt: 0 }}
              >
                Permissions
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box height={"10rem"} overflow={"auto"}>
                <CheckBoxTreeView
                  data={props.user.permission}
                  isEditable={checkBoxEditable}
                />
              </Box>
            </AccordionDetails>
          </Accordion>
          <Accordion
            TransitionProps={{ unmountOnExit: true }}
            sx={[{ width: "inherit" }]}
            expanded={expanded === "panel3"}
            onChange={handleChange("panel3")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreOutlined />}
              aria-controls="panel3bh-content"
              id="panel3bh-header"
            >
              <Typography
                sx={{ ...gridCSS, flexShrink: 0, ml: 0, pl: 0, mt: 0 }}
              >
                Column Permission
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box height={"10rem"} overflow={"auto"}>
                <CheckBoxTreeView
                  data={props.user.tablecolumns}
                  isEditable={checkBoxEditable}
                />
              </Box>
            </AccordionDetails>
          </Accordion>
        </CardContent>
      </Card>
      <ConfirmationDialog
        message={"Are you sure you want to delete the user!"}
        open={openDialogConfirm}
        onClose={(confirm) => {
          if (confirm) {
            // props.deleteUsersProfile(props.profile.login.toString());
            props.onDelete(props.profile.login.toString());
            props.setAlertMessage("User has been deleted", "error");
            props.onClose();
          }
          setOpenDialogConfirm(false);
        }}
      />
    </Box>
  );
};

const name: CSSProperties = {
  fontFamily: "Inter",
  fontWeight: 700,
  fontSize: "14px",
};

const avatar: CSSProperties = {
  width: 24,
  height: 24,
  color: "#FAA633",
  font: "Manrope",
  fontWeight: 700,
  fontSize: "12px",
  backgroundColor: "#272B35",
  marginRight: ".5rem",
};

const gridCSS: CSSProperties = {
  fontFamily: "Inter",
  fontWeight: 400,
  fontSize: "12px",
  paddingLeft: ".5rem",
  marginTop: "1rem",
};

const gridOffWhiteColor: CSSProperties = {
  color: "#9DA6C0",
};

function mapStateToProps(state: any) {
  return {
    user: state.users.user,
  };
}
function mapDispatchToProps(dispatch: Dispatch) {
  return {
    // fetchUsersProfile: (login: string) => fetchUsersProfile(login),
    // saveUsersProfile: (user: UserDataType) => saveUsersProfile(user),
    // deleteUsersProfile: (login: string) => deleteUsersProfile(login),
    setAlertMessage: (message: string, messageType: string) =>
    dispatch(setAlertMessage(message, messageType)),
  };
}

export default React.memo(
  connect(mapStateToProps, mapDispatchToProps)(UserManagementProfile)
);
