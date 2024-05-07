import React, { ReactElement, useEffect } from "react";
import { DealingPanelSpreadSheetComponentProps } from "./DealingPanelSpreadSheetComponent";
import Loader from "../../common/loader/Loader";

const DealingPanelSpreadSheetComponent = React.lazy(() => import("./DealingPanelSpreadSheetComponent"));

const DealingPanelSpreadSheetWrapper  = React.forwardRef(
    (props: DealingPanelSpreadSheetComponentProps, ref): ReactElement => {
    return (
        <React.Suspense fallback={<Loader size={20}/>}>
            <DealingPanelSpreadSheetComponent {...props} ref={ref}/>
        </React.Suspense>
    )
})

export default React.memo(DealingPanelSpreadSheetWrapper);