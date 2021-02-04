import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import format from "date-fns/format";

import { useSelector, useDispatch } from "react-redux";

import {
  updateMultipleFilters,
  updateSingleFilter,
  setChips,
  resetFilters,
  setSorted,
  setRetain,
  setFetchCurrent,
} from "../../redux/slices/filterSlice";

import {
  fetchFilteredOrderHistory,
  fetchFilteredOrderHistoryByItem,
} from "../../redux/slices/orderHistorySlice";
import {
  fetchFilteredOrderSets,
  fetchFilteredOrderSetItems,
} from "../../redux/slices/orderSetHistorySlice";
import { clearBrands } from "../../redux/slices/brandSlice";
import { fetchFilteredItems, clearItemSelection } from "../../redux/slices/itemSlice";
import { fetchFilteredRFQItems } from "../../redux/slices/rfqSlice";
import { fetchFilteredRFQHistory } from "../../redux/slices/rfqHistorySlice";
import { fetchFilteredPOItems } from "../../redux/slices/purchaseOrderSlice";
import { fetchFilteredPOHistory } from "../../redux/slices/purchaseOrderHistorySlice";
import { fetchFilteredRules } from "../../redux/slices/complianceRulesSlice";
import { fetchFilteredTriggeredRules } from "../../redux/slices/complianceItemsSlice";
import { fetchFilteredUsers } from "../../redux/slices/userUpdateSlice";

import { useDetailedInput } from "../../hooks/InputHooks";

import FiltersItems from "./FiltersItems";
import FiltersHistory from "./FiltersHistory";
import FiltersPrograms from "./FiltersPrograms";
import FiltersItemRollup from "./FiltersItemRollup";
import FiltersCompliance from "./FiltersCompliance";
import FiltersBudget from "./FiltersBudget";

import Drawer from "@material-ui/core/Drawer";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  drawer: {
    width: "300px",
    flexShrink: 0,
  },
  drawerPaper: {
    width: "300px",
    zIndex: "2001",
  },
  selectedButton: {
    fontWeight: "600",
    fontSize: "1rem",
    textAlign: "center",
    color: "#737373",
  },
}));

const FilterDrawer = ({ open, handleDrawerClose }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const filterType = useSelector((state) => state.filters.filterType);
  const setToClear = useSelector((state) => state.filters.clearFilters);
  const retainFilters = useSelector((state) => state.filters.retainFilters);
  const sorted = useSelector((state) => state.filters.sorted);
  const fetchCurrent = useSelector((state) => state.filters.fetchCurrent);
  const defaultFilters = useSelector((state) => state.filters.defaultFilters);
  const allFilters = useSelector((state) => state.filters);

  const [reset, setReset] = useCallback(useState(false));

  const handleFilters = useCallback(
    (value, filter, type) => {
      let currentFilters = { ...allFilters };
      if (
        filter === "itemNumber" ||
        filter === "rfqNum" ||
        filter === "poNum" ||
        filter === "tag" ||
        filter === "ruleType" ||
        filter === "status" ||
        filter === "bu" ||
        filter === "itemType" ||
        filter === "month" ||
        filter === "sortProgramsBy" ||
        filter === "groupBy" ||
        filter === "program" ||
        filter === "brand" ||
        filter === "user" ||
        filter === "purchaser" ||
        filter === "distributor" ||
        filter === "orderType" ||
        filter === "territory" ||
        filter === "supplier" ||
        filter === "favItems" ||
        filter === "itemDesc" ||
        filter === "stateIds"
      ) {
        let trimmedValue =
          filter === "itemNumber" ||
          filter === "rfqNum" ||
          filter === "poNum" ||
          filter === "itemDesc"
            ? value.trim()
            : value;
        dispatch(updateSingleFilter({ filter: filter, value: trimmedValue }));
        currentFilters[filter] = trimmedValue;
        if (
          filter !== "itemNumber" &&
          filter !== "rfqNum" &&
          filter !== "poNum" &&
          filter !== "itemDesc"
        ) {
          dispatch(setChips({ filterType: type }));
        }
      } else if (filter === "fromDate" || filter === "toDate") {
        dispatch(
          updateSingleFilter({
            filter: filter,
            value: format(value, "MM/dd/yyyy"),
          })
        );
        currentFilters[filter] = format(value, "MM/dd/yyyy");
      }
      if (
        filterType === "history-orders" &&
        filter !== "itemNumber" &&
        filter !== "rfqNum" &&
        filter !== "poNum" &&
        filter !== "itemDesc"
      ) {
        if (currentFilters.groupBy === "order") {
          dispatch(fetchFilteredOrderHistory(currentFilters));
        } else {
          dispatch(fetchFilteredOrderHistoryByItem(currentFilters));
        }
      }
      if (
        (filterType === "history-rollup" ||
          filterType === "history-approvals") &&
        filter !== "itemNumber" &&
        filter !== "rfqNum" &&
        filter !== "poNum" &&
        filter !== "itemDesc"
      ) {
        if (currentFilters.groupBy === "order") {
          dispatch(fetchFilteredOrderSets(currentFilters));
        } else {
          dispatch(fetchFilteredOrderSetItems(currentFilters));
        }
      }
      if (filterType === "itemRollup-rfq" && filter !== "itemNumber") {
        dispatch(fetchFilteredRFQItems(currentFilters));
      }
      if (filterType === "itemRollup-po" && filter !== "itemNumber") {
        dispatch(fetchFilteredPOItems(currentFilters));
      }
      if (
        filterType === "history-rfq" &&
        filter !== "itemNumber" &&
        filter !== "rfqNum" &&
        filter !== "itemDesc"
      ) {
        dispatch(fetchFilteredRFQHistory(currentFilters));
      }
      if (
        filterType === "history-po" &&
        filter !== "itemNumber" &&
        filter !== "poNum" &&
        filter !== "itemDesc"
      ) {
        dispatch(fetchFilteredPOHistory(currentFilters));
      }
      if (
        (filterType === "item-all" ||
          filterType === "item-inStock" ||
          filterType === "item-onDemand") &&
        filter !== "itemNumber" &&
        filter !== "itemDesc"
      ) {
        dispatch(fetchFilteredItems(currentFilters));
        dispatch(clearItemSelection());
      }
      if (filterType === "compliance-rules") {
        dispatch(fetchFilteredRules(currentFilters));
      }
      if (filterType === "compliance-items" && filter !== "itemNumber") {
        dispatch(fetchFilteredTriggeredRules(currentFilters));
      }
    },
    [dispatch, allFilters, filterType]
  );

  const {
    value: itemNumber,
    bind: bindSequenceNum,
    reset: resetSequenceNum,
  } = useDetailedInput("", handleFilters, "itemNumber", filterType);
  const { value: poNum, bind: bindPoNum, reset: resetPoNum } = useDetailedInput(
    "",
    handleFilters,
    "poNum",
    filterType
  );
  const {
    value: rfqNum,
    bind: bindRfqNum,
    reset: resetRfqNum,
  } = useDetailedInput("", handleFilters, "rfqNum", filterType);
  const {
    value: itemDesc,
    bind: bindItemDesc,
    reset: resetItemDesc,
  } = useDetailedInput("", handleFilters, "itemDesc", filterType);

  const resetAllFilters = useCallback(() => {
    setReset(true);
    resetSequenceNum();
    resetPoNum();
    resetRfqNum();
    resetItemDesc();
    dispatch(clearBrands());
    dispatch(resetFilters());
    if (defaultFilters) {
      dispatch(updateMultipleFilters({ filterObject: defaultFilters }));
      if (filterType === "history-orders") {
        if (defaultFilters.groupBy === "order") {
          dispatch(fetchFilteredOrderHistory(defaultFilters));
        } else {
          dispatch(fetchFilteredOrderHistoryByItem(defaultFilters));
        }
      }
      if (
        filterType === "history-rollup" ||
        filterType === "history-approvals"
      ) {
        dispatch(fetchFilteredOrderSets(defaultFilters));
      }
      if (
        filterType === "item-inStock" ||
        filterType === "item-in-stock" ||
        filterType === "item-onDemand" ||
        filterType === "item-on-demand" ||
        filterType === "item-all" ||
        filterType === "item-archive"
      ) {
        dispatch(fetchFilteredItems(defaultFilters));
        dispatch(clearItemSelection());
      }
      if (filterType === "itemRollup-rfq") {
        dispatch(fetchFilteredRFQItems(defaultFilters));
      }
      if (filterType === "itemRollup-po") {
        dispatch(fetchFilteredPOItems(defaultFilters));
      }
      if (filterType === "history-rfq") {
        dispatch(fetchFilteredRFQHistory(defaultFilters));
      }
      if (filterType === "history-po") {
        dispatch(fetchFilteredPOHistory(defaultFilters));
      }
      if (filterType === "compliance-rules") {
        dispatch(fetchFilteredRules(defaultFilters));
      }
      if (filterType === "compliance-items") {
        dispatch(fetchFilteredTriggeredRules(defaultFilters));
      }
      if (filterType === "user-settings") {
        dispatch(fetchFilteredUsers(defaultFilters));
      }
      dispatch(setChips({ filterType: allFilters.filterType }));
    }
  }, [
    dispatch,
    resetSequenceNum,
    resetPoNum,
    resetRfqNum,
    resetItemDesc,
    setReset,
    defaultFilters,
    filterType,
    allFilters.filterType,
  ]);

  //TODO write compliance (rules / items), budget search when available

  const handleOrderHistoryFetch = () => {
    dispatch(setChips({ filterType: "history" }));
    if (allFilters.groupBy === "order") {
      dispatch(fetchFilteredOrderHistory(allFilters));
    } else {
      dispatch(fetchFilteredOrderHistoryByItem(allFilters));
    }
  };

  const handleOrderSetFetch = () => {
    dispatch(setChips({ filterType: "history" }));
    if (allFilters.groupBy === "order") {
      dispatch(fetchFilteredOrderSets(allFilters));
    } else {
      dispatch(fetchFilteredOrderSetItems(allFilters));
    }
  };

  const handleFilteredItemFetch = () => {
    dispatch(setChips({ filterType: "item-all" }));
    dispatch(fetchFilteredItems(allFilters));
    dispatch(clearItemSelection());
  };

  const handleFilteredRFQFetch = () => {
    dispatch(setChips({ filterType: "history" }));
    dispatch(fetchFilteredRFQHistory(allFilters));
  };

  const handleRFQRollupFetch = () => {
    dispatch(setChips({ filterType: "itemRollup" }));
    dispatch(fetchFilteredRFQItems(allFilters));
  };

  const handleFilteredPOFetch = () => {
    dispatch(setChips({ filterType: "history" }));
    dispatch(fetchFilteredPOHistory(allFilters));
  };

  const handlePORollupFetch = () => {
    dispatch(setChips({ filterType: "itemRollup" }));
    dispatch(fetchFilteredPOItems(allFilters));
  };

  const handleComplianceRulesFetch = () => {
    dispatch(setChips({ filterType: "compliance" }));
    dispatch(fetchFilteredTriggeredRules(allFilters));
  };

  const historySearchMap = {
    orders: handleOrderHistoryFetch,
    rollup: handleOrderSetFetch,
    approvals: handleOrderSetFetch,
    rfq: handleFilteredRFQFetch,
    po: handleFilteredPOFetch,
  };

  useEffect(() => {
    if (setToClear) {
      if (retainFilters) {
        dispatch(setRetain({ value: false }));
      } else {
        resetAllFilters();
      }
    }
  }, [
    setToClear,
    resetAllFilters,
    retainFilters,
    allFilters,
    filterType,
    dispatch,
  ]);

  useEffect(() => {
    if (sorted || fetchCurrent) {
      //TODO handle po, compliance (rules / items), budget sorting here as well
      if (filterType === "history-orders") {
        if (allFilters.groupBy === "order") {
          dispatch(fetchFilteredOrderHistory(allFilters));
        } else {
          dispatch(fetchFilteredOrderHistoryByItem(allFilters));
        }
      }
      if (
        filterType === "history-rollup" ||
        filterType === "history-approvals"
      ) {
        if (allFilters.groupBy === "order") {
          dispatch(fetchFilteredOrderSets(allFilters));
        } else {
          dispatch(fetchFilteredOrderSetItems(allFilters));
        }
      }
      if (
        filterType === "item-inStock" ||
        filterType === "item-in-stock" ||
        filterType === "item-onDemand" ||
        filterType === "item-on-demand" ||
        filterType === "item-all" ||
        filterType === "item-archive"
      ) {
        dispatch(fetchFilteredItems(allFilters));
        dispatch(clearItemSelection());
      }
      if (filterType === "history-rfq") {
        dispatch(fetchFilteredRFQHistory(allFilters));
      }
      if (filterType === "history-po") {
        dispatch(fetchFilteredPOHistory(allFilters));
      }
      if (filterType === "itemRollup-rfq") {
        dispatch(fetchFilteredRFQItems(allFilters));
      }
      if (filterType === "itemRollup-po") {
        dispatch(fetchFilteredPOItems(allFilters));
      }
      if (filterType === "compliance-rules") {
        dispatch(fetchFilteredRules(allFilters));
      }
      if (filterType === "compliance-items") {
        dispatch(fetchFilteredTriggeredRules(allFilters));
      }
      if (filterType === "user-settings") {
        dispatch(fetchFilteredUsers(allFilters));
      }
      if (sorted) {
        dispatch(setSorted());
      }
      if (fetchCurrent) {
        dispatch(setFetchCurrent());
      }
    }
  }, [sorted, fetchCurrent, dispatch, filterType, allFilters]);

  return (
    <>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div
          style={{
            position: "relative",
            width: "Calc(100% - 40px)",
            padding: "20px",
            height: "Calc(100% - 87px)",
            marginTop: "84px",
          }}
        >
          <Typography
            className={classes.titleText}
            style={{ fontWeight: "500" }}
          >
            Filters:
          </Typography>
          <Divider />
          {filterType && filterType.includes("item-") && (
            <FiltersItems
              reset={reset}
              setReset={setReset}
              handleFilters={handleFilters}
              classes={classes}
              itemNumber={itemNumber}
              bindSequenceNum={bindSequenceNum}
              itemDesc={itemDesc}
              bindItemDesc={bindItemDesc}
              handleSearch={handleFilteredItemFetch}
            />
          )}
          {filterType && filterType.includes("history") && (
            <FiltersHistory
              reset={reset}
              setReset={setReset}
              handleFilters={handleFilters}
              classes={classes}
              itemNumber={itemNumber}
              bindSequenceNum={bindSequenceNum}
              rfqNum={rfqNum}
              bindRfqNum={bindRfqNum}
              poNum={poNum}
              bindPoNum={bindPoNum}
              handleSearch={historySearchMap[filterType.split("-")[1]]}
              historyType={filterType.split("-")[1]}
            />
          )}
          {filterType && filterType.includes("compliance") && (
            <FiltersCompliance
              reset={reset}
              setReset={setReset}
              handleFilters={handleFilters}
              classes={classes}
              itemNumber={itemNumber}
              bindSequenceNum={bindSequenceNum}
              handleSearch={handleComplianceRulesFetch}
              complianceType={filterType.split("-")[1]}
            />
          )}
          {filterType === "program" && (
            <FiltersPrograms
              reset={reset}
              setReset={setReset}
              handleFilters={handleFilters}
              classes={classes}
            />
          )}
          {filterType && filterType.includes("itemRollup") && (
            <FiltersItemRollup
              reset={reset}
              setReset={setReset}
              handleFilters={handleFilters}
              classes={classes}
              itemNumber={itemNumber}
              bindSequenceNum={bindSequenceNum}
              handleSearch={
                filterType.split("-")[1] === "rfq"
                  ? handleRFQRollupFetch
                  : handlePORollupFetch
              }
              rollupType={filterType.split("-")[1]}
            />
          )}
          {filterType && filterType.includes("budget") && (
            <FiltersBudget
              reset={reset}
              setReset={setReset}
              handleFilters={handleFilters}
              classes={classes}
              budgetType={filterType.split("-")[1]}
            />
          )}
        </div>
      </Drawer>
    </>
  );
};

FilterDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  handleDrawerClose: PropTypes.func.isRequired,
};

export default FilterDrawer;
