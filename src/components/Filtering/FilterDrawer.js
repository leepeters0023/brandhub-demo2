import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import format from "date-fns/format";

import { useSelector, useDispatch } from "react-redux";

import {
  updateMultipleFilters,
  updateSingleFilter,
  setChips,
  resetFilters,
} from "../../redux/slices/filterSlice";

import { fetchFilteredOrderHistory } from "../../redux/slices/orderHistorySlice";
import { fetchFilteredOrderSets } from "../../redux/slices/orderSetHistorySlice";
import { clearBrands } from "../../redux/slices/brandSlice";

import { useDetailedInput } from "../../hooks/UtilityHooks";

import FiltersItems from "../Utility/FiltersItems";
import FiltersHistory from "./FiltersHistory";
import FiltersPrograms from "./FiltersPrograms";
import FiltersItemRollup from "./FiltersItemRollup";
import FiltersCompliance from "./FiltersCompliance";
import FiltersBudget from "./FiltersBudget";

import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";

import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";

import {
  itemTypes,
  units,
  ruleTypes,
  suppliers,
} from "../../utility/constants";

const focusMonths = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  drawer: {
    width: "300px",
    flexShrink: 0,
  },
  drawerPaper: {
    width: "300px",
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
  const sorted = useSelector((state) => state.filters.sorted);
  const defaultFilters = useSelector((state) => state.filters.defaultFilters);
  const allFilters = useSelector((state) => state.filters);

  const [reset, setReset] = useCallback(useState(false));

  const handleFilters = useCallback(
    (value, type, filterType) => {
      console.log(filterType);
      if (
        type === "program" ||
        type === "sequenceNum" ||
        type === "rfqNum" ||
        type === "poNum" ||
        type === "tag" ||
        type === "ruleType" ||
        type === "status" ||
        type === "bu" ||
        type === "itemType" ||
        type === "month" ||
        type === "sortProgramsBy"
      ) {
        dispatch(updateSingleFilter({ filter: type, value: value }));
        if (
          !filterType.includes("history") &&
          filterType !== "itemRollup" &&
          !filterType.includes("compliance") &&
          !filterType.includes("budget")
        ) {
          dispatch(setChips({ filterType: filterType }));
        }
      } else if (type === "fromDate" || type === "toDate") {
        dispatch(
          updateSingleFilter({
            filter: type,
            value: format(value, "MM/dd/yyyy"),
          })
        );
        if (
          !filterType.includes("history") &&
          filterType !== "itemRollup" &&
          !filterType.includes("compliance") &&
          !filterType.includes("budget")
        ) {
          dispatch(setChips({ filterType: filterType }));
        }
      } else if (
        type === "distributor" ||
        type === "brand" ||
        type === "user" ||
        type === "territory"
      ) {
        dispatch(
          updateSingleFilter({
            filter: type,
            value: value ? { id: value.id, name: value.name } : null,
          })
        );
        if (
          !filterType.includes("history") &&
          filterType !== "itemRollup" &&
          !filterType.includes("compliance") &&
          !filterType.includes("budget")
        ) {
          dispatch(setChips({ filterType: filterType }));
        }
      }
    },
    [dispatch]
  );

  const {
    value: sequenceNum,
    bind: bindSequenceNum,
    reset: resetSequenceNum,
  } = useDetailedInput("", handleFilters, "sequenceNum", filterType);
  const {
    value: program,
    bind: bindProgram,
    reset: resetProgram,
  } = useDetailedInput("", handleFilters, "program", filterType);
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

  const resetAllFilters = useCallback(() => {
    setReset(true);
    resetSequenceNum();
    resetProgram();
    resetPoNum();
    resetRfqNum();
    dispatch(clearBrands());
    dispatch(resetFilters());
    //TODO handle po, compliance (rules / items), rfq fetch here as well
    if (defaultFilters) {
      dispatch(updateMultipleFilters({ filterObject: defaultFilters }));
      if (filterType === "history-orders") {
        dispatch(fetchFilteredOrderHistory(defaultFilters));
      }
      if (
        filterType === "history-rollup" ||
        filterType === "history-approvals"
      ) {
        dispatch(fetchFilteredOrderSets(defaultFilters));
      }
    }
  }, [
    dispatch,
    resetProgram,
    resetSequenceNum,
    resetPoNum,
    resetRfqNum,
    setReset,
    defaultFilters,
    filterType,
  ]);

  //TODO write PO, rfq, compliance (rules / items), items, budget search when available

  const handleOrderHistoryFetch = () => {
    dispatch(setChips({ filterType: "history" }));
    dispatch(fetchFilteredOrderHistory(allFilters));
  };

  const handleOrderSetFetch = () => {
    dispatch(setChips({ filterType: "history" }));
    dispatch(fetchFilteredOrderSets(allFilters));
  };

  useEffect(() => {
    if (setToClear) {
      resetAllFilters();
    }
  }, [setToClear, resetAllFilters]);

  useEffect(() => {
    if (sorted) {
      //TODO handle po, rfq, compliance (rules / items), budget sorting here as well
      if (filterType === "history-orders") {
        dispatch(fetchFilteredOrderHistory(allFilters));
      }
      if (
        filterType === "history-rollup" ||
        filterType === "history-approvals"
      ) {
        dispatch(fetchFilteredOrderSets(allFilters));
      }
    }
  }, [sorted, dispatch, filterType, allFilters]);

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
          <Tooltip title="Close Filters">
            <IconButton
              onClick={handleDrawerClose}
              style={{ position: "absolute", top: "10px", right: "0" }}
            >
              <ChevronLeftIcon fontSize="large" color="inherit" />
            </IconButton>
          </Tooltip>
          <Typography className={classes.titleText}>Filters:</Typography>
          <Divider />
          {filterType === "item" && (
            <FiltersItems
              itemTypes={itemTypes}
              units={units}
              reset={reset}
              setReset={setReset}
              handleFilters={handleFilters}
              classes={classes}
              sequenceNum={sequenceNum}
              bindSequenceNum={bindSequenceNum}
            />
          )}
          {filterType && filterType.includes("history") && (
            <FiltersHistory
              reset={reset}
              setReset={setReset}
              handleFilters={handleFilters}
              classes={classes}
              sequenceNum={sequenceNum}
              bindSequenceNum={bindSequenceNum}
              program={program}
              bindProgram={bindProgram}
              rfqNum={rfqNum}
              bindRfqNum={bindRfqNum}
              poNum={poNum}
              bindPoNum={bindPoNum}
              itemTypes={itemTypes}
              suppliers={suppliers}
              handleSearch={
                filterType.includes("orders")
                  ? handleOrderHistoryFetch
                  : handleOrderSetFetch
              }
              historyType={filterType.split("-")[1]}
            />
          )}
          {filterType && filterType.includes("compliance") && (
            <FiltersCompliance
              reset={reset}
              setReset={setReset}
              handleFilters={handleFilters}
              classes={classes}
              sequenceNum={sequenceNum}
              bindSequenceNum={bindSequenceNum}
              program={program}
              bindProgram={bindProgram}
              itemTypes={itemTypes}
              ruleTypes={ruleTypes}
              handleSearch={
                // TODO add search for po when api is there
                () => console.log("Searching!")
              }
              complianceType={filterType.split("-")[1]}
            />
          )}
          {filterType === "program" && (
            <FiltersPrograms
              units={units}
              months={focusMonths}
              reset={reset}
              setReset={setReset}
              handleFilters={handleFilters}
              classes={classes}
            />
          )}
          {filterType === "itemRollup" && (
            <FiltersItemRollup
              reset={reset}
              setReset={setReset}
              handleFilters={handleFilters}
              classes={classes}
              sequenceNum={sequenceNum}
              bindSequenceNum={bindSequenceNum}
              program={program}
              bindProgram={bindProgram}
              itemTypes={itemTypes}
              handleSearch={
                // TODO add search for po when api is there
                () => console.log("Searching!")
              }
            />
          )}
          {filterType && filterType.includes("budget") && (
            <FiltersBudget
              reset={reset}
              setReset={setReset}
              handleFilters={handleFilters}
              classes={classes}
              handleSearch={
                // TODO add search for po when api is there
                () => console.log("Searching!")
              }
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