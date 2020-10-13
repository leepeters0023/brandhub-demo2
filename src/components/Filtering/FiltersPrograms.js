import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";

import BrandAutoComplete from "../Utility/BrandAutoComplete";
import BUAutoComplete from "../Utility/BUAutoComplete";
import FocusMonthAutoComplete from "../Utility/FocusMonthAutoComplete";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Typography from "@material-ui/core/Typography";

const FiltersPrograms = ({
  reset,
  setReset,
  handleFilters,
  classes,
}) => {
  const [value, setValue] = useCallback(useState("brand"));

  return (
    <>
      <List>
        <ListItem
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography className={classes.headerText}>
            Sort Pre-Order Programs By:
          </Typography>
          <br />
          <ButtonGroup
            orientation="vertical"
            fullWidth
            color="secondary"
            aria-label="program-sort"
          >
            <Button
              className={
                value === "brand" ? classes.largeButton : classes.selectedButton
              }
              variant={value === "brand" ? "contained" : "outlined"}
              onClick={() => {
                setValue("brand");
                handleFilters("brand", "sortProgramsBy", "program");
              }}
            >
              BRAND
            </Button>
            <Button
              className={
                value === "month" ? classes.largeButton : classes.selectedButton
              }
              variant={value === "month" ? "contained" : "outlined"}
              onClick={() => {
                setValue("month");
                handleFilters("month", "sortProgramsBy", "program");
              }}
            >
              FOCUS MONTH
            </Button>
            <Button
              className={
                value === "unit" ? classes.largeButton : classes.selectedButton
              }
              variant={value === "unit" ? "contained" : "outlined"}
              onClick={() => {
                setValue("unit");
                handleFilters("unit", "sortProgramsBy", "program");
              }}
            >
              BUSINESS UNIT
            </Button>
          </ButtonGroup>
        </ListItem>
        <ListItem />
        <Divider />
        <ListItem />
        <ListItem>
          <BrandAutoComplete
            classes={classes}
            handleChange={handleFilters}
            reset={reset}
            setReset={setReset}
            filterType={"item"}
          />
        </ListItem>
        <ListItem>
          <FocusMonthAutoComplete
            classes={classes}
            handleChange={handleFilters}
            reset={reset}
            setReset={setReset}
            filterType={"program"}
          />
        </ListItem>
        <ListItem>
          <BUAutoComplete
            classes={classes}
            handleChange={handleFilters}
            reset={reset}
            setReset={setReset}
            filterType={"program"}
          />
        </ListItem>
      </List>
    </>
  );
};

FiltersPrograms.propTypes = {
  reset: PropTypes.bool.isRequired,
  setReset: PropTypes.func.isRequired,
  handleFilters: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

export default FiltersPrograms;
