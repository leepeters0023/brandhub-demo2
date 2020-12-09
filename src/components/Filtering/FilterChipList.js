import React from "react";

import { useSelector, useDispatch } from "react-redux";

import {
  updateSingleFilter,
  setClear,
  setChips,
  setSorted,
} from "../../redux/slices/filterSlice";

import Chip from "@material-ui/core/Chip";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const FilterChipList = () => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const filterState = useSelector((state) => state.filters);
  const filterType = useSelector((state) => state.filters.filterType);

  const handleChipClick = (type, value) => {
    let dispatchObject = { filter: type, value: null };
    if (
      type === "month" ||
      type === "ruleType"
    ) {
      let currentFilterArray = filterState[type].filter((f) => f !== value);
      dispatchObject.value = currentFilterArray;
    }
    if (
      type === "bu" ||
      type === "program" ||
      type === "itemType" ||
      type === "brand" ||
      type === "user" ||
      type === "distributor" ||
      type === "territory" ||
      type === "supplier"
    ) {
      let currentFilterArray = filterState[type].filter(
        (f) => f.name !== value
      );
      dispatchObject.value = currentFilterArray;
    }
    if (type === "favItems") {
      dispatchObject.value = [];
    }
    dispatch(updateSingleFilter(dispatchObject));
    dispatch(setChips({ filterType: filterType }));
    dispatch(setSorted());
  };

  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
      {filterState.chipList.map((filter) => (
        <Chip
          style={{ margin: "auto 2.5px" }}
          color="primary"
          key={`${filter.type}-${filter.value}`}
          label={filter.value}
          onDelete={() => handleChipClick(filter.type, filter.value)}
        />
      ))}
      {filterState.chipList.length > 0 && (
        <Typography
          variant="body2"
          color="textSecondary"
          className={classes.hoverText}
          style={{ marginLeft: "20px" }}
          onClick={() => {
            dispatch(setClear());
          }}
        >
          Clear Filters
        </Typography>
      )}
    </div>
  );
};

export default FilterChipList;
