import { Divider } from "@mui/material";

export const HorizontalDivider = () => {
  return (
    <Divider sx={{ height: "1px" }} color="#2B3348" orientation="horizontal" />
  );
};
export const VerticalDivider = ({width = '1px'}) => {
  return (
    <Divider sx={{ width: width }} color="#2B3348" orientation="vertical" />
  );
};
