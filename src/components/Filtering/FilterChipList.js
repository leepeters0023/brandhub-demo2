import React from "react";

import { useSelector, useDispatch } from "react-redux";

import {
  updateSingleFilter,
  setClear,
  setChips,
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

  const handleChipClick = (type, value) => {
    let dispatchObject = { filter: type, value: null };
    if (type === "itemType" || type === "bu") {
      let currentFilterArray = filterState[type].filter((f) => f !== value);
      dispatchObject.value = currentFilterArray;
    }
    dispatch(updateSingleFilter(dispatchObject));
    dispatch(setChips({ filterType: "item" }));
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {filterState.chipList.map((filter) =>
        filterState.filterType === "item" ? (
          <Chip
            style={{ margin: "auto 2.5px" }}
            color="primary"
            key={`${filter.type}-${filter.value}`}
            label={filter.value}
            onDelete={() => handleChipClick(filter.type, filter.value)}
          />
        ) : (
          <Chip
            style={{ margin: "auto 2.5px" }}
            color="primary"
            key={`${filter.type}-${filter.value}`}
            label={filter.value}
          />
        )
      )}
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
