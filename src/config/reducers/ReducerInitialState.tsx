import { themes } from "../../data/colorTemplate";
// import { getInitialStateForGlobalFilters } from "../../ui/canvas/CanvasContainer";
import { linkColors } from "../../ui/components/common/widget-link/WidgetLink";

export default {
  app: {
    headerTabs: [],
    selectedTab: undefined,
    datasources: undefined,
    websocketStatus: undefined,
    tdhModalState: false,
    symbolMarginModalState: false,
    highLowMisMatchModalState: false,
    customizeWidgetModalState: false,
    addPageModalState: false,
    message: {
      type: "info",
      text: "",
    },
    clientList: [],
    symbolList: [],
    highLowMisMatchData: [],
    systemLogs: [],
    isColorOn: true,
    openColorTemplateState: false,
    templates: [],
    themes: [],
    selectedTheme: themes[0],
  },
  canvas: {
    activeTabSet: undefined,
    // filters: getInitialStateForGlobalFilters(),
    filterColor: linkColors[0],
    canvasModel: null,
  },
  page: {
    activePageId: null,
    isPageUnsaved: false,
    pages: [],
  },
  users: {
    users: [],
    user: null,
  },
  saturdayDelete:{
    groupData:[],
    balanceTransferStatus:null,
    positionTransferStatus:null,
    tradeDelete:{
      messages:[],
      status:"match",
      deleteDataStatus:null
    }
  },
  setting:{
    mappingData : [],
    closingUpdate:{
      data:[],
      message:""
    },
    loginSettingsModalState:{
      open:false,
      loginValue:"",
      rejectLimitSettings:[],
      symbolGroups:[]
    },
  }
};