import { ArrowBack } from "@mui/icons-material";
import { Box, Button, Drawer, IconButton, Typography } from "@mui/material";
import { FirstDataRenderedEvent, RowClickedEvent } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import React, { useMemo, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Dispatch } from "redux";
// import { fetchUsers } from "../../../redux/action-handlers/users/UsersActions";
import * as appActions from "../../../redux/action-handlers/app/AppActions";
import UserManagementProfile, {
  UserManagementProfileType,
} from "./UserManagementProfile";


export type UserRowDataType = {
  loginuser: string;
  name: string;
  status: string;
  ipAddress: string;
  fingerPrint: string;
  sessionid: string;
};

type UserManagementProps = {
  users: UserRowDataType[];
  // fetchUsers: () => void;
  connectWebSocket: () => void;
};

const UserManagerment = (props: UserManagementProps) => {
  const navigate = useNavigate();

  const [users, setUsers] = useState<UserRowDataType[]>(props.users);

  const [userProfile, setUserProfile] = useState<UserManagementProfileType>();
  const [createNew, setCreateNew] = useState(false);
  const [open, setOpen] = useState(false);

  const defaultColDef = useMemo(() => {
    return {
      editable: false,
      sortable: true,
      filter: true,
      resizable: true,
      minWidth: 100,
    };
  }, []);

  const columnDefs = [
    { field: "loginuser", headerName: "login" },
    { field: "name", headerName: "Name" },
    { field: "status", headerName: "Status" },
    { field: "ipaddress", headerName: "IP Address" },
    { field: "fingerprint", headerName: "Fingerprint" },
    { field: "sessionid", headerName: "SessionId" },
  ];

  React.useEffect(() => {
    // props.connectWebSocket();
    // props.fetchUsers();
  }, []);
  
  React.useEffect(() => {
    setUsers(props.users);
  }, [props.users]);

  const handleSlider = (e: RowClickedEvent) => {
    setOpen(true);
    setUserProfile({
      login: parseInt(e.data["loginuser"]),
      ipAdress: e.data["ipaddress"],
      Name: e.data["name"],
    });
  };

  const handleNewUser = () => {
    setOpen(true);
    setCreateNew(true);
    setUserProfile({
      login: 0,
      ipAdress: "127.0.0.1",
      Name: "NA",
    });
  };

  const handleGridReady = (params: FirstDataRenderedEvent) => {
    const cols = params.columnApi.getColumns();
    cols && params.columnApi.autoSizeColumns(cols, true);
  };

  return (
    <Box sx={{ px: 3, position: "relative" }}>
      <Box display={"flex"} justifyContent={"space-between"} paddingY={2}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <IconButton onClick={() => navigate("*")}>
            <ArrowBack />
          </IconButton>
          <Typography
            sx={{
              px: 1,
              color: "white",
              fontWeight: "700",
              fontSize: "16px",
              lineHeight: "19px",
            }}
          >
            User Management
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="small"
          sx={{
            paddingY: 0,
            maxHeight: "2rem",
            fontSize: "10px",
            fontWeight: "700",
          }}
          onClick={handleNewUser}
        >
          Create new user
        </Button>
      </Box>
      <div
        className="ag-theme-balham-dark"
        style={{
          height: "100vh",
          display: "block",
          // '--ag-grid-size': '10px',
          // '--ag-list-item-height': "40px".
          // '--ag-font-size': "32px"
        }}
      >
        <AgGridReact
          rowData={users}
          columnDefs={columnDefs}
          onRowDoubleClicked={handleSlider}
          defaultColDef={defaultColDef}
          onFirstDataRendered={handleGridReady}
        ></AgGridReact>
      </div>
      <Drawer
        anchor={"right"}
        open={open}
        onClose={() => {
          setOpen(false);
          setCreateNew(false);
        }}
      >
        <UserManagementProfile
          profile={userProfile!}
          createNew={createNew}
          onAdd={(login: string, name: string) => {
            // const data = [...users];
            // data.push({
            //   loginuser: login,
            //   name: name,
            //   status: "",
            //   ipAddress: "",
            //   fingerPrint: "",
            //   sessionid: "",
            // });
            // setUsers(data);
          }}
          onDelete={(login: string) => {
            let data = [...users];
            data = data.filter((s) => s.loginuser !== login);
            setUsers(data);
          }}
          onClose={() => {
            setOpen(false);
            setCreateNew(false);
          }}
        />
      </Drawer>
    </Box>
  );
};

function mapStateToProps(state: any) {
  return {
    users: state.users.users,
  };
}
function mapDispatchToProps(dispatch: Dispatch) {
  return {
    // fetchUsers: () => fetchUsers(),
    connectWebSocket: () => appActions.connectWebSocket(dispatch),
  };
}

export default React.memo(
  connect(mapStateToProps, mapDispatchToProps)(UserManagerment)
);
