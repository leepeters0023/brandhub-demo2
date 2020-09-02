import React, { useState } from "react";
import PropTypes from "prop-types";

import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  selectedButton: {
    fontWeight: "600",
    fontSize: "1rem",
    textAlign: "center",
    color: "#737373",
  },
}));

const ProgramSort = ({ setSortOption }) => {
  const classes = useStyles();

  const [value, setValue] = useState("brand");

  return (
    <>
      <ButtonGroup
        style={{ height: "40px", width: "450px", display: "flex", justifyContent: "flex-end" }}
        color="secondary"
        aria-label="program-sort"
      >
        <Tooltip title="Sort by Brand">
          <Button
            className={
              value === "brand" ? classes.largeButton : classes.selectedButton
            }
            variant={value === "brand" ? "contained" : "outlined"}
            onClick={() => {
              setValue("brand");
              setSortOption("brand");
            }}
          >
            BRAND
          </Button>
        </Tooltip>
        <Tooltip title="Sort by Focus Month">
          <Button
            className={
              value === "month" ? classes.largeButton : classes.selectedButton
            }
            variant={value === "month" ? "contained" : "outlined"}
            onClick={() => {
              setValue("month");
              setSortOption("month");
            }}
          >
            FOCUS MONTH
          </Button>
        </Tooltip>
        <Tooltip title="Sort by Business Unit">
          <Button
            className={
              value === "unit" ? classes.largeButton : classes.selectedButton
            }
            variant={value === "unit" ? "contained" : "outlined"}
            onClick={() => {
              setValue("unit");
              setSortOption("unit");
            }}
          >
            BUSINESS UNIT
          </Button>
        </Tooltip>
      </ButtonGroup>
    </>
  );
};

ProgramSort.propTypes = {
  setSortOption: PropTypes.func.isRequired,
};

export default ProgramSort;
