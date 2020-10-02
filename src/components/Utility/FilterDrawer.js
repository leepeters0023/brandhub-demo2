import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import format from "date-fns/format";

import { useSelector, useDispatch } from "react-redux";

import {
  updateMultipleFilters,
  updateSingleFilter,
  resetFilters,
} from "../../redux/slices/filterSlice";

import { useDetailedInput } from "../../hooks/UtilityHooks";

import FiltersItems from "./FiltersItems";

import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";

import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";

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

  const [reset, setReset] = useCallback(useState(false));

  const handleFilters = useCallback(
    (value, type) => {
      if (
        type === "program" ||
        type === "sequenceNum" ||
        type === "status" ||
        type === "bu" ||
        type === "itemType"
      ) {
        dispatch(updateSingleFilter({ filter: type, value: value }));
      } else if (type === "fromDate" || type === "toDate") {
        dispatch(
          updateSingleFilter({
            filter: type,
            value: format(value, "MM/dd/yyyy"),
          })
        );
      } else if (
        type === "distributor" ||
        type === "brand" ||
        type === "user"
      ) {
        dispatch(
          updateSingleFilter({
            filter: type,
            value: value ? value.id : null,
          })
        );
      }
    },
    [dispatch]
  );

  const {
    value: sequenceNum,
    bind: bindSequenceNum,
    reset: resetSequenceNum,
  } = useDetailedInput("", handleFilters, "sequenceNum");

  const resetAllFilters = (filterObject) => {
    setReset(true);
    resetSequenceNum();
    if (filterObject) {
      dispatch(updateMultipleFilters({ filterObject: filterObject }));
    } else dispatch(resetFilters());
  };

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
              <DoubleArrowIcon
                fontSize="large"
                style={{ transform: "rotate(180deg)" }}
                color="inherit"
              />
            </IconButton>
          </Tooltip>
          <Typography className={classes.titleText}>Filters:</Typography>
          <Divider />
          {window.location.href.includes("items") && (
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
