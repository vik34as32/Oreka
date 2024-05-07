import React, { useEffect } from "react";
import CustomMultiSelectionDropDown from "./CustomMultiSelectionDropDown";
import { Box, InputLabel, SelectChangeEvent, Typography } from "@mui/material";
import DropDownWithTreeOption from "./DropDownWithTreeOption";
import CustomDateTimePicker from "./CustomDateTimePicker";
import CustomInputNumber from "./CustomInputNumber";
import CustomInputLabel from "./CustomInputLabel";

type CreateTriggerProps = {
  triggerType: string;
  setTriggerType: React.Dispatch<React.SetStateAction<string>>;
  startTime: string;
  setStartTime: React.Dispatch<React.SetStateAction<string>>;
  expiryTime: string;
  setExpiryTime: React.Dispatch<React.SetStateAction<string>>;
  noExpiry: boolean;
  setNoExpiry: React.Dispatch<React.SetStateAction<boolean>>;
  daysOfWeek: string[];
  setDaysOfWeek: React.Dispatch<React.SetStateAction<string[]>>;
  selectedMonths: string[];
  setSelectedMonths: React.Dispatch<React.SetStateAction<string[]>>;
  daysOfMonth: string[];
  setDaysOfMonth: React.Dispatch<React.SetStateAction<string[]>>;
  repetitions: number;
  setRepetitions: React.Dispatch<React.SetStateAction<number>>;
  days: number;
  setDays: React.Dispatch<React.SetStateAction<number>>;
  hours: number;
  setHours: React.Dispatch<React.SetStateAction<number>>;
  minutes: number;
  setMinutes: React.Dispatch<React.SetStateAction<number>>;
};

const CreateTrigger = (props: CreateTriggerProps) => {
  const triggerTypeData = [
    {
      label: "Connection",
      nodeId: "1",
      children: [
        { label: "Account Login", parent: "Connection", nodeId: "2" },
        { label: "Account Logout", parent: "Connection", nodeId: "3" },
      ],
    },
    {
      label: "Dealing Table",
      nodeId: "4",
      children: [
        { label: "User Login", parent: "Dealing Table", nodeId: "5" },
        {
          label: "Trade or Order Placement",
          parent: "Dealing Table",
          nodeId: "6",
        },
        { label: "Stop Order Placement", parent: "Dealing Table", nodeId: "7" },
        {
          label: "Limit Order Placement",
          parent: "Dealing Table",
          nodeId: "8",
        },
        {
          label: "Stop Order Activation",
          parent: "Dealing Table",
          nodeId: "9",
        },
        {
          label: "Limit Order Activation",
          parent: "Dealing Table",
          nodeId: "10",
        },
        { label: "Trade Volume Update", parent: "Dealing Table", nodeId: "11" },
      ],
    },
    {
      label: "Order",
      className: "parent-node",
      nodeId: "12",
      children: [
        { label: "Order Volume Update", parent: "Order", nodeId: "13" },
        { label: "Order Status Update", parent: "Order", nodeId: "14" },
      ],
    },
    {
      label: "Client Position Table",
      nodeId: "15",
      children: [
        {
          label: "Position Volume Update",
          parent: "Client Position Table",
          nodeId: "16",
        },
        {
          label: "Floating P&L Update",
          parent: "Client Position Table",
          nodeId: "17",
        },
        {
          label: "Account Balance Update",
          parent: "Client Position Table",
          nodeId: "18",
        },
        {
          label: "Brokerage Fee Update",
          parent: "Client Position Table",
          nodeId: "19",
        },
        { label: "P&L Update", parent: "Client Position Table", nodeId: "20" },
        {
          label: "Other Details Update",
          parent: "Client Position Table",
          nodeId: "21",
        },
      ],
    },
    {
      label: "Gateway",
      nodeId: "22",
      children: [
        {
          label: "Order Modification Rejection",
          parent: "Gateway",
          nodeId: "23",
        },
        { label: "Order Deletion Rejection", parent: "Gateway", nodeId: "24" },
      ],
    },
    {
      label: "Schedule",
      nodeId: "25",
      children: [
        { label: "Recurring Event", parent: "Schedule", nodeId: "26" },
      ],
    },
  ];

  const dayNamesList: string[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const monthNamesList: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const daysOfMonthNamesList: string[] = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "30",
    "31",
  ];

  useEffect(() => {
    props.setDaysOfWeek(dayNamesList);
    props.setDaysOfMonth(daysOfMonthNamesList);
    props.setSelectedMonths(monthNamesList);
  }, [])

  const isAllDayOfWeekSelected = props.daysOfWeek.length === dayNamesList.length;
  const isAllDayOfMonthSelected = props.daysOfMonth.length === daysOfMonthNamesList.length;
  const isAllMonthSelected = props.selectedMonths.length === monthNamesList.length;

  const handleNodeSelect = (
    _event: React.SyntheticEvent<Element, Event>,
    nodeId: string
  ) => {
    triggerTypeData.forEach((data) => {
      if (data.nodeId === nodeId) return;
      data.children.forEach((childNode) => {
        if (childNode.nodeId === nodeId) {
          props.setTriggerType(data.label + " > " + childNode.label);
        }
      });
    });
  };

  const handleChangeDaysOfWeek = (
    event: SelectChangeEvent<typeof props.daysOfWeek>
  ) => {
    const value = event.target.value;
    if (value[value.length - 1] === "All") {
      props.setDaysOfWeek(props.setDaysOfWeek.length === dayNamesList.length ? [] : dayNamesList);
      return;
    }
    props.setDaysOfWeek(value as string[]);
  };

  const handleChangeMonths = (
    event: SelectChangeEvent<typeof props.selectedMonths>
  ) => {
    const value = event.target.value;
    if (value[value.length - 1] === "All") {
      props.setSelectedMonths(props.setSelectedMonths.length === monthNamesList.length ? [] : monthNamesList);
      return;
    }
    props.setSelectedMonths(value as string[]);
  };

  const handleChangeDaysOfMonth = (
    event: SelectChangeEvent<typeof props.daysOfMonth>
  ) => {
    const value = event.target.value;
    if (value[value.length - 1] === "All") {
      props.setDaysOfMonth(props.setDaysOfMonth.length === daysOfMonthNamesList.length ? [] : daysOfMonthNamesList);
      return;
    }
    props.setDaysOfMonth(value as string[]);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Box sx={{ width: "50%", mr: 2 }}>
        <Typography
          sx={{
            mt: 2,
            mb: 1,
            fontSize: 14,
            fontFamily: "Inter",
            fontWeight: 500,
          }}
        >
          Primary Details
        </Typography>
        <CustomInputLabel label="Trigger" />
        <DropDownWithTreeOption
          dropdownOptions={triggerTypeData}
          handleNodeSelect={handleNodeSelect}
          value={props.triggerType}
          isTrigger={true}
        />
        <Box display={"flex"} gap={2}>
          <Box>
            <CustomInputLabel label="Start" />
            <CustomDateTimePicker
              dateTimeValue={props.startTime}
              setDateTimeValue={props.setStartTime}
              isExpiry={false}
            />
          </Box>
          <Box>
            <CustomInputLabel label="Expiry" />
            <CustomDateTimePicker
              dateTimeValue={props.expiryTime}
              setDateTimeValue={props.setExpiryTime}
              isExpiry={true}
              noExpiry={props.noExpiry}
              setNoExpiry={props.setNoExpiry}
            />
          </Box>
        </Box>
        <Typography
          sx={{
            mt: 2,
            mb: 1,
            fontSize: 14,
            fontFamily: "Inter",
            fontWeight: 500,
          }}
        >
          Service
        </Typography>
        <CustomInputLabel label="Repetitions" />
        <CustomInputNumber
          value={props.repetitions}
          setValue={props.setRepetitions}
        />
        <Box display={"flex"} gap={2}>
          <Box>
            <CustomInputLabel label="Days" />
            <CustomInputNumber value={props.days} setValue={props.setDays} />
          </Box>
          <Box>
            <CustomInputLabel label="Hours" />
            <CustomInputNumber value={props.hours} setValue={props.setHours} />
          </Box>
        </Box>
        <CustomInputLabel label="Minutes" />
        <CustomInputNumber
          value={props.minutes}
          setValue={props.setMinutes}
          isMinutes={true}
        />
      </Box>
      <Box sx={{ width: "50%" }}>
        <Typography
          sx={{
            mt: 2,
            fontSize: 14,
            fontFamily: "Inter",
            fontWeight: 500,
            mb: 1,
          }}
        >
          Qualifiers
        </Typography>
        <CustomInputLabel label="Days of week" />
        <CustomMultiSelectionDropDown
          optionsList={dayNamesList}
          valuesList={props.daysOfWeek}
          handleChange={handleChangeDaysOfWeek}
          isAllSelected={isAllDayOfWeekSelected}
        />
        <CustomInputLabel label="Months" />
        <CustomMultiSelectionDropDown
          optionsList={monthNamesList}
          valuesList={props.selectedMonths}
          handleChange={handleChangeMonths}
          isAllSelected={isAllMonthSelected}
        />
        <CustomInputLabel label="Days of month" />
        <CustomMultiSelectionDropDown
          optionsList={daysOfMonthNamesList}
          valuesList={props.daysOfMonth}
          handleChange={handleChangeDaysOfMonth}
          isAllSelected={isAllDayOfMonthSelected}
        />
      </Box>
    </Box>
  );
};

export default React.memo(CreateTrigger);
