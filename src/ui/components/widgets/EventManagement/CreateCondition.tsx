import React, { ChangeEventHandler, useState } from "react";
import {
  Box,
  Button,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Menu,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import {
  DeleteOutline,
  DragIndicator,
  KeyboardArrowDown,
} from "@mui/icons-material";
import OrIndicator from "@svg/OrIndicator.svg";
import { ConditionData } from "./CreateNewAlert";
import CreateConditionTableHeader from "./CreateConditionTableHeader";
import DropDownMenu from "./DropDownMenu";

type CompareConditionType = {
  conditionName: string;
  conditionDataType: string;
};

type CreateConditionProps = {
  conditions: ConditionData[];
  setConditions: React.Dispatch<React.SetStateAction<ConditionData[]>>;
  selectedAndConditionIndex: number;
  setSelectedAndConditionIndex: React.Dispatch<React.SetStateAction<number>>;
  selectedOrConditionIndex: number;
  setSelectedOrConditionIndex: React.Dispatch<React.SetStateAction<number>>;
  handleAddAndCondition: () => void;
  handleAddOrCondition: () => void;
  handleDeleteAndCondition: (index: number) => void;
  handleDeleteOrCondition: (orConditionIndex: number) => void;
  handleAndCompareConditionChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    andConditionIndex: number
  ) => void;
  handleAndConditionValueChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    andConditionIndex: number
  ) => void;
  handleOrCompareConditionChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    andConditionIndex: number,
    orConditionIndex: number
  ) => void;
  handleOrConditionvalueChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    andConditionIndex: number,
    orConditionIndex: number
  ) => void;
  handleAndConditionTypeChange: (
    conditionType: string,
    andConditionIndex: number
  ) => void;
  handleOrConditionTypeChange: (
    conditionType: string,
    andConditionIndex: number,
    orConditionIndex: number
  ) => void;
};

const CreateCondition = (props: CreateConditionProps) => {
  const compareConditionsList: CompareConditionType[] = [
    {
      conditionName: "Contains",
      conditionDataType: "text",
    },
    {
      conditionName: "Not contains",
      conditionDataType: "text",
    },
    {
      conditionName: "Equals",
      conditionDataType: "text",
    },
    {
      conditionName: "Not equal",
      conditionDataType: "text",
    },
    {
      conditionName: "Starts with",
      conditionDataType: "text",
    },
    {
      conditionName: "Ends with",
      conditionDataType: "text",
    },
    {
      conditionName: "Blank",
      conditionDataType: "text",
    },
    {
      conditionName: "Not blank",
      conditionDataType: "text",
    },
    {
      conditionName: "Equals (=)",
      conditionDataType: "number",
    },
    {
      conditionName: "Not equal (!=)",
      conditionDataType: "number",
    },
    {
      conditionName: "Less than (<)",
      conditionDataType: "number",
    },
    {
      conditionName: "Less than or equals (<=)",
      conditionDataType: "number",
    },
    {
      conditionName: "Greater than (>)",
      conditionDataType: "number",
    },
    {
      conditionName: "Greater than or equals (>=)",
      conditionDataType: "number",
    },
    {
      conditionName: "In range ([...])",
      conditionDataType: "number",
    },
  ];

  const conditionTypeData = [
    {
      label: "Schedule",
      nodeId: "1",
      children: [
        { label: "Date", parent: "Schedule", nodeId: "2" },
        { label: "Time", parent: "Schedule", nodeId: "3" },
        { label: "Date and Time", parent: "Schedule", nodeId: "4" },
      ],
    },
    {
      label: "Order",
      nodeId: "5",
      children: [
        { label: "Login", parent: "Order", nodeId: "6" },
        { label: "Time", parent: "Order", nodeId: "7" },
        { label: "Deal", parent: "Order", nodeId: "8" },
        { label: "Order", parent: "Order", nodeId: "9" },
        { label: "Symbol", parent: "Order", nodeId: "10" },
        { label: "Type", parent: "Order", nodeId: "11" },
        { label: "Volume", parent: "Order", nodeId: "12" },
        { label: "Price", parent: "Order", nodeId: "13" },
        { label: "Comment", parent: "Order", nodeId: "14" },
        { label: "Status", parent: "Order", nodeId: "15" },
        { label: "Select", parent: "Order", nodeId: "16" },
        { label: "Select Type", parent: "Order", nodeId: "17" },
        { label: "Subtype", parent: "Order", nodeId: "18" },
        { label: "Contra order", parent: "Order", nodeId: "19" },
        { label: "Trade Execute Time", parent: "Order", nodeId: "20" },
        { label: "Our Comment", parent: "Order", nodeId: "21" },
        { label: "Order State", parent: "Order", nodeId: "22" },
      ],
    },
    {
      label: "Dealing",
      nodeId: "23",
      children: [
        { label: "Log Time", parent: "Dealing", nodeId: "24" },
        { label: "Time", parent: "Dealing", nodeId: "25" },
        { label: "Login", parent: "Dealing", nodeId: "26" },
        { label: "Deal", parent: "Dealing", nodeId: "27" },
        { label: "Order", parent: "Dealing", nodeId: "28" },
        { label: "Order Type", parent: "Dealing", nodeId: "29" },
        { label: "Symbol", parent: "Dealing", nodeId: "30" },
        { label: "Type", parent: "Dealing", nodeId: "31" },
        { label: "Volume", parent: "Dealing", nodeId: "32" },
        { label: "Price", parent: "Dealing", nodeId: "33" },
        { label: "Comment", parent: "Dealing", nodeId: "34" },
        { label: "Entry Type", parent: "Dealing", nodeId: "35" },
        { label: "Current Status", parent: "Dealing", nodeId: "36" },
      ],
    },
    {
      label: "Client Position",
      nodeId: "37",
      children: [
        { label: "Login", parent: "Client Position", nodeId: "38" },
        { label: "Name", parent: "Client Position", nodeId: "39" },
        { label: "Symbol", parent: "Client Position", nodeId: "40" },
        { label: "Subbroker", parent: "Client Position", nodeId: "41" },
        { label: "Broker", parent: "Client Position", nodeId: "42" },
        { label: "Company", parent: "Client Position", nodeId: "43" },
        { label: "Previous Volume", parent: "Client Position", nodeId: "44" },
        { label: "Difference", parent: "Client Position", nodeId: "45" },
        { label: "Average", parent: "Client Position", nodeId: "46" },
        { label: "Last Rate", parent: "Client Position", nodeId: "47" },
        { label: "Max Alloted Qty", parent: "Client Position", nodeId: "48" },
        { label: "Extra Volume", parent: "Client Position", nodeId: "49" },
        { label: "Free Margin", parent: "Client Position", nodeId: "50" },
        { label: "Multi", parent: "Client Position", nodeId: "51" },
        { label: "Subbroker Ratio", parent: "Client Position", nodeId: "52" },
        { label: "Broker Ratio", parent: "Client Position", nodeId: "53" },
        { label: "Company Ratio", parent: "Client Position", nodeId: "54" },
        { label: "Client Exposure", parent: "Client Position", nodeId: "55" },
        {
          label: "Subbroker Exposure",
          parent: "Client Position",
          nodeId: "56",
        },
        { label: "Broker Exposure", parent: "Client Position", nodeId: "57" },
        { label: "Company Exposure", parent: "Client Position", nodeId: "58" },
        { label: "Volume", parent: "Client Position", nodeId: "59" },
        { label: "Subbroker Volume", parent: "Client Position", nodeId: "60" },
        { label: "Broker Volume", parent: "Client Position", nodeId: "61" },
        { label: "Company Volume", parent: "Client Position", nodeId: "62" },
        {
          label: "Client Gross Amount",
          parent: "Client Position",
          nodeId: "63",
        },
        {
          label: "Subbroker Gross Amount",
          parent: "Client Position",
          nodeId: "64",
        },
        {
          label: "Broker Gross Amount",
          parent: "Client Position",
          nodeId: "65",
        },
        {
          label: "Company Gross Amount",
          parent: "Client Position",
          nodeId: "66",
        },
        { label: "Brokerage Type", parent: "Client Position", nodeId: "67" },
        { label: "Click Brok Rate", parent: "Client Position", nodeId: "68" },
        {
          label: "Subbroker Brok Rate",
          parent: "Client Position",
          nodeId: "69",
        },
        { label: "Broker Brok Rate", parent: "Client Position", nodeId: "70" },
        { label: "Comapny Brok Rate", parent: "Client Position", nodeId: "71" },
        {
          label: "Client Floating PL",
          parent: "Client Position",
          nodeId: "72",
        },
        {
          label: "Subbroker Floating PL",
          parent: "Client Position",
          nodeId: "73",
        },
        {
          label: "Broker Floating PL",
          parent: "Client Position",
          nodeId: "74",
        },
        {
          label: "Company Floating PL",
          parent: "Client Position",
          nodeId: "75",
        },
        { label: "Client Balance", parent: "Client Position", nodeId: "76" },
        { label: "Broker Balance", parent: "Client Position", nodeId: "77" },
        { label: "Company Balance", parent: "Client Position", nodeId: "78" },
        { label: "Client Gross", parent: "Client Position", nodeId: "79" },
        { label: "Subbroker Gross", parent: "Client Position", nodeId: "80" },
        { label: "Broker Gross", parent: "Client Position", nodeId: "81" },
        { label: "Company Gross", parent: "Client Position", nodeId: "82" },
        { label: "Client Brokarage", parent: "Client Position", nodeId: "83" },
        {
          label: "Subbroker Brokarage",
          parent: "Client Position",
          nodeId: "84",
        },
        { label: "Broker Brokarage", parent: "Client Position", nodeId: "85" },
        { label: "Company Brokarage", parent: "Client Position", nodeId: "86" },
        { label: "Client Net Amount", parent: "Client Position", nodeId: "87" },
        {
          label: "Subbroker Net Amount",
          parent: "Client Position",
          nodeId: "88",
        },
        { label: "Broker Net Amount", parent: "Client Position", nodeId: "89" },
        {
          label: "Company Net Amount",
          parent: "Client Position",
          nodeId: "90",
        },
        {
          label: "Client Gross Total",
          parent: "Client Position",
          nodeId: "91",
        },
        { label: "Client Brok Total", parent: "Client Position", nodeId: "92" },
        { label: "Client Net Total", parent: "Client Position", nodeId: "93" },
        { label: "Credit Limit", parent: "Client Position", nodeId: "94" },
        { label: "Exchange", parent: "Client Position", nodeId: "95" },
        { label: "International", parent: "Client Position", nodeId: "96" },
        { label: "Sector", parent: "Client Position", nodeId: "97" },
        { label: "Industry", parent: "Client Position", nodeId: "98" },
        { label: "RMP", parent: "Client Position", nodeId: "99" },
        { label: "Page", parent: "Client Position", nodeId: "100" },
        { label: "Category", parent: "Client Position", nodeId: "101" },
        { label: "RM", parent: "Client Position", nodeId: "102" },
        { label: "Qty Multi", parent: "Client Position", nodeId: "103" },
        { label: "Qty After Multi", parent: "Client Position", nodeId: "104" },
        { label: "LP Ratio", parent: "Client Position", nodeId: "105" },
        { label: "LP Volume", parent: "Client Position", nodeId: "106" },
        { label: "LP Volume Total", parent: "Client Position", nodeId: "107" },
        {
          label: "Company Volume Total After Multi",
          parent: "Client Position",
          nodeId: "108",
        },
        { label: "Buy/Sell", parent: "Client Position", nodeId: "109" },
        { label: "Debit/Credit", parent: "Client Position", nodeId: "110" },
        { label: "Currency Base", parent: "Client Position", nodeId: "111" },
        { label: "Commodity Group", parent: "Client Position", nodeId: "112" },
      ],
    },
    {
      label: "Price",
      nodeId: "113",
      children: [
        { label: "Symbol", parent: "Price", nodeId: "114" },
        { label: "Open", parent: "Price", nodeId: "115" },
        { label: "High", parent: "Price", nodeId: "116" },
        { label: "Low", parent: "Price", nodeId: "117" },
        { label: "Close", parent: "Price", nodeId: "118" },
        { label: "Previous High", parent: "Price", nodeId: "119" },
        { label: "Previous Low", parent: "Price", nodeId: "120" },
        { label: "Low Time", parent: "Price", nodeId: "121" },
        { label: "High Time", parent: "Price", nodeId: "122" },
      ],
    },
    {
      label: "Account",
      nodeId: "123",
      children: [
        { label: "Login", parent: "Account", nodeId: "124" },
        { label: "Symbol Group", parent: "Account", nodeId: "125" },
        { label: "Name", parent: "Account", nodeId: "126" },
        { label: "Broker", parent: "Account", nodeId: "127" },
        { label: "Subbroker", parent: "Account", nodeId: "128" },
        { label: "Extra Group", parent: "Account", nodeId: "129" },
        { label: "Subbroker PL Ratio", parent: "Account", nodeId: "130" },
        { label: "Broker PL Ratio", parent: "Account", nodeId: "131" },
        { label: "Company PL Ratio", parent: "Account", nodeId: "132" },
        { label: "Brokarage Type", parent: "Account", nodeId: "133" },
        { label: "Client Brokage", parent: "Account", nodeId: "134" },
        { label: "Subbroker Brokage", parent: "Account", nodeId: "135" },
        { label: "Broker Brokage", parent: "Account", nodeId: "136" },
        { label: "Comapny Brokage", parent: "Account", nodeId: "137" },
        { label: "Symbol Wise Buy Limit", parent: "Account", nodeId: "138" },
        { label: "Symbol Wise Sell Limit", parent: "Account", nodeId: "139" },
        {
          label: "Symbol Wise Pending Order Enable/Disable",
          parent: "Account",
          nodeId: "140",
        },
        { label: "Symbol Position Limit", parent: "Account", nodeId: "141" },
        {
          label: "Symbol Pending Order Diff From Bid/Ask",
          parent: "Account",
          nodeId: "142",
        },
        { label: "Loss Limit", parent: "Account", nodeId: "143" },
        { label: "Credit Limit", parent: "Account", nodeId: "144" },
        { label: "Comment", parent: "Account", nodeId: "145" },
        { label: "Qty Limit Multiplayer", parent: "Account", nodeId: "146" },
        { label: "Ignore Trader", parent: "Account", nodeId: "147" },
        { label: "Colour", parent: "Account", nodeId: "148" },
      ],
    },
    {
      label: "Symbol",
      nodeId: "149",
      children: [
        { label: "Symbol", parent: "Symbol", nodeId: "150" },
        { label: "Closing Price", parent: "Symbol", nodeId: "151" },
        { label: "Multiplayer", parent: "Symbol", nodeId: "152" },
        { label: "Symbol Margin", parent: "Symbol", nodeId: "153" },
        { label: "Max Limit On Same Price", parent: "Symbol", nodeId: "154" },
        {
          label: "Symbol Pending Order Diff From Bid/Ask",
          parent: "Symbol",
          nodeId: "155",
        },
        { label: "LTP Mapping", parent: "Symbol", nodeId: "156" },
        { label: "Upper Circuit", parent: "Symbol", nodeId: "157" },
        { label: "Lower Cicruit", parent: "Symbol", nodeId: "158" },
        { label: "Exchange Symbol", parent: "Symbol", nodeId: "159" },
        { label: "Next Symbol", parent: "Symbol", nodeId: "160" },
        { label: "NSE Lot Size", parent: "Symbol", nodeId: "161" },
        { label: "MT Lot Size", parent: "Symbol", nodeId: "162" },
        { label: "Max Allowed Volume", parent: "Symbol", nodeId: "163" },
        { label: "Allowed Limit Per Client", parent: "Symbol", nodeId: "164" },
        { label: "Symbol Position Limit", parent: "Symbol", nodeId: "165" },
        { label: "Symbol Group", parent: "Symbol", nodeId: "166" },
        { label: "Bin Size", parent: "Symbol", nodeId: "167" },
        { label: "Pocket Number", parent: "Symbol", nodeId: "168" },
      ],
    },
  ];

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isOrSelected = React.useRef<boolean>(false);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNodeSelect = (
    _event: React.SyntheticEvent<Element, Event>,
    nodeId: string
  ) => {
    conditionTypeData.forEach((data) => {
      if (data.nodeId === nodeId) return;
      data.children.forEach((childNode) => {
        if (childNode.nodeId === nodeId) {
          if (isOrSelected.current) {
            props.handleOrConditionTypeChange(
              data.label + " > " + childNode.label,
              props.selectedAndConditionIndex,
              props.selectedOrConditionIndex
            );
          } else {
            props.handleAndConditionTypeChange(
              data.label + " > " + childNode.label,
              props.selectedAndConditionIndex
            );
          }
        }
      });
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
        <CreateConditionTableHeader />
        <Box
          sx={{
            maxHeight: "375px",
            overflow: "scroll",
            scrollbarWidth: "none", // For Firefox
            "&::-webkit-scrollbar": {
              display: "none", // For Chrome, Safari, and Opera
            },
          }}
        >
          {props.conditions.map((condition, andConditionIndex) => {
            return (
              <Box>
                <Box
                  display="grid"
                  gridTemplateColumns="repeat(12, 1fr)"
                  gap={2}
                  sx={{
                    paddingTop: 0.5,
                    paddingBottom: 0.5,
                    border:
                      props.selectedAndConditionIndex === andConditionIndex
                        ? "primary"
                        : "#1D222F",
                    borderStyle: "solid",
                    borderWidth: "1px",
                  }}
                  onClick={() => {
                    if (open) return;
                    isOrSelected.current = false;
                    props.setSelectedAndConditionIndex(andConditionIndex);
                  }}
                >
                  <Box gridColumn="span 5">
                    <Box
                      display={"flex"}
                      flexDirection={"row"}
                      alignItems={"center"}
                    >
                      <DragIndicator
                        sx={{ color: "#6A7187", ml: 1, fontSize: 30 }}
                      />
                      <TextField
                        variant="standard"
                        SelectProps={{
                          MenuProps: {
                            sx: {
                              width: "100%",
                            },
                          },
                          IconComponent: () => (
                            <IconButton sx={{ padding: 0.5 }}>
                              <KeyboardArrowDown />
                            </IconButton>
                          ),
                        }}
                        value={condition.conditionType}
                        onClick={handleClick}
                        sx={{
                          width: "100%",
                          backgroundColor: "#0A0A0A",
                          border: "transparent",
                          ml: 3,
                        }}
                        InputLabelProps={{ shrink: false }}
                        InputProps={{
                          readOnly: true,
                          disableUnderline: true,
                          style: {
                            direction: "ltr",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          },
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton>
                                <KeyboardArrowDown />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        inputProps={{
                          placeholder: "Select",
                          style: { height: "35px", padding: 0 },
                        }}
                      ></TextField>
                      <DropDownMenu
                        dropdownOptions={conditionTypeData}
                        anchorEl={anchorEl}
                        handleClose={handleClose}
                        value={condition.conditionType}
                        handleNodeSelect={handleNodeSelect}
                        open={open}
                        isTrigger={false}
                      ></DropDownMenu>
                    </Box>
                  </Box>
                  <Box gridColumn="span 3">
                    <TextField
                      variant="standard"
                      margin="none"
                      label={condition.compareCondition === "" ? "Select" : ""}
                      select
                      value={condition.compareCondition}
                      sx={{
                        width: "100%",
                        backgroundColor: "#0A0A0A",
                        border: "transparent",
                      }}
                      InputLabelProps={{
                        shrink: false,
                        style: { top: "-12px", color: "grey" },
                      }}
                      SelectProps={{
                        MenuProps: {
                          sx: {
                            width: "100%",
                          },
                        },
                        IconComponent: () => (
                          <IconButton sx={{ padding: 0.5 }}>
                            <KeyboardArrowDown />
                          </IconButton>
                        ),
                      }}
                      onChange={(
                        event: React.ChangeEvent<
                          HTMLInputElement | HTMLTextAreaElement
                        >
                      ) => {
                        props.handleAndCompareConditionChange(
                          event,
                          andConditionIndex
                        );
                      }}
                      InputProps={{
                        disableUnderline: true,
                        style: {
                          direction: "ltr",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          marginTop: "0",
                        },
                      }}
                      inputProps={{
                        placeholder: "Select",
                        style: { height: "35px", padding: 0 },
                      }}
                    >
                      {compareConditionsList.map((singleCompareCondition) => (
                        <MenuItem
                          key={singleCompareCondition.conditionName}
                          value={singleCompareCondition.conditionName}
                        >
                          {singleCompareCondition.conditionName}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                  <Box gridColumn="span 3">
                    <TextField
                      variant="standard"
                      value={condition.conditionValue}
                      onChange={(
                        event: React.ChangeEvent<
                          HTMLInputElement | HTMLTextAreaElement
                        >
                      ) => {
                        props.handleAndConditionValueChange(
                          event,
                          andConditionIndex
                        );
                      }}
                      sx={{
                        width: "100%",
                        backgroundColor: "#0A0A0A",
                        border: "transparent",
                      }}
                      InputLabelProps={{ shrink: false }}
                      InputProps={{
                        disableUnderline: true,
                        style: {
                          direction: "ltr",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        },
                      }}
                      inputProps={{
                        placeholder: "Select",
                        style: { height: "35px", padding: 0 },
                      }}
                    ></TextField>
                  </Box>
                  <Box gridColumn="span 1">
                    <DeleteOutline
                      sx={{ mt: 0.5, cursor: "pointer" }}
                      onClick={() =>
                        props.handleDeleteAndCondition(andConditionIndex)
                      }
                    />
                  </Box>
                </Box>
                {/* Display OR data */}
                {condition.orCondition &&
                  condition.orCondition.map(
                    (singleOrCondition, orConditionIndex) => (
                      <Box
                        display="grid"
                        gridTemplateColumns="repeat(12, 1fr)"
                        onClick={() => {
                          if(open) return;
                          isOrSelected.current = true;
                          props.setSelectedOrConditionIndex(orConditionIndex);
                        }}
                        gap={2}
                        sx={{
                          paddingTop: 0.5,
                          paddingBottom: 0.5,
                          border: "#1D222F",
                          borderStyle: "solid",
                          borderWidth: "1px",
                        }}
                      >
                        <Box gridColumn="span 5">
                          <Box
                            display={"flex"}
                            flexDirection={"row"}
                            alignItems={"center"}
                          >
                            <Box sx={{ fontSize: 20, ml: 3 }}>
                              <OrIndicator />
                            </Box>
                            <Divider
                              orientation="vertical"
                              flexItem
                              sx={{
                                borderStyle: "solid",
                                borderWidth: "1px",
                                borderColor: "#2B3348",
                              }}
                            />
                            <TextField
                              variant="standard"
                              onClick={handleClick}
                              value={singleOrCondition.orConditionType}
                              sx={{
                                width: "100%",
                                backgroundColor: "#0A0A0A",
                                border: "transparent",
                                ml: 3,
                              }}
                              InputLabelProps={{ shrink: false }}
                              InputProps={{
                                readOnly: true,
                                disableUnderline: true,
                                style: {
                                  direction: "ltr",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                },
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton>
                                      <KeyboardArrowDown />
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                              inputProps={{
                                placeholder: "Select",
                                style: { height: "35px", padding: 0 },
                              }}
                            ></TextField>
                            <DropDownMenu
                              dropdownOptions={conditionTypeData}
                              anchorEl={anchorEl}
                              handleClose={handleClose}
                              value={condition.conditionType}
                              handleNodeSelect={handleNodeSelect}
                              open={open}
                              isTrigger={false}
                            ></DropDownMenu>
                          </Box>
                        </Box>
                        <Box gridColumn="span 3">
                          <TextField
                            variant="standard"
                            margin="none"
                            label={
                              singleOrCondition.orCompareCondition === ""
                                ? "Select"
                                : ""
                            }
                            select
                            value={singleOrCondition.orCompareCondition}
                            onChange={(
                              event: React.ChangeEvent<
                                HTMLInputElement | HTMLTextAreaElement
                              >
                            ) => {
                              props.handleOrCompareConditionChange(
                                event,
                                andConditionIndex,
                                orConditionIndex
                              );
                            }}
                            sx={{
                              width: "100%",
                              backgroundColor: "#0A0A0A",
                              border: "transparent",
                            }}
                            InputLabelProps={{
                              shrink: false,
                              style: { top: "-12px", color: "grey" },
                            }}
                            SelectProps={{
                              MenuProps: {
                                sx: {
                                  width: "100%",
                                },
                              },
                              IconComponent: () => (
                                <IconButton sx={{ padding: 0.5 }}>
                                  <KeyboardArrowDown />
                                </IconButton>
                              ),
                            }}
                            InputProps={{
                              disableUnderline: true,
                              style: {
                                direction: "ltr",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                marginTop: 0,
                              },
                            }}
                            inputProps={{
                              placeholder: "Select",
                              style: { height: "35px", padding: 0 },
                            }}
                          >
                            {compareConditionsList.map(
                              (singleCompareCondition) => (
                                <MenuItem
                                  key={singleCompareCondition.conditionName}
                                  value={singleCompareCondition.conditionName}
                                >
                                  {singleCompareCondition.conditionName}
                                </MenuItem>
                              )
                            )}
                          </TextField>
                        </Box>
                        <Box gridColumn="span 3">
                          <TextField
                            variant="standard"
                            value={singleOrCondition.orConditionValue}
                            sx={{
                              width: "100%",
                              backgroundColor: "#0A0A0A",
                              border: "transparent",
                            }}
                            onChange={(
                              event: React.ChangeEvent<
                                HTMLInputElement | HTMLTextAreaElement
                              >
                            ) => {
                              props.handleOrConditionvalueChange(
                                event,
                                andConditionIndex,
                                orConditionIndex
                              );
                            }}
                            InputLabelProps={{ shrink: false }}
                            InputProps={{
                              disableUnderline: true,
                              style: {
                                direction: "ltr",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              },
                            }}
                            inputProps={{
                              placeholder: "Select",
                              style: { height: "35px", padding: 0 },
                            }}
                          ></TextField>
                        </Box>
                        <Box gridColumn="span 1">
                          <DeleteOutline
                            sx={{ mt: 0.5, cursor: "pointer" }}
                            onClick={() =>
                              props.handleDeleteOrCondition(orConditionIndex)
                            }
                          />
                        </Box>
                      </Box>
                    )
                  )}
              </Box>
            );
          })}
        </Box>
        <Button
          variant="contained"
          sx={{ m: 2, fontFamily: "Inter", textTransform: "none", width: 170 }}
          onClick={() => {
            props.handleAddAndCondition();
          }}
        >
          Add 'AND' condition
        </Button>
        <Button
          variant="outlined"
          tabIndex={9}
          onClick={() => {
            props.handleAddOrCondition();
          }}
          sx={{
            fontFamily: "Inter",
            textTransform: "none",
            color: "white",
            borderColor: "#2B3348",
            width: 170,
            ":hover": {
              borderColor: "#2B3348",
            },
          }}
        >
          Add 'OR' condition
        </Button>
      </Box>
    </>
  );
};

export default React.memo(CreateCondition);
