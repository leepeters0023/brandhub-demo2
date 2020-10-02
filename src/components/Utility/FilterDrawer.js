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

import FiltersItems from "./FiltersItems";
import FiltersHistory from "./FiltersHistory";

import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";

import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";

import { itemTypes, units } from "../../utility/constants";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  drawer: {
    width: "300px",
    flexShrink: 0,
  },
  drawerPaper: {
    width: "300px",
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
      if (
        type === "program" ||
        type === "sequenceNum" ||
        type === "status" ||
        type === "bu" ||
        type === "itemType"
      ) {
        dispatch(updateSingleFilter({ filter: type, value: value }));
        if (filterType === "item") {
          dispatch(setChips({ filterType: filterType }));
        }
      } else if (type === "fromDate" || type === "toDate") {
        dispatch(
          updateSingleFilter({
            filter: type,
            value: format(value, "MM/dd/yyyy"),
          })
        );
        if (filterType === "item") {
          dispatch(setChips({ filterType: filterType }));
        }
      } else if (
        type === "distributor" ||
        type === "brand" ||
        type === "user"
      ) {
        dispatch(
          updateSingleFilter({
            filter: type,
            value: value ? { id: value.id, name: value.name } : null,
          })
        );
        if (filterType === "item") {
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
  } = useDetailedInput("", handleFilters, "program");

  const resetAllFilters = useCallback(() => {
    setReset(true);
    resetSequenceNum();
    resetProgram();
    dispatch(clearBrands());
    dispatch(resetFilters());
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
    setReset,
    defaultFilters,
    filterType,
  ]);

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
              <ChevronLeftIcon
                fontSize="large"
                color="inherit"
              />
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
              handleSearch={
                filterType.includes("orders")
                  ? handleOrderHistoryFetch
                  : handleOrderSetFetch
              }
              historyType={filterType.split("-")[1]}
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
