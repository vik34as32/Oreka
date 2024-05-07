// import CloseIcon from "@mui/icons-material/Close";
// import {
// Backdrop,
// Box,
// Button,
// Dialog,
// DialogActions,
// DialogContent,
// DialogTitle,
// IconButton,
// Typography,
// } from "@mui/material";
// import { useCallback, useEffect, useRef, useState } from "react";
// import { connect } from "react-redux";
// import { Dispatch } from "redux";
// import {
// balanceTransferRequest,
// resetBalanceTransferStatus,
// } from "../../../redux/action-handlers/app/SaturdayDeleteActions";
// import { getGroupsFromItemStates } from "../../../utilities/SettingUtilities";
// import { Item } from "../common/checkbox-tree-group/CheckBoxList";
// import { ItemState } from "../common/checkbox-tree/CheckBoxTree";
// import GroupSelect, {
// GroupSelectHandles,
// } from "../common/group-select/GroupSelect";
// import CircularProgressBar from "../common/progress-bar/CicularProgressBar";

// type TransferCreditProps = {
//   open: boolean;
//   handleClose: () => void;
//   balanceTransferRequest: (groups: string[]) => void;
//   balanceTransferStatus: { transfered: number; pending: number };
//   resetBalanceTransferStatus: () => void;
// };


// const TransferCredit = (props: TransferCreditProps) => {
//   const groupSelectRef = useRef<GroupSelectHandles | undefined>(undefined);
//   const [balanceTransferStart, setBalanceTransferStart] =
//     useState<boolean>(false);
//   const [balanceTransferCompleted,setBalanceTransferCompleted] = useState<boolean>(false);

//   useEffect(() => {
//     if(props.open) {
//       setBalanceTransferStart(false);
//       setBalanceTransferCompleted(false);
//     }
//   },[props.open]);

//   const balanceTransfer = useCallback(() => {
//     setBalanceTransferStart(true);
//     sendBalanceTransferRequest();
//   }, []);

//   // const handleBack = () => {
//   //   if (!stepperRef.current) return;
//   //   if (activeStep > 0) setActiveStep(activeStep - 1);
//   //   stepperRef.current.prev();
//   // };
//   // const handleNext = () => {
//   //   if (!stepperRef.current) return;
//   //   if (activeStep === 0) {
//   //     setBalanceTransferStart(true);
//   //   }
//   //   if (activeStep < steps.length) setActiveStep(activeStep + 1);
//   //   stepperRef.current.next();
//   // };
//   const handleDone = useCallback(() => {
//     props.handleClose();
//     props.resetBalanceTransferStatus();
//   },[]);

//   const sendBalanceTransferRequest = useCallback(() => {
//     if (!groupSelectRef.current) return;
//     const itemStates: ItemState[] = groupSelectRef.current.getItemStates();
//     const items: Item[] = groupSelectRef.current.getItems();
//     const groups = getGroupsFromItemStates(items, itemStates);
//     props.balanceTransferRequest(groups);
//   }, []);

//   return (
//     <Dialog
//       open={props.open}
//       fullWidth
//       PaperProps={{
//         sx: {
//           background: "#020305",
//           width: 420,
//           height: 500,
//         },
//       }}
//       maxWidth={false}
//       onClose={() => props.handleClose()}
//     >
//       <DialogTitle
//         style={{ display: "flex", justifyContent: "space-between", height: 40 }}
//         sx={{ pt: 1, pb: 1 }}
//       >
//         <Typography className="header-text">Transfer Credit</Typography>
//         <IconButton onClick={() => props.handleClose()}>
//           <CloseIcon fontSize="small" sx={{ color: "#6A7187" }} />
//         </IconButton>
//       </DialogTitle>
//       <DialogContent sx={{ mt: 2, p: 0 }}>
//         {/* <Stepper
//           activeStep={activeStep}
//           stepData={steps}
//           ref={(r) => (stepperRef.current = r)}
//         /> */}
//         <Box sx={{ p: 1 }}>
//           <GroupSelect ref={groupSelectRef} />
//           <Backdrop
//             sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
//             open={balanceTransferStart}
//           >
//             <CircularProgressBar
//               onComplete={() => {
//                 setBalanceTransferStart(false);
//                 setBalanceTransferCompleted(true);
//               }}
//               value={
//                 props.balanceTransferStatus
//                   ? (100 * props.balanceTransferStatus.transfered) /
//                     (props.balanceTransferStatus.pending +
//                       props.balanceTransferStatus.transfered)
//                   : 0
//               }
//             />
//           </Backdrop>
//         </Box>
//       </DialogContent>
//       <DialogActions>
//         {/* <Button
//           onClick={props.handleClose}
//           variant="outlined"
//           sx={{
//             borderColor: "#2B3349",
//             color: "white",
//             width: "125px",
//             textTransform: "none",
//           }}
//         >
//           Close
//         </Button> */}
//         <Button
//           onClick={balanceTransferCompleted ? handleDone : balanceTransfer}
//           variant="contained"
//           sx={{ textTransform: "none" }}
//         >
//           {balanceTransferCompleted ? "Close" :"Balance Transfer"}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// function mapStateToProps(state: any) {
//   return {
//     groupData: state.saturdayDelete.groupData,
//     balanceTransferStatus: state.saturdayDelete.balanceTransferStatus,
//   };
// }
// function mapDispatchToProps(dispatch: Dispatch) {
//   return {
//     balanceTransferRequest: (groups: string[]) =>
//       balanceTransferRequest(groups),
//     resetBalanceTransferStatus: () => dispatch(resetBalanceTransferStatus()),
//   };
// }

// export default connect(mapStateToProps, mapDispatchToProps)(TransferCredit);
