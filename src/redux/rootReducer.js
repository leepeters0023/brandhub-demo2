import { combineReducers } from "@reduxjs/toolkit";

import addressReducer from "./slices/addressSlice";
import itemApprovedOrDenied from "./slices/approveOrDenyItemSlice";
import brandReducer from "./slices/brandSlice";
import businessUnitReducer from "./slices/businessUnitSlice";
import complianceContactReducer from "./slices/complianceContactSlice";
import complianceItemsReducer from "./slices/complianceItemsSlice";
import complianceRulesReducer from "./slices/complianceRulesSlice";
import couponReducer from "./slices/couponSlice";
import currentOrderReducer from "./slices/currentOrderSlice";
import distributorReducer from "./slices/distributorSlice";
import errorReducer from "./slices/errorSlice";
import filterReducer from "./slices/filterSlice";
import itemReducer from "./slices/itemSlice";
import itemTypeReducer from "./slices/itemTypeSlice";
import newProgramReducer from "./slices/newProgramSlice";
import orderHistoryReducer from "./slices/orderHistorySlice";
import orderSetHistoryReducer from "./slices/orderSetHistorySlice";
import orderSetReducer from "./slices/orderSetSlice";
import patchOrderReducer from "./slices/patchOrderSlice";
import preOrderDetailReducer from "./slices/preOrderDetailSlice";
import programsReducer from "./slices/programsSlice";
import purchaseOrderReducer from "./slices/purchaseOrderSlice";
import purchaseOrderHistoryReducer from "./slices/purchaseOrderHistorySlice";
import reportReducer from "./slices/reportSlice";
import rfqReducer from "./slices/rfqSlice";
import rfqHistoryReducer from "./slices/rfqHistorySlice";
import sharedItemsReducer from "./slices/sharedItemsSlice";
import supplierReducer from "./slices/supplierSlice";
import territoryReducer from "./slices/territorySlice";
import trackingReducer from "./slices/trackingSlice";
import userReducer from "./slices/userSlice";
import userUpdateReducer from "./slices/userUpdateSlice";

const rootReducer = combineReducers({
  addresses: addressReducer,
  brands: brandReducer,
  businessUnits: businessUnitReducer,
  complianceContacts: complianceContactReducer,
  complianceItems: complianceItemsReducer,
  complianceRules: complianceRulesReducer,
  coupons: couponReducer,
  currentOrder: currentOrderReducer,
  distributors: distributorReducer,
  error: errorReducer,
  filters: filterReducer,
  itemApprovedOrDenied: itemApprovedOrDenied, 
  items: itemReducer,
  itemTypes: itemTypeReducer,
  newProgram: newProgramReducer,
  orderHistory: orderHistoryReducer,
  orderSet: orderSetReducer,
  orderSetHistory: orderSetHistoryReducer,
  patchOrder: patchOrderReducer,
  preOrderDetails: preOrderDetailReducer,
  programs: programsReducer,
  purchaseOrder: purchaseOrderReducer,
  purchaseOrderHistory: purchaseOrderHistoryReducer,
  reports: reportReducer,
  rfq: rfqReducer,
  rfqHistory: rfqHistoryReducer,
  sharedItems: sharedItemsReducer,
  suppliers: supplierReducer,
  territories: territoryReducer,
  tracking: trackingReducer,
  user: userReducer,
  userUpdate: userUpdateReducer,
});

export default rootReducer;
