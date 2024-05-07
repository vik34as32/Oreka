import React, { ReactElement } from "react";
import { ChartComponentProps } from "./ChartComponent";
import Loader from "../../common/loader/Loader";

const ChartComponent = React.lazy(() => import("./ChartComponent"));

const ChartWrapper  = React.forwardRef(
    (props: ChartComponentProps, ref): ReactElement => {

    return (
        <React.Suspense fallback={<Loader size={20}/>}>
            <ChartComponent {...props} ref={ref}/>
        </React.Suspense>
    )
})

export default React.memo(ChartWrapper);