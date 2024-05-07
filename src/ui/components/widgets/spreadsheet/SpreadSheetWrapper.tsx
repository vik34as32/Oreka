import React, { ReactElement } from "react";
import { SpreadSheetComponentProps } from "./SpreadSheetComponent";
import Loader from "../../common/loader/Loader";

const SpreadSheetComponent = React.lazy(() => import("./SpreadSheetComponent"));

const SpreadSheetWrapper  = React.forwardRef(
    (props: SpreadSheetComponentProps, ref): ReactElement => {

    return (
        <React.Suspense fallback={<Loader size={20}/>}>
            <SpreadSheetComponent {...props} ref={ref}/>
        </React.Suspense>
    )
})

export default React.memo(SpreadSheetWrapper);