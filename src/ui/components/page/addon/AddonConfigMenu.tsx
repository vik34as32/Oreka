import { Box, Button, Grid } from "@mui/material";
import React, { FC, ReactElement, useRef, useState } from "react";
import { dataSources } from "../../../../redux/reducers/canvas/CanvasReducer";
import {
WidgetPropsType,
} from "../../../canvas/services/WidgetService";
import Loader from "../../common/loader/Loader";
// import WidgetConfig, {
// WidgetConfigsType,
// } from "../../custom-widget/WidgetConfig";
import SpreadSheetWrapper from "../../widgets/spreadsheet/SpreadSheetWrapper";
import FormulaEditModal from "./FormulaEditModal";
import FormulaModal from "./FormulaModal";

const ADDON_BACKEND_URL = import.meta.env.VITE_ADDON_BACKEND_URL;
type AddonConfigMenuProps = {};

const initalState = {
  id: "untitiled",
  componentType: "grid",
  dataSourceId: dataSources[0].id,
  filterBy: [],
  functionCols: [],
  groupBy: [],
  name: "test",
  splitBy: [],
  visibleCols: [],
  pivot: false,
  chartType: "",
  filterColor: { color: "gray", type: "unlink" },
  orderBy: [],
};
const AddonConfigMenu: FC<AddonConfigMenuProps> = (props): ReactElement => {
  const [formulaModalOpen, setFormulaModalOpen] = useState<boolean>(false);
  const [formula, setFormula] = useState<string>("");
  const [openEditFormulaModal,setOpenEditFormulaModal] = useState<boolean>(false);

  // usePat
  const widgetConfigRef = useRef(null);
  const [widgetConfigs, setWidgetConfigs] = useState<
    undefined
  >(undefined);
  const [widgetPropsType, setWidgetPropsType] = useState<
   undefined
  >(undefined);

  const handleSubmit = async () => {
    console.log("widgetConfigs: ", widgetConfigs);

    const data = {
      configs: widgetConfigs,
    };
    const res = await fetch(`${ADDON_BACKEND_URL}/configs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    const { formula } = result;
    setFormula(formula);
    setFormulaModalOpen(true);
  };
  const handleFormulaModalClose = () => {
    setFormula("");
    setFormulaModalOpen(false);
  };
  return (
    <React.Suspense fallback={<Loader size={20} />}>
      <Grid container spacing={1}>
        <Grid item xs={5}>
          <WidgetConfig
            ref={widgetConfigRef}
            componentType={"sheet"}
            widgetPropsType={widgetPropsType}
          />
        </Grid>
        <Grid item xs={7} maxHeight={625}>
          <SpreadSheetWrapper {...widgetConfigs} />
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ float: "right" }}>
            <Button
              variant="outlined"
              sx={{ color: "white", mr: 1 }}
              onClick={() => setOpenEditFormulaModal(true)}
            >
              Edit Formula
            </Button>
            <Button
              variant="outlined"
              sx={{ color: "white", mr: 1 }}
              onClick={() => {
                if (widgetConfigRef.current) {
                  setWidgetConfigs(widgetConfigRef.current.getWidgetConfigs());
                }
              }}
            >
              Apply Changes
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        </Grid>
      </Grid>
      <FormulaModal
        open={formulaModalOpen}
        onClose={handleFormulaModalClose}
        formula={formula}
      />
      <FormulaEditModal
        setConfigs={(configs:undefined) => {
          console.log("configs: ",configs);
          setWidgetConfigs({...widgetConfigs,...configs});
          const newWidgetProps = {
            ...widgetPropsType,
            ...configs
          }
          setWidgetPropsType(newWidgetProps);
        }}
        open={openEditFormulaModal}
        onClose={() => setOpenEditFormulaModal(false)}
      />
    </React.Suspense>
  );
};

export default React.memo(AddonConfigMenu);
