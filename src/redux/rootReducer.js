import { combineReducers } from "@reduxjs/toolkit";

import brandReducer from "./slices/brandSlice";
import complianceContactReducer from "./slices/complianceContactSlice";
import complianceItemsReducer from "./slices/complianceItemsSlice";
import complianceRulesReducer from "./slices/complianceRulesSlice";
import currentOrderReducer from "./slices/currentOrderSlice";
import distributorReducer from "./slices/distributorSlice";
import filterReducer from "./slices/filterSlice";
import itemReducer from "./slices/itemSlice";
import orderHistoryReducer from "./slices/orderHistorySlice";
import orderSetHistoryReducer from "./slices/orderSetHistorySlice";
import orderSetReducer from "./slices/orderSetSlice";
import patchOrderReducer from "./slices/patchOrderSlice";
import preOrderDetailReducer from "./slices/preOrderDetailSlice";
import programsReducer from "./slices/programsSlice";
import purchaseOrderReducer from "./slices/purchaseOrderSlice";
import purchaseOrderHistoryReducer from "./slices/purchaseOrderHistorySlice";
import rfqReducer from "./slices/rfqSlice";
import rfqHistoryReducer from "./slices/rfqHistorySlice";
import tagReducer from "./slices/tagSlice";
import territoryReducer from "./slices/territorySlice";
import userReducer from "./slices/userSlice";

const rootReducer = combineReducers({
  brands: brandReducer,
  complianceContacts: complianceContactReducer,
  complianceItems: complianceItemsReducer,
  complianceRules: complianceRulesReducer,
  currentOrder: currentOrderReducer,
  distributors: distributorReducer,
  filters: filterReducer,
  items: itemReducer,
  orderHistory: orderHistoryReducer,
  orderSet: orderSetReducer,
  orderSetHistory: orderSetHistoryReducer,
  patchOrder: patchOrderReducer,
  preOrderDetails: preOrderDetailReducer,
  programs: programsReducer,
  purchaseOrder: purchaseOrderReducer,
  purchaseOrderHistory: purchaseOrderHistoryReducer,
  rfq: rfqReducer,
  rfqHistory: rfqHistoryReducer,
  tags: tagReducer,
  territories: territoryReducer,
  user: userReducer,
});

export default rootReducer;
