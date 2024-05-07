import React, { ReactElement, useEffect } from "react";
import { DealingPanelChartComponentProps } from "./DealingPanelChartComponent";
import Loader from "../../common/loader/Loader";

const DealingPanelChartComponent = React.lazy(() => import("./DealingPanelChartComponent"));

const DealingPanelChartWrapper  = React.forwardRef(
    (props: DealingPanelChartComponentProps, ref): ReactElement => {
    return (
        <React.Suspense fallback={<Loader size={20}/>}>
            <DealingPanelChartComponent {...props} ref={ref}/>
        </React.Suspense>
    )
})

export default React.memo(DealingPanelChartWrapper);